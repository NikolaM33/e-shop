package com.shop.service.user;

import com.shop.service.user.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * The implementation of the service used for management of the User entity.
 *
 */
@Transactional(readOnly = true)
@Slf4j
@Service
public class UserServiceImpl  implements UserService {
}
