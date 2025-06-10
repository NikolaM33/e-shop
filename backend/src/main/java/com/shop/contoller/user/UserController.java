package com.shop.contoller.user;

import com.shop.domain.dto.user.PasswordDTO;
import com.shop.domain.dto.user.UserDTO;
import com.shop.service.user.UserService;
import com.shop.util.ResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;


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

    private final UserService userService;

    @PostMapping()
    public ResponseEntity<Boolean> registerUser(@RequestBody UserDTO userDTO){
        return  new ResponseEntity<>(userService.createUser(userDTO), HttpStatus.CREATED);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUserById (@PathVariable String userId){
        return new ResponseEntity<>(userService.getUserById(userId),HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<UserDTO>> getUsers (@RequestParam(value = "type") String type, Pageable pageable){
        return ResponseUtil.page(userService.getUsers(type, pageable));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserDTO> updateUser ( @PathVariable String userId, @RequestBody UserDTO userDTO){
        return new ResponseEntity<>(userService.updateUser(userId,userDTO), HttpStatus.OK);
    }

    @PatchMapping ("/{userId}")
    public ResponseEntity<UserDTO> changePassword (@PathVariable String userId, @RequestBody PasswordDTO passwordDTO){
        return new ResponseEntity<>(userService.changePassword(userId, passwordDTO), HttpStatus.OK);
    }

}
