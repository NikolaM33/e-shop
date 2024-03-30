package com.shop.contoller.product;



import com.shop.domain.dto.product.ProductDTO;
import com.shop.service.product.ProductService;
import com.shop.util.ResponseUtil;
import com.sun.org.apache.xpath.internal.operations.Bool;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/product")
@RestController
public class ProductController {

    private final ProductService productService;


    @PostMapping
    public ResponseEntity<Boolean>  createNewProduct (@RequestPart(value = "productData") ProductDTO productDTO,
                                                      @RequestPart (value = "images") List<MultipartFile> images){
        return new ResponseEntity<>(productService.createNewProduct(productDTO,images), HttpStatus.CREATED);
    }

    @GetMapping
    ResponseEntity<List<ProductDTO>> getProducts(@RequestParam(value = "state", required = false) Optional<String> state,
                                                 @RequestParam(value= "categoryId",required = false) Optional<String> categoryId, Pageable pageable){
        return ResponseUtil.page(productService.getProducts(state,categoryId,pageable));
    }

    @GetMapping("/{productId}")
    ResponseEntity<ProductDTO> getProduct (@PathVariable String productId){
        return new ResponseEntity<>(productService.getProduct(productId),HttpStatus.OK);
    }

    @PutMapping("/{productId}")
    ResponseEntity<ProductDTO> updateProduct (@PathVariable String productId, @RequestPart(value = "productData") ProductDTO productDTO,
                                              @RequestPart (value = "images", required = false) List<MultipartFile> images){
        return new ResponseEntity<>(productService.updateProduct(productId,productDTO,images),HttpStatus.OK);
    }

}
