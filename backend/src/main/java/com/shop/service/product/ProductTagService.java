package com.shop.service.product;

import com.shop.domain.dto.product.ProductTagDTO;
import com.shop.domain.product.ProductTag;

import java.util.List;

public interface ProductTagService {


    Boolean addTag(String title);

    List<ProductTagDTO> getAllTags();

    Boolean updateTag (String tagId, String title);

    Boolean deleteTag (String tagId);

    ProductTag getProductTagById (String tagId);
}
