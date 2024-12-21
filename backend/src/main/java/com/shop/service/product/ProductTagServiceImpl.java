package com.shop.service.product;

import com.shop.config.error.BadRequestException;

import com.shop.domain.dto.product.ProductTagDTO;
import com.shop.domain.entity.EntityStatus;
import com.shop.domain.product.ProductTag;
import com.shop.repository.mongo.product.ProductTagMongoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import static com.shop.config.error.ErrorMessageConstants.PRODUCT_TAG_NOT_FOUND;


@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Service
public class ProductTagServiceImpl  implements  ProductTagService{


    private final ProductTagMongoRepository productTagMongoRepository;


    /**
     * @return
     */
    @Override
    @Transactional
    public Boolean addTag(String title) {
        ProductTag tag= new ProductTag();
        tag.setEntityStatus(EntityStatus.REGULAR);
        tag.setTitle(title);
        productTagMongoRepository.save(tag);
        return true;
    }

    /**
     * @return
     */
    @Override
    public List<ProductTagDTO> getAllTags() {
        return productTagMongoRepository.findByEntityStatus(EntityStatus.REGULAR).stream().map(this::convertToProductTagDTO).collect(Collectors.toList());
    }

    /**
     * @param tagId
     * @param title
     * @return
     */
    @Override
    @Transactional
    public Boolean updateTag(String tagId, String title) {
        ProductTag productTag= getProductTagById(tagId);
        productTag.setTitle(title);

        productTagMongoRepository.save(productTag);
        return true;
    }

    /**
     * @param tagId
     * @return
     */
    @Override
    public Boolean deleteTag(String tagId) {
        ProductTag productTag =  getProductTagById(tagId);
        productTag.setEntityStatus(EntityStatus.DELETED);
        productTagMongoRepository.save(productTag);
        return true;
    }

    /**
     * @param tagId
     * @return
     */
    @Override
    public ProductTag getProductTagById(String tagId) {
        return productTagMongoRepository.findByIdAndEntityStatus(tagId,EntityStatus.REGULAR).orElseThrow(()->new BadRequestException(PRODUCT_TAG_NOT_FOUND));
    }

    private ProductTagDTO convertToProductTagDTO (ProductTag tag){
        ProductTagDTO productTagDTO = new ProductTagDTO();
        productTagDTO.setId(tag.getId());
        productTagDTO.setTitle(tag.getTitle());
        return productTagDTO;
    }
}
