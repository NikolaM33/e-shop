package com.shop.service.product;

import com.shop.domain.dto.product.ProductDTO;
import com.shop.domain.dto.product.ProductTagDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface ProductService {


    Boolean createNewProduct (ProductDTO productDTO, List<MultipartFile> images);

    Page<ProductDTO> getProducts (Optional<String> state, Optional<String> categoryId, Pageable pageable);

    ProductDTO getProduct (String productId);

    ProductDTO updateProduct (String productId, ProductDTO productDTO, List<MultipartFile> images);

    Page<ProductDTO> getProductsByFilters (Optional<String>categoryId, Optional<String> brand,
                                          Optional<Integer> minPrice, Optional<Integer> maxPrice,
                                          Optional<String> filter, Pageable pageable);

    List<String> getProductBrands ();


    List<ProductDTO> getNewProducts ();

    List<ProductDTO> getProductsFromCategory(String categoryId);
}
