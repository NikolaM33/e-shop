package com.shop.service.product;

import com.mongodb.internal.operation.AggregateToCollectionOperation;
import com.shop.config.error.BadRequestException;
import com.shop.domain.category.Category;
import com.shop.domain.category.SubCategory;
import com.shop.domain.dto.product.ProductDTO;
import com.shop.domain.entity.EntityStatus;
import com.shop.domain.product.Product;
import com.shop.domain.product.ProductState;
import com.shop.domain.product.ProductTag;
import com.shop.domain.product.ProductType;
import com.shop.repository.mongo.product.ProductMongoRepository;
import com.shop.service.category.CategoryService;
import com.shop.service.category.SubCategoryService;
import com.shop.util.FileManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.shop.config.error.ErrorMessageConstants.FILE_UPLOAD_ERROR;
import static com.shop.config.error.ErrorMessageConstants.PRODUCT_NOT_FOUND;
import static com.shop.domain.product.ProductState.DRAFT;
import static com.shop.domain.product.ProductState.PUBLISHED;

@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Service
public class ProductServiceImpl implements ProductService{

    private  final CategoryService categoryService;

    private final SubCategoryService subCategoryService;

    private final FileManager fileManager;

    private final ProductMongoRepository productMongoRepository;

    private final MongoTemplate mongoTemplate;

    private final ProductTagService productTagService;


    /**
     * @param productDTO
     * @param images
     * @return
     */
    @Override
    public Boolean createNewProduct(ProductDTO productDTO, List<MultipartFile> images) {
        Product product= convertFromDTO(productDTO);

        product.setEntityStatus(EntityStatus.REGULAR);
        if (product.getState().equals(PUBLISHED)){
            product.setPublishedDate(LocalDateTime.now());
        }
        for (int i=0; i<images.size(); i++){
            byte[] imageData;
            try {
                imageData = images.get(i).getBytes();
            } catch (IOException e) {
                throw new BadRequestException(FILE_UPLOAD_ERROR);
            }
            setProductImages(product,i+1,fileManager.saveFileToSystem(imageData, fileManager.PRODUCT_IMAGES_FILES_PATH));
        }
        productMongoRepository.save(product);
        return true;
    }

    /**
     * @param state
     * @param categoryId
     * @param pageable
     * @return
     */
    @Override
    public Page<ProductDTO> getProducts(Optional<String> state, Optional<String> categoryId, Pageable pageable) {
        return productMongoRepository.findByEntityStatus(EntityStatus.REGULAR,pageable).map(product -> ProductDTO.builder().id(product.getId())
                .name(product.getName()).image1FileIdentifier(product.getImage1FileIdentifier()).price(product.getPrice()).code(product.getCode())
                .tagTitle(product.getTag()!=null ? product.getTag().getTitle() : null)
                .priceWithDiscount((product.getDiscount() !=null && product.getDiscountStartDate().isBefore(LocalDateTime.now()) && product.getDiscountEndDate().isAfter(LocalDateTime.now()) ? calculatePriceWithDiscount(product.getPrice(), product.getDiscount()) : null) )
                .build());
    }

    /**
     * @param productId
     * @return
     */
    @Override
    public ProductDTO getProduct(String productId) {
        return productMongoRepository.findByIdAndEntityStatus(productId,EntityStatus.REGULAR).map(this::convertToDTO).orElseThrow(()->new BadRequestException(PRODUCT_NOT_FOUND));
    }

