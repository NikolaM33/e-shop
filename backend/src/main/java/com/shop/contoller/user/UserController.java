package com.shop.contoller.user;

import com.shop.domain.dto.user.UserDTO;
import com.shop.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller exposing API for User entity.
 * <p>
 * URL : /user
 *
 */
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/user")
public class UserController {

    private UserService userService;
//    @PostMapping("/create")
//    public ResponseEntity<UserDTO> registerUser(@RequestBody UserDTO userDTO){
//        return  new ResponseEntity<>(userService.registerUser(userDTO), HttpStatus.OK);
//    }
}
