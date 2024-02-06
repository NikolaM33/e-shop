package com.shop.service.user;

import com.shop.domain.dto.auth.AuthResponse;

public interface UserService {

    AuthResponse generateAuthResponse(String username);

}
