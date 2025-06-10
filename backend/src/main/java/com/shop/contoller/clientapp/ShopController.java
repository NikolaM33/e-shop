package com.shop.contoller.clientapp;


import com.shop.domain.dto.category.CategoryDTO;
import com.shop.domain.dto.order.OrderDTO;
import com.shop.domain.dto.product.ProductDTO;
import com.shop.service.category.CategoryService;
import com.shop.service.order.OrderService;
import com.shop.service.product.ProductService;
import com.shop.util.ResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/shop")
public class ShopController {

    private final CategoryService categoryService;

    private final ProductService productService;

    private final OrderService orderService;

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDTO>> getCategories (){
        return new ResponseEntity<>(categoryService.getCategoriesForShop(), HttpStatus.OK);
    }

    @GetMapping ("/products")
    public ResponseEntity<List<ProductDTO>> getProducts (@RequestParam (name = "categoryId",required = false)Optional<String>categoryId,
                                                         @RequestParam (name = "brand", required = false) Optional<ArrayList<String>> brand,
                                                         @RequestParam (name = "minPrice", required = false) Optional<Integer> minPrice,
                                                         @RequestParam (name = "maxPrice", required = false) Optional<Integer> maxPrice,
                                                         @RequestParam (name = "filter", required = false) Optional<String> filter,
                                                         @RequestParam (name = "type") Optional<String> type,
                                                         Pageable pageable){
        return ResponseUtil.page(productService.getProductsByFilters(categoryId,brand,minPrice,maxPrice,filter,type,pageable));
    }

    @GetMapping("/brand")
    public ResponseEntity<List<String>> getProductBrands (@RequestParam (name = "type") Optional<String> type){
        return new ResponseEntity<>(productService.getProductBrands(type),HttpStatus.OK);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ProductDTO> getProductById (@PathVariable String productId){
        return new ResponseEntity<>(productService.getProduct(productId),HttpStatus.OK);
    }

    @GetMapping("/product/new-products")
    public ResponseEntity<List<ProductDTO>> getNewProducts (){
        return  new ResponseEntity<>(productService.getNewProducts(),HttpStatus.OK);
    }

    @GetMapping("/product/related-products/{categoryId}")
    public ResponseEntity<List<ProductDTO>> getRelatedProducts (@PathVariable String categoryId){
        return new ResponseEntity<>(productService.getProductsFromCategory(categoryId),HttpStatus.OK);
    }
    @GetMapping("/product/random")
    public ResponseEntity<List<ProductDTO>> getRandomProducts (){
        return new ResponseEntity<>(productService.getRandomProducts(), HttpStatus.OK);
    }

    @PostMapping("/order")
    public ResponseEntity<OrderDTO> createOrder (@RequestBody OrderDTO orderDTO){
        return new ResponseEntity<>(orderService.createOrder(orderDTO), HttpStatus.CREATED);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<OrderDTO> getOrder (@PathVariable String orderId){
        return new ResponseEntity<>(orderService.getOrder(orderId), HttpStatus.OK);
    }


}
