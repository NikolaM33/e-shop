package com.shop.service.product;

import com.google.gson.Gson;
import com.shop.config.error.BadRequestException;
import com.shop.domain.dto.product.ProductDTO;
import com.shop.domain.entity.EntityStatus;
import com.shop.domain.product.Product;
import com.shop.domain.product.ProductState;
import com.shop.repository.mongo.product.ProductMongoRepository;
import com.shop.service.category.CategoryService;
import com.shop.service.category.SubCategoryService;
import com.shop.util.FileManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import static com.shop.config.error.ErrorMessageConstants.FILE_UPLOAD_ERROR;

@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Service
public class ProductServiceImpl implements ProductService{

    private  final CategoryService categoryService;

    private final SubCategoryService subCategoryService;

    private final FileManager fileManager;

    private final ProductMongoRepository productMongoRepository;

    /**
     * @param productDTO
     * @param images
     * @return
     */
    @Override
    public Boolean createNewProduct(ProductDTO productDTO, List<MultipartFile> images) {
        Product product= convertFromDTO(productDTO);

        product.setEntityStatus(EntityStatus.REGULAR);

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
                .name(product.getName()).image1FileIdentifier(product.getImage1FileIdentifier()).price(product.getPrice()).code(product.getCode()).build());
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
        product.setQuantity(product.getQuantity());
        product.setSpecification(productDTO.getSpecifications());
        if (productDTO.isPublished()){
            product.setState(ProductState.PUBLISHED);
        }else {
            product.setState(ProductState.DRAFT);
        }

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
        productDTO.setSpecifications(product.getSpecification());
        return productDTO;
    }
}
