package com.shop.service.category;

import com.shop.config.error.BadRequestException;
import com.shop.domain.category.Category;
import com.shop.domain.dto.category.CategoryDTO;
import com.shop.domain.entity.EntityStatus;
import com.shop.repository.mongo.category.CategoryMongoRepository;
import com.shop.util.FileManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import static com.shop.config.error.ErrorMessageConstants.CATEGORY_NOT_FOUND;
import static com.shop.config.error.ErrorMessageConstants.FILE_UPLOAD_ERROR;


import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Service
public class CategoryServiceImpl implements CategoryService {

    private final FileManager fileManager;

    private final MongoTemplate mongoTemplate;

    private final CategoryMongoRepository categoryMongoRepository;
    /**
     * @param categoryDTO
     * @param image
     * @return
     */
    @Override
    @Transactional
    public Boolean createNewCategory(CategoryDTO categoryDTO, MultipartFile image) {
        Category category= new Category();
        category.setName(categoryDTO.getName());
        category.setEntityStatus(EntityStatus.REGULAR);
        category.setImageType(image.getContentType());
        category.setActive(categoryDTO.getActive());
        category.setSpecification(categoryDTO.getSpecification());
        byte[] imageData;
        try {
            imageData = image.getBytes();
        } catch (IOException e) {
            throw new BadRequestException(FILE_UPLOAD_ERROR);
        }
        category.setImageFileIdentifier(fileManager.saveFileToSystem(imageData, fileManager.CATEGORY_FILES_PATH));
        categoryMongoRepository.save(category);
        return true;
    }

    /**
     * @param filter
     * @param pageable
     * @return
     */
    @Override
    public Page<CategoryDTO> getCategories(Optional<String> filter, Pageable pageable) {
        return filter.map(s -> categoryMongoRepository.findByEntityStatusAndNameLikeIgnoreCase(EntityStatus.REGULAR, s, pageable).map(this::convertToDTO))
                .orElseGet(() -> categoryMongoRepository.findByEntityStatus(EntityStatus.REGULAR, pageable).map(this::convertToDTO));

    }

    /**
     * @param categoryId
     * @return
     */
    @Override
    public CategoryDTO getCategory(String categoryId) {
        return convertToDTO(getOneCategory(categoryId));
    }

    /**
     * @param categoryId
     * @param categoryDTO
     * @param image
     * @return
     */
    @Transactional
    @Override
    public CategoryDTO updateCategory(String categoryId, CategoryDTO categoryDTO, MultipartFile image) {
        Category category=getOneCategory(categoryId);
        category.setName(categoryDTO.getName());
        category.setActive(categoryDTO.getActive());
        category.setSpecification(categoryDTO.getSpecification());
        if (image!=null) {
            try {
                category.setImageType(image.getContentType());
                category.setImageFileIdentifier(fileManager.saveFileToSystem(image.getBytes(), fileManager.CATEGORY_FILES_PATH));
            } catch (IOException e) {
                throw new BadRequestException(FILE_UPLOAD_ERROR);
            }

        }
          return convertToDTO(categoryMongoRepository.save(category));
    }

    /**
     * delete category
     * @param categoryId
     * @return true -> success false-failure
     */
    @Transactional
    @Override
    public Boolean deleteCategory(String categoryId) {
        Category category=getOneCategory(categoryId);
        category.setEntityStatus(EntityStatus.DELETED);
        categoryMongoRepository.save(category);
        return true;
    }

    /**
     * @return
     */
    @Override
    public List<CategoryDTO> getAllCategories() {
        return categoryMongoRepository.findByEntityStatus(EntityStatus.REGULAR).stream().map(category -> CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName()).specification(category.getSpecification()).build()).collect(Collectors.toList());
    }

    private CategoryDTO convertToDTO (Category category){
        CategoryDTO categoryDTO= new CategoryDTO();
        categoryDTO.setId(category.getId());
        categoryDTO.setName(category.getName());
        categoryDTO.setActive(category.getActive());
        categoryDTO.setSpecification(category.getSpecification());
        categoryDTO.setImage(fileManager.convertToBase64StringImage(fileManager.getFileFromSystem(category.getImageFileIdentifier(), fileManager.CATEGORY_FILES_PATH),category.getImageType()));

        return categoryDTO;
    }

    @Override
    public Category getOneCategory(String categoryId){
        return categoryMongoRepository.findById(categoryId).orElseThrow(()->new BadRequestException(CATEGORY_NOT_FOUND));

    }

    /**
     * @return
     */
    @Override
    public List<CategoryDTO> getCategoriesForShop() {
        return categoryMongoRepository.findByEntityStatus(EntityStatus.REGULAR).stream().map(category -> CategoryDTO.builder().id(category.getId())
                .name(category.getName()).build()).collect(Collectors.toList());
    }
}