    /**
     * @param productId  String
     * @param productDTO ProductDTO
     * @param images  List<MultipartFile>
     * @return ProductDTO
     */
    @Override
    @Transactional
    public ProductDTO updateProduct(String productId, ProductDTO productDTO, List<MultipartFile> images) {
        Product productForUpdate= productMongoRepository.findByIdAndEntityStatus(productId,EntityStatus.REGULAR).orElseThrow(()->new BadRequestException(PRODUCT_NOT_FOUND));

        Product newProduct= convertFromDTO(productDTO);

        productForUpdate.setName(newProduct.getName());
        productForUpdate.setCode(newProduct.getCode());
        productForUpdate.setPrice(newProduct.getPrice());
        productForUpdate.setDescription(newProduct.getDescription());
        productForUpdate.setBrand(newProduct.getBrand());
        productForUpdate.setQuantity(newProduct.getQuantity());
        productForUpdate.setSpecification(newProduct.getSpecification());
        productForUpdate.setCategory(newProduct.getCategory());
        productForUpdate.setSubCategory(newProduct.getSubCategory());
        if (productForUpdate.getState().equals(DRAFT) && newProduct.getState().equals(PUBLISHED)){
            productForUpdate.setPublishedDate(LocalDateTime.now());
        }
        productForUpdate.setState(newProduct.getState());
        productForUpdate.setTag(newProduct.getTag());
        productForUpdate.setBrand(newProduct.getBrand());
        productForUpdate.setDiscount(newProduct.getDiscount());
        productForUpdate.setDiscountStartDate(newProduct.getDiscountStartDate());
        productForUpdate.setDiscountEndDate(newProduct.getDiscountEndDate());

        return convertToDTO(productMongoRepository.save(productForUpdate));
    }

    /**
     * @param categoryId
     * @param brand
     * @param minPrice
     * @param maxPrice
     * @param filter
     * @param pageable
     * @return
     */
    @Override
    public Page<ProductDTO> getProductsByFilters (Optional<String> categoryId, Optional<ArrayList<String>> brand, Optional<Integer> minPrice, Optional<Integer> maxPrice, Optional<String> filter, Optional<String> type, Pageable pageable) {
        List<AggregationOperation> operations = new ArrayList<>();

        // Base match for product status
        operations.add(Aggregation.match(Criteria.where("entity_status").is(EntityStatus.REGULAR)
                .and("state").is(PUBLISHED)));
        operations.add(Aggregation.match(Criteria.where("publishedDate").exists(true)));
        // Lookup category with proper DBRef handling
        operations.add(Aggregation.lookup("categories", "category.$id", "_id", "categoryInfo"));
        operations.add(Aggregation.unwind("categoryInfo"));


        // Match category status
        operations.add(Aggregation.match(Criteria.where("categoryInfo.entity_status").is(EntityStatus.REGULAR)));
        operations.add(Aggregation.match(Criteria.where("categoryInfo.active").is(true)));


        categoryId.ifPresent(catId -> {
            operations.add(Aggregation.match(Criteria.where("category.$id").is(new ObjectId(catId))));
        });

        brand.ifPresent(br -> {
            operations.add(Aggregation.match(Criteria.where("brand").in(br)));
        });

        if (minPrice.isPresent() || maxPrice.isPresent()) {
            Criteria priceCriteria = Criteria.where("price");
            minPrice.ifPresent(min -> priceCriteria.gte(min));
            maxPrice.ifPresent(max -> priceCriteria.lte(max));
            operations.add(Aggregation.match(priceCriteria));
        }

        type.ifPresent(t -> {
            operations.add(Aggregation.match(Criteria.where("type").is(t)));
        });

        filter.ifPresent(fl -> {
            operations.add(Aggregation.match(Criteria.where("name").regex(fl, "i")));
        });

        // Count total matching documents (before pagination)
        List<AggregationOperation> countOperations = new ArrayList<>(operations);
        countOperations.add(Aggregation.count().as("total"));
        Aggregation countAggregation = Aggregation.newAggregation(countOperations);
        AggregationResults<Document> countResults = mongoTemplate.aggregate(countAggregation, Product.class, Document.class);
        int total = countResults.getMappedResults().stream()
                .findFirst()
                .map(doc -> (Integer) doc.get("total"))
                .orElse(0); // Default to 0 if no results


        // Add pagination
        operations.add(Aggregation.skip((long) pageable.getOffset()));
        operations.add(Aggregation.limit(pageable.getPageSize()));

        // Execute query
        Aggregation aggregation = Aggregation.newAggregation(operations);
        AggregationResults<Product> results = mongoTemplate.aggregate(aggregation, Product.class, Product.class);

        List<ProductDTO> products = results.getMappedResults().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(products, pageable, total);
    }

