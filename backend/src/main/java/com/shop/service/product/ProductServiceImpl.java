package com.shop.service.product;

import com.shop.config.error.BadRequestException;
import com.shop.domain.category.Category;
import com.shop.domain.category.SubCategory;
import com.shop.domain.dto.product.ProductDTO;
import com.shop.domain.entity.EntityStatus;
import com.shop.domain.product.Product;
import com.shop.domain.product.ProductState;
import com.shop.domain.product.ProductTag;
import com.shop.repository.mongo.product.ProductMongoRepository;
import com.shop.service.category.CategoryService;
import com.shop.service.category.SubCategoryService;
import com.shop.util.FileManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
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
                .tagTitle(product.getProductTag()!=null ? product.getProductTag().getTitle() : null)
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
        productForUpdate.setProductTag(newProduct.getProductTag());
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
    public Page<ProductDTO> getProductsByFilters (Optional<String> categoryId, Optional<String> brand, Optional<Integer> minPrice, Optional<Integer> maxPrice, Optional<String> filter, Pageable pageable) {
        Query query = new Query();

        query.addCriteria(Criteria.where("entity_status").is(EntityStatus.REGULAR));
        query.addCriteria(Criteria.where("state").is(PUBLISHED));

        // Apply filters based on optional parameters
        categoryId.ifPresent(catId -> query.addCriteria(Criteria.where("category.$id").is(new ObjectId(catId))));
        brand.ifPresent(br -> query.addCriteria(Criteria.where("brand").is(br)));

        if (minPrice.isPresent() || maxPrice.isPresent()){
            query.addCriteria(Criteria.where("price").gte(minPrice.orElse(0)).lte(maxPrice.orElse(10000)));
        }

        filter.ifPresent(fl -> {
            query.addCriteria(Criteria.where("name").regex(fl, "i"));
        });
        List<ProductDTO> products = mongoTemplate.find(query.with(pageable), Product.class).stream().map(this::convertToDTO).collect(Collectors.toList());
        long count = mongoTemplate.count(query, Product.class);
        return  new PageImpl<>(products,pageable,count);
    }

    /**
     * @return
     */
    @Override
    public List<String> getProductBrands() {
        return  mongoTemplate.findDistinct("brand", Product.class, String.class);
    }

    /**
     * @return
     */
    @Override
    public List<ProductDTO> getNewProducts() {
        return productMongoRepository.findTop20ByStateAndEntityStatusOrderByPublishedDateDesc(PUBLISHED,EntityStatus.REGULAR).stream().map(this::convertToDTO).collect(Collectors.toList());
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


    private Product convertFromDTO (ProductDTO productDTO){
        Product product= new Product();
        product.setName(productDTO.getName());
        product.setCategory(categoryService.getOneCategory(productDTO.getCategoryId()));
        if (productDTO.getSubCategoryId()!=null) {
            product.setSubCategory(subCategoryService.getSubCategory(productDTO.getSubCategoryId()));
        }
        product.setCode(productDTO.getCode());
        product.setPrice(productDTO.getPrice());
        product.setDescription(productDTO.getDescription());
        product.setBrand(productDTO.getBrand());
        product.setQuantity(productDTO.getQuantity());
        product.setSpecification(productDTO.getSpecifications());
        if (productDTO.isPublish()){
            product.setState(PUBLISHED);
        }else {
            product.setState(ProductState.DRAFT);
        }
        product.setDiscount(productDTO.getDiscount());
        product.setProductTag(productTagService.getProductTagById(productDTO.getTagId()));
        product.setDiscountStartDate(productDTO.getDiscountStartDate().atStartOfDay());
        product.setDiscountEndDate(productDTO.getDiscountEndDate().atTime(23,59,59));
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


        productDTO.setTagId(Optional.ofNullable(product.getProductTag()).map(ProductTag::getId).orElse(null));
        productDTO.setTagTitle(Optional.ofNullable(product.getProductTag()).map(ProductTag::getTitle).orElse(null));

        productDTO.setPublish(PUBLISHED.equals(product.getState()));
        return productDTO;
    }

    private Double calculatePriceWithDiscount(Double price, Integer discount){
        return price-(price*discount/100);
    }
}
