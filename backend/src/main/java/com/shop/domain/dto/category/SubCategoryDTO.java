package com.shop.domain.dto.category;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubCategoryDTO {

    private String id;

    private String name;

    private String image;

    private Boolean active;

    private String specification;

    private String categoryId;

    private String categoryName;
}
