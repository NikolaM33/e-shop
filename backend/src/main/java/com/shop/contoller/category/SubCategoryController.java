package com.shop.contoller.category;

import com.shop.domain.dto.category.SubCategoryDTO;
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
@RequestMapping("/sub-category")
public class SubCategoryController {

    private final SubCategoryService subCategoryService;

    @PostMapping()
    public ResponseEntity<Boolean> createNewCategory (@RequestPart(value = "subCategoryData") SubCategoryDTO subCategoryDTO,
                                                      @RequestPart (value = "image") MultipartFile image){
        return new ResponseEntity<>(subCategoryService.createNewSubCategory(subCategoryDTO,image), HttpStatus.CREATED);
    }

    @GetMapping()
    public ResponseEntity<List<SubCategoryDTO>> getSubcategories(@RequestParam("filter") Optional<String> filter, Pageable pageable){
        return ResponseUtil.page(subCategoryService.getSubCategories(filter, pageable));
    }

    @PutMapping("/{subcategoryId}")
    public ResponseEntity<SubCategoryDTO>  updateCategory (@PathVariable String subcategoryId, @RequestPart(value = "subCategoryData") SubCategoryDTO subCategoryDTO,
                                                        @RequestPart (value = "image",required = false) MultipartFile image){
        return new ResponseEntity<>(subCategoryService.updateSubCategory(subcategoryId,subCategoryDTO,image),HttpStatus.OK);
    }

    @DeleteMapping("/{subCategoryId}")
    public ResponseEntity<Boolean> deleteSubcategory (@PathVariable String subCategoryId){
        return new ResponseEntity<>(subCategoryService.deleteSubCategory(subCategoryId),HttpStatus.OK);
    }

}
