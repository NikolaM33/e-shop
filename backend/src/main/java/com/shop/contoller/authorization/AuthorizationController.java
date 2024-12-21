package com.shop.contoller.authorization;

import com.shop.domain.dto.auth.AuthRequest;
import com.shop.domain.dto.auth.AuthResponse;
import com.shop.service.user.UserService;
import com.shop.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 Controller used for generating the token
 */
@RestController
@RequestMapping
@CrossOrigin(origins = "http://localhost:4200")
public class AuthorizationController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;


    @PostMapping("/authenticate")
    public AuthResponse login(@RequestBody AuthRequest authRequest) {
        AuthResponse response = userService.generateAuthResponse(authRequest.getEmail());
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));
        return response;
    }
}