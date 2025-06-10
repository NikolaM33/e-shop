package com.shop.domain.dto.user;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.Map;

@Data
public class UserDTO {

    private String id;

    @Email
    private String email;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    private String type;

    private String password;

    private Map<String, Boolean> permissions;

    private LocalDate createdDate;


}
