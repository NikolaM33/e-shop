package com.shop.domain.dto.user;

import lombok.Data;

@Data
public class PasswordDTO {

    private String currentPassword;

    private String newPassword;
}
