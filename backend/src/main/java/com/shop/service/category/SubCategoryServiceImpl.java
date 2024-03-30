package com.shop.service.category;

import com.shop.config.error.BadRequestException;
import com.shop.domain.category.SubCategory;
import com.shop.domain.dto.category.SubCategoryDTO;
import com.shop.domain.entity.EntityStatus;
import com.shop.repository.mongo.subcategory.SubCategoryMongoRepository;
import com.shop.util.FileManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


import static com.shop.config.error.ErrorMessageConstants.SUBCATEGORY_NOT_FOUND;

@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Service
public class SubCategoryServiceImpl implements SubCategoryService {

    private final CategoryService categoryService;

    private final FileManager fileManager;

    private final SubCategoryMongoRepository subCategoryMongoRepository;

    /**
     * @param subCategoryDTO
     * @param image
     * @return
     */
    @Transactional
    @Override
    public Boolean createNewSubCategory(SubCategoryDTO subCategoryDTO, MultipartFile image) {
        SubCategory subCategory= new SubCategory();
        subCategory.setName(subCategoryDTO.getName());
        subCategory.setActive(subCategoryDTO.getActive());
        subCategory.setSpecification(subCategoryDTO.getSpecification());
        subCategory.setCategory(categoryService.getOneCategory(subCategoryDTO.getCategoryId()));
        subCategory.setEntityStatus(EntityStatus.REGULAR);
        try {
            subCategory.setImageFileIdentifier(fileManager.saveFileToSystem(image.getBytes(), fileManager.SUBCATEGORY_FILES_PATH));
        }catch (IOException e){
            log.error(e.getMessage());
        }
        subCategory.setImageType(image.getContentType());
        subCategoryMongoRepository.save(subCategory);
        return true;
    }

    /**
     * @param filter
     * @param pageable
     * @return
     */
    @Override
    public Page<SubCategoryDTO> getSubCategories(Optional<String> filter, Pageable pageable) {
        return filter.map(s -> subCategoryMongoRepository.findByEntityStatusAndNameLikeIgnoreCase(EntityStatus.REGULAR, s, pageable).map(this::convertToSubCategoryDTO))
                .orElseGet(() -> subCategoryMongoRepository.findByEntityStatus(EntityStatus.REGULAR, pageable).map(this::convertToSubCategoryDTO));
    }

    /**
     * @param subCategoryId
     * @param subCategoryDTO
     * @param image
     * @return
     */
    @Override
    @Transactional
    public SubCategoryDTO updateSubCategory(String subCategoryId, SubCategoryDTO subCategoryDTO, MultipartFile image) {
        SubCategory subCategory= getSubCategory(subCategoryId);
        subCategory.setName(subCategoryDTO.getName());
        subCategory.setSpecification(subCategoryDTO.getSpecification());
        subCategory.setCategory(categoryService.getOneCategory(subCategoryDTO.getCategoryId()));
        subCategory.setActive(subCategoryDTO.getActive());
        if (image!=null){
            try {
                subCategory.setImageType(image.getContentType());
                subCategory.setImageFileIdentifier(fileManager.saveFileToSystem(image.getBytes(), fileManager.SUBCATEGORY_FILES_PATH));
            }catch (IOException e){
                log.error(e.getMessage());
            }

        }
        return convertToSubCategoryDTO(subCategoryMongoRepository.save(subCategory));
    }

    /**
     * @param subCategoryId
     * @return SubCategory
     */
    @Override
    public SubCategory getSubCategory(String subCategoryId) {
        return subCategoryMongoRepository.findByIdAndEntityStatus(subCategoryId,EntityStatus.REGULAR).orElseThrow(()->new BadRequestException(SUBCATEGORY_NOT_FOUND));

    }

    /**
     * @param subCategoryId
     * @return
     */
    @Transactional
    @Override
    public Boolean deleteSubCategory(String subCategoryId) {
        SubCategory subCategory=getSubCategory(subCategoryId);
        subCategory.setEntityStatus(EntityStatus.DELETED);
        subCategoryMongoRepository.save(subCategory);
        return true;
    }

    /**
     * @param categoryId
     * @return
     */
    @Override
    public List<SubCategoryDTO> findSubCategoryOfCategory(String categoryId) {
        return subCategoryMongoRepository.findByCategoryIdAndEntityStatus(categoryId,EntityStatus.REGULAR).stream().map(subCategory -> SubCategoryDTO.builder().name(subCategory.getName())
                .id(subCategory.getId()).specification(subCategory.getSpecification()).build()).collect(Collectors.toList());
    }

    private SubCategoryDTO convertToSubCategoryDTO(SubCategory subCategory){
        SubCategoryDTO subCategoryDTO= new SubCategoryDTO();
        subCategoryDTO.setId(subCategory.getId().toString());
        subCategoryDTO.setCategoryId(subCategory.getCategory().getId().toString());
        subCategoryDTO.setName(subCategory.getName());
        subCategoryDTO.setActive(subCategory.getActive());
        subCategoryDTO.setSpecification(subCategory.getSpecification());
        subCategoryDTO.setCategoryName(subCategory.getCategory().getName());
        subCategoryDTO.setImage(fileManager.convertToBase64StringImage(fileManager.getFileFromSystem(subCategory.getImageFileIdentifier(), fileManager.SUBCATEGORY_FILES_PATH),subCategory.getImageType()));


        return subCategoryDTO;
    }
}
