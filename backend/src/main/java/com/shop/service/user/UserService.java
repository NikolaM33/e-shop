package com.shop.service.user;

import com.shop.domain.dto.auth.AuthResponse;
import com.shop.domain.dto.user.PasswordDTO;
import com.shop.domain.dto.user.UserDTO;
import com.shop.domain.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {

    AuthResponse generateAuthResponse(String username, boolean isAdministration);

    Boolean createUser(UserDTO userDTO);

    User getCurrentUser();

    UserDTO getUserById( String userId);

    Page<UserDTO> getUsers(String type, Pageable pageable);

    UserDTO updateUser(String userId, UserDTO userDTO);

    List<UserDTO> getEmployees ();

    UserDTO changePassword (String userId, PasswordDTO passwordDTO);

}
