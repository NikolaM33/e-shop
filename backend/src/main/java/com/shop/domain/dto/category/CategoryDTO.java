package com.shop.domain.dto.category;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {

    private String id;

    private String name;

    private String image;

    private Boolean active;

    private String specification;

}
