package com.shop.service.user;

import com.shop.config.error.BadRequestException;
import com.shop.config.error.ErrorMessageConstants;
import com.shop.domain.dto.auth.AuthResponse;
import com.shop.domain.dto.user.UserDTO;
import com.shop.domain.entity.EntityStatus;
import com.shop.domain.user.User;
import com.shop.repository.jpa.user.UserRepository;
import com.shop.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * The implementation of the service used for management of the User entity.
 *
 */
@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class UserServiceImpl  implements UserService {

    private final UserRepository userRepository;

    private final JwtUtil jwtUtil;


    /**
     * @param username
     * @return
     */
    @Override
    public AuthResponse generateAuthResponse(String username) {
        AuthResponse authResponse = new AuthResponse();
        User user = userRepository.findByEmailAndEntityStatus(username, EntityStatus.REGULAR).get();
        if(user == null) {
            throw new BadRequestException(ErrorMessageConstants.USER_NOT_FOUND_BY_EMAIL);
        }

        String token = jwtUtil.generateToken(username);
        authResponse.setUser(convertToDTO(user));
        authResponse.setToken(token);
        return authResponse;
    }


    private UserDTO convertToDTO(User user){
        UserDTO userDTO= new UserDTO();
        userDTO.setEmail(user.getEmail());
        userDTO.setId(user.getId());
        return userDTO;
    }
}
