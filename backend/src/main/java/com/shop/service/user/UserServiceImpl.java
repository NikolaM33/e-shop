package com.shop.service.user;

import com.shop.config.error.BadRequestException;
import com.shop.config.error.ErrorMessageConstants;
import com.shop.domain.dto.auth.AuthResponse;
import com.shop.domain.dto.user.UserDTO;
import com.shop.domain.entity.EntityStatus;
import com.shop.domain.user.User;
import com.shop.domain.user.UserType;
import com.shop.repository.mongo.user.UserMongoRepository;
import com.shop.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.shop.config.error.ErrorMessageConstants.USER_NOT_FOUND;

/**
 * The implementation of the service used for management of the User entity.
 *
 */
@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class UserServiceImpl  implements UserService {

    private final UserMongoRepository userRepository;

    private final JwtUtil jwtUtil;

    private final PasswordEncoder passwordEncoder;


    /**
     * @param email
     * @return
     */
    @Override
    public AuthResponse generateAuthResponse(String email) {
        AuthResponse authResponse = new AuthResponse();
        User user = userRepository.findByEmailAndEntityStatus(email, EntityStatus.REGULAR).orElseThrow(()->new BadRequestException(ErrorMessageConstants.USER_NOT_FOUND_BY_EMAIL) );

        String token = jwtUtil.generateToken(email);
        authResponse.setUser(convertToDTO(user));
        authResponse.setToken(token);
        return authResponse;
    }

    /**
     * @param userDTO
     * @return
     */
    @Transactional
    @Override
    public Boolean createUser(UserDTO userDTO)  {
        User user= new User();
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        User currentUser = getCurrentUser();
        user.setEntityStatus(EntityStatus.REGULAR);
        if (currentUser!=null && currentUser.getUserType().equals(UserType.ADMIN)){
            user.setUserType(UserType.valueOf(userDTO.getUserType().toUpperCase()));
        }else {
            user.setUserType(UserType.CLIENT);
        }
        userRepository.save(user);
        return true;
    }

    /**
     * @return
     */
    @Override
    public User getCurrentUser() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            return  userRepository.findByEmailAndEntityStatus(username, EntityStatus.REGULAR)
                    .orElse(null);
        } else {
            return null;
        }
    }

    /**
     * @param userId
     * @return
     */
    @Override
    public UserDTO getUserById(String userId) {
        return userRepository.findById(userId).map(this::convertToDTO).orElseThrow(()->new BadRequestException(USER_NOT_FOUND));
    }


    private UserDTO convertToDTO(User user){
        UserDTO userDTO= new UserDTO();
        userDTO.setEmail(user.getEmail());
        userDTO.setId(user.getId());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        return userDTO;
    }
}
