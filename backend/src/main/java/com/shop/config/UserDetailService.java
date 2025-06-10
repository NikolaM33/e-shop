package com.shop.config;

import com.shop.config.error.BadRequestException;
import com.shop.config.error.ErrorMessageConstants;
import com.shop.domain.entity.EntityStatus;
import com.shop.domain.user.User;
import com.shop.repository.mongo.user.UserMongoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class UserDetailService  implements UserDetailsService {

    @Autowired
    private UserMongoRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmailAndEntityStatus(username, EntityStatus.REGULAR)
                .orElseThrow(() -> new BadRequestException(ErrorMessageConstants.USER_NOT_FOUND_BY_EMAIL));



        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), getAuthorities(user.getUserType().name()));
    }

    private List<SimpleGrantedAuthority> getAuthorities(String type) {
        String role = "ROLE_" + type;
        return Collections.singletonList(new SimpleGrantedAuthority(role));

    }
}
