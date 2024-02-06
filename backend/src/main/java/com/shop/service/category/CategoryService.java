package com.shop.service.category;

import com.shop.domain.category.Category;
import com.shop.domain.dto.category.CategoryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface CategoryService {

    Boolean createNewCategory (CategoryDTO categoryDTO, MultipartFile image);

    Page<CategoryDTO> getCategories(Optional<String> filter, Pageable pageable);

    CategoryDTO  getCategory (String categoryId);

    CategoryDTO updateCategory(String categoryId, CategoryDTO categoryDTO,MultipartFile image);

    Boolean deleteCategory (String categoryId);

    List<CategoryDTO> getAllCategories ();

    Category getOneCategory(String categoryId);

}
