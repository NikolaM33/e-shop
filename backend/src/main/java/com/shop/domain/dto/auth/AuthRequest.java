package com.shop.domain.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 DTO used for logging in/getting da token
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequest {

    private String email;

    private String password;
}