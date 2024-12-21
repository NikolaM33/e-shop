package com.shop.service.user;

import com.shop.domain.dto.auth.AuthResponse;
import com.shop.domain.dto.user.UserDTO;
import com.shop.domain.user.User;

public interface UserService {

    AuthResponse generateAuthResponse(String username);

    Boolean createUser(UserDTO userDTO);

    User getCurrentUser();

    UserDTO getUserById( String userId);

}
