package com.shop.service.product;

import com.shop.domain.dto.product.ProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface ProductService {


    Boolean createNewProduct (ProductDTO productDTO, List<MultipartFile> images);

    Page<ProductDTO> getProducts (Optional<String> state, Optional<String> categoryId, Pageable pageable);
}
