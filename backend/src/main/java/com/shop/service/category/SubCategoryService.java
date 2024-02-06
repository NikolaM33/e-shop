package com.shop.service.category;


import com.shop.domain.category.SubCategory;
import com.shop.domain.dto.category.SubCategoryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface SubCategoryService {

Boolean createNewSubCategory (SubCategoryDTO subCategoryDTO, MultipartFile image);

Page<SubCategoryDTO> getSubCategories(Optional<String> filter, Pageable pageable);

SubCategoryDTO updateSubCategory (String subCategoryId,SubCategoryDTO subCategoryDTO,MultipartFile image);

SubCategory  getSubCategory (String subCategoryId);

Boolean deleteSubCategory( String subCategoryId);

List<SubCategoryDTO> findSubCategoryOfCategory (String categoryId);
}
