package com.shop.service.user;

import com.shop.config.error.BadRequestException;
import com.shop.config.error.ErrorMessageConstants;
import com.shop.domain.dto.auth.AuthResponse;
import com.shop.domain.dto.user.PasswordDTO;
import com.shop.domain.dto.user.UserDTO;
import com.shop.domain.entity.EntityStatus;
import com.shop.domain.user.User;
import com.shop.domain.user.UserType;
import com.shop.repository.mongo.user.UserMongoRepository;
import com.shop.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.AccessDeniedException;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

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
    public AuthResponse generateAuthResponse(String email, boolean isAdministration) {
        AuthResponse authResponse = new AuthResponse();
        User user = userRepository.findByEmailAndEntityStatus(email, EntityStatus.REGULAR).orElseThrow(()->new BadRequestException(ErrorMessageConstants.USER_NOT_FOUND_BY_EMAIL) );
        if(isAdministration && user.getUserType() != UserType.ADMIN && user.getUserType() != UserType.EMPLOYEE){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "ACCESS_DENIED");
        }else if (!isAdministration && user.getUserType() != UserType.CUSTOMER){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "ACCESS_DENIED");
        }
        String token = jwtUtil.generateToken(email, user.getUserType().name());
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
        userRepository.findByEmailAndEntityStatus(userDTO.getEmail(), EntityStatus.REGULAR)
                .ifPresent(user -> {
                    throw new BadRequestException("USER_ALREADY_EXIST");
                });
        User user= new User();
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        User currentUser = getCurrentUser();
        user.setEntityStatus(EntityStatus.REGULAR);
        if (currentUser!=null && currentUser.getUserType().equals(UserType.ADMIN)){
            user.setUserType(UserType.valueOf(userDTO.getType().toUpperCase()));
        }else {
            user.setUserType(UserType.CUSTOMER);
        }
        if (!user.getUserType().equals(UserType.CUSTOMER)){
            user.setPermissions(userDTO.getPermissions());
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

    /**
     * @param type
     * @param pageable
     * @return
     */
    @Override
    public Page<UserDTO> getUsers(String type, Pageable pageable) {
        return userRepository.findByUserTypeAndEntityStatus(UserType.valueOf(type.toUpperCase()), EntityStatus.REGULAR, pageable).map(this::convertToDTO);
    }

    /**
     * @param userId
     * @param userDTO
     * @return
     */
    @Override
    @Transactional
    public UserDTO updateUser(String userId, UserDTO userDTO) {
        User user = userRepository.findByIdAndEntityStatus(userId,EntityStatus.REGULAR).orElseThrow(()-> new BadRequestException(USER_NOT_FOUND));

        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmail());
        User currentUser = getCurrentUser();
        user.setEntityStatus(EntityStatus.REGULAR);
        if (currentUser!=null && currentUser.getUserType().equals(UserType.ADMIN)){
            user.setUserType(UserType.valueOf(userDTO.getType().toUpperCase()));
        }else {
            user.setUserType(UserType.CUSTOMER);
        }
        if (!user.getUserType().equals(UserType.CUSTOMER)){
            user.setPermissions(userDTO.getPermissions());
        }
        return convertToDTO(userRepository.save(user));
    }

    /**
     * @return
     */
    @Override
    public List<UserDTO> getEmployees() {
        return userRepository.findTop10ByUserTypeAndEntityStatus(UserType.EMPLOYEE, EntityStatus.REGULAR).stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    /**
     * @param userId
     * @param passwordDTO
     * @return
     */
    @Override
    @Transactional
    public UserDTO changePassword(String userId, PasswordDTO passwordDTO) {
        User user = userRepository.findByIdAndEntityStatus(userId,EntityStatus.REGULAR).orElseThrow(()-> new BadRequestException(USER_NOT_FOUND));
        if (!getCurrentUser().getId().equals(user.getId())){
            throw new BadRequestException(USER_NOT_FOUND);
        }
        if(passwordEncoder.matches(passwordDTO.getCurrentPassword(), user.getPassword())){
            user.setPassword(passwordEncoder.encode(passwordDTO.getNewPassword()));
            return convertToDTO(userRepository.save(user));
        }

        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ACCESS_DENIED");
    }


    private UserDTO convertToDTO(User user){
        UserDTO userDTO= new UserDTO();
        userDTO.setEmail(user.getEmail());
        userDTO.setId(user.getId());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setType(user.getUserType().name());
        userDTO.setPermissions(user.getPermissions());
        userDTO.setCreatedDate(user.getCreatedDate().atZone(ZoneId.systemDefault()).toLocalDate());
        return userDTO;
    }
}
