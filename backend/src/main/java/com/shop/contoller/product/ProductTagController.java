package com.shop.contoller.product;

import com.shop.domain.dto.product.ProductTagDTO;
import com.shop.service.product.ProductTagService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/product-tag")
@RestController
public class ProductTagController {

    private final ProductTagService productTagService;


    @PostMapping("/add-tag")
    ResponseEntity<Boolean> createProductTags (@RequestBody String title){
        return new ResponseEntity<>(productTagService.addTag(title), HttpStatus.CREATED);
    }

    @GetMapping("/all-tags")
    ResponseEntity<List<ProductTagDTO>> getAllProductTags (){
        return new ResponseEntity<>(productTagService.getAllTags(),HttpStatus.OK);
    }

    @PutMapping("/{tagId}")
    ResponseEntity<Boolean> updateProductTag (@PathVariable String tagId, @RequestBody String title){
        return new ResponseEntity<>(productTagService.updateTag(tagId,title),HttpStatus.OK);
    }

    @DeleteMapping("/{tagId}")
    ResponseEntity<Boolean> deleteProductTag (@PathVariable String tagId){
        return new ResponseEntity<>(productTagService.deleteTag(tagId),HttpStatus.OK);
    }
}