    /**
     * @return
     */
    @Override
    public List<String> getProductBrands(Optional<String> type) {
        Query query = new Query();

        query.addCriteria(Criteria.where("brand").exists(true));

        query.addCriteria(Criteria.where("entity_status").is(EntityStatus.REGULAR.name()));
        query.addCriteria(Criteria.where("state").is(PUBLISHED.name()));
        type.ifPresent(t->query.addCriteria(Criteria.where("type").is(t.toUpperCase())));

        // Perform the query to find distinct brands
        return  mongoTemplate.findDistinct(query,"brand", Product.class, String.class);
    }

    /**
     * @return
     */
    @Override
    public List<ProductDTO> getNewProducts() {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("state").is(PUBLISHED).and("entity_status").is(EntityStatus.REGULAR)),
                Aggregation.lookup("categories", "category.$id", "_id", "category"),
                Aggregation.unwind("category"),
                Aggregation.match(Criteria.where("category.entity_status").is(EntityStatus.REGULAR)),
                Aggregation.match(Criteria.where("category.active").is(true)),
                Aggregation.match(Criteria.where("publishedDate").exists(true)),
                Aggregation.sort(Sort.by(Sort.Direction.DESC, "publishedDate")),
                Aggregation.limit(20)
        );

        List<Product> results = mongoTemplate.aggregate(aggregation, "product", Product.class).getMappedResults();

        return results.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    /**
     * @param categoryId
     * @return
     */
    @Override
    public List<ProductDTO> getProductsFromCategory(String categoryId) {
        categoryService.getOneCategory(categoryId);
        return productMongoRepository.findTop10ByCategoryIdAndStatePublishedAndStatusRegular(new ObjectId(categoryId)).stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    /**
     * @return
     */
    @Override
    public List<ProductDTO> getRandomProducts() {
        int limit = 8;
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("state").is(PUBLISHED).and("entity_status").is(EntityStatus.REGULAR)),
                Aggregation.lookup("categories", "category.$id", "_id", "category"),
                Aggregation.unwind("category"),
                Aggregation.match(Criteria.where("category.entity_status").is(EntityStatus.REGULAR)),
                Aggregation.match(Criteria.where("category.active").is(true)),
                Aggregation.match(Criteria.where("publishedDate").exists(true)),
                Aggregation.sample(limit)
        );

        List<Product> randomProducts = mongoTemplate.aggregate(aggregation, "product", Product.class).getMappedResults();
        return randomProducts.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    /**
     * @return
     */
    @Override
    public List<ProductDTO> getLowStockProducts() {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("state").is(PUBLISHED).and("entity_status").is(EntityStatus.REGULAR)),
                Aggregation.sort(Sort.by(Sort.Direction.ASC, "quantity")),
                Aggregation.limit(10)
        );

        List<Product> results = mongoTemplate.aggregate(aggregation, "product", Product.class).getMappedResults();

        return results.stream().map(this::convertToDTO).collect(Collectors.toList());
    }


    private Product convertFromDTO (ProductDTO productDTO){
        Product product= new Product();
        product.setName(productDTO.getName());
        product.setCategory(categoryService.getOneCategory(productDTO.getCategoryId()));
        if (productDTO.getSubCategoryId()!=null && !productDTO.getSubCategoryId().isEmpty()) {
            product.setSubCategory(subCategoryService.getSubCategory(productDTO.getSubCategoryId()));
        }
        product.setCode(productDTO.getCode());
        product.setPrice(productDTO.getPrice());
        product.setDescription(productDTO.getDescription());
        product.setBrand(productDTO.getBrand().toUpperCase());
        product.setQuantity(productDTO.getQuantity());
        product.setSpecification(productDTO.getSpecifications());
        if (productDTO.isPublish()){
            product.setState(PUBLISHED);
        }else {
            product.setState(ProductState.DRAFT);
        }

        if (productDTO.getDiscount() != null){
            product.setDiscount(productDTO.getDiscount());
            product.setDiscountStartDate(productDTO.getDiscountStartDate().atStartOfDay());
            product.setDiscountEndDate(productDTO.getDiscountEndDate().atTime(23,59,59));
        }
        if(!productDTO.getTagId().isEmpty()) {
            product.setTag(productTagService.getProductTagById(productDTO.getTagId()));
        }
        product.setSizes(productDTO.getSizes());
        product.setColors(productDTO.getColors());
        product.setSizeColorMapping(productDTO.getSizeColorMapping());
        ProductType type = Arrays.stream(ProductType.values())
                .filter(t -> t.name().equalsIgnoreCase(productDTO.getType()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid product type: " + productDTO.getType()));

        product.setType(type);
        return product;
    }

    private void setProductImages (Product product,int i, String fileIdentifier ){
        switch (i){
            case 1:
                product.setImage1FileIdentifier(fileIdentifier);
                break;
            case 2:
                product.setImage2FileIdentifier(fileIdentifier);
                break;
            case 3:
                product.setImage3FileIdentifier(fileIdentifier);
                break;
            case 4:
                product.setImage4FileIdentifier(fileIdentifier);
                break;
            case 5:
                product.setImage5FileIdentifier(fileIdentifier);
                break;
            case 6:
                product.setImage6FileIdentifier(fileIdentifier);
                break;
            default:
                break;
        }
    }

    private ProductDTO convertToDTO (Product product){
        ProductDTO  productDTO= new ProductDTO();
        productDTO.setId(product.getId());
        productDTO.setName(product.getName());
        productDTO.setPrice(product.getPrice());
        productDTO.setCode(product.getCode());
        productDTO.setQuantity(product.getQuantity());
        productDTO.setDescription(product.getDescription());
        productDTO.setDiscount(product.getDiscount());
        productDTO.setBrand(product.getBrand());
        productDTO.setImage1FileIdentifier(product.getImage1FileIdentifier());
        productDTO.setImage2FileIdentifier(product.getImage2FileIdentifier());
        productDTO.setImage3FileIdentifier(product.getImage3FileIdentifier());
        productDTO.setImage4FileIdentifier(product.getImage4FileIdentifier());
        productDTO.setImage5FileIdentifier(product.getImage5FileIdentifier());
        productDTO.setImage6FileIdentifier(product.getImage6FileIdentifier());
        productDTO.setSpecifications(product.getSpecification());


        productDTO.setCategoryId(Optional.ofNullable(product.getCategory()).map(Category::getId).orElse(null));
        productDTO.setSubCategoryId(Optional.ofNullable(product.getSubCategory()).map(SubCategory::getId).orElse(null));

        productDTO.setDiscountStartDate(Optional.ofNullable(product.getDiscountStartDate())
                .map(date -> date.toLocalDate())
                .orElse(null));
        productDTO.setDiscountEndDate(Optional.ofNullable(product.getDiscountEndDate())
                .map(date -> date.toLocalDate())
                .orElse(null));


        productDTO.setTagId(Optional.ofNullable(product.getTag()).map(ProductTag::getId).orElse(null));
        productDTO.setTagTitle(Optional.ofNullable(product.getTag()).map(ProductTag::getTitle).orElse(null));

        productDTO.setPublish(PUBLISHED.equals(product.getState()));
        productDTO.setColors(product.getColors());
        productDTO.setSizes(product.getSizes());
        productDTO.setPriceWithDiscount((product.getDiscount() !=null && product.getDiscountStartDate().isBefore(LocalDateTime.now()) && product.getDiscountEndDate().isAfter(LocalDateTime.now()) ? calculatePriceWithDiscount(product.getPrice(), product.getDiscount()) : null) );

        return productDTO;
    }

    private Double calculatePriceWithDiscount(Double price, Integer discount){
        return price-(price*discount/100);
    }
}
