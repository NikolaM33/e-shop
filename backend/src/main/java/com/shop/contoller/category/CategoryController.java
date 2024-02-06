package com.shop.contoller.category;

import com.shop.domain.dto.category.CategoryDTO;
import com.shop.domain.dto.category.SubCategoryDTO;
import com.shop.service.category.CategoryService;
import com.shop.service.category.SubCategoryService;
import com.shop.util.ResponseUtil;
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
@RestController
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/category")
public class CategoryController {

    private final CategoryService categoryService;

    private final SubCategoryService subCategoryService;

    @PostMapping()
    public ResponseEntity<Boolean> createNewCategory (@RequestPart(value = "categoryData") CategoryDTO categoryDTO,
                                                      @RequestPart (value = "image") MultipartFile image){
        return new ResponseEntity<>(categoryService.createNewCategory(categoryDTO,image), HttpStatus.CREATED);
    }


    @GetMapping()
    public ResponseEntity<List<CategoryDTO>> getCategories (@RequestParam("filter") Optional<String> filter, Pageable pageable){
        return ResponseUtil.page(categoryService.getCategories(filter,pageable));
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<CategoryDTO> getCategory (@PathVariable String categoryId){
        return new ResponseEntity<>(categoryService.getCategory(categoryId),HttpStatus.OK);
    }

    @PutMapping("/{categoryId}")
    public ResponseEntity<CategoryDTO>  updateCategory (@PathVariable String categoryId,@RequestPart(value = "categoryData") CategoryDTO categoryDTO,
                                                        @RequestPart (value = "image",required = false) MultipartFile image){
        return new ResponseEntity<>(categoryService.updateCategory(categoryId,categoryDTO,image),HttpStatus.OK);
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Boolean> deleteCategory (@PathVariable String categoryId){
        return new ResponseEntity<>(categoryService.deleteCategory(categoryId),HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<CategoryDTO>> getAllCategories (){
        return new ResponseEntity<>(categoryService.getAllCategories(),HttpStatus.OK);
    }

    @GetMapping("/{categoryId}/sub-category")
    public ResponseEntity<List<SubCategoryDTO>> getSubCategoryOfCategory (@PathVariable String categoryId){
        return new ResponseEntity<>(subCategoryService.findSubCategoryOfCategory(categoryId),HttpStatus.OK);
    }
}
