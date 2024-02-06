package com.shop.config.error;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

/**
 * The class used as exception handler for REST controllers.
 */
@ControllerAdvice
public class ExceptionHandling {


    @ExceptionHandler(IllegalArgumentException.class)
    void handleIllegalArgumentException(IllegalArgumentException e, HttpServletResponse response) throws IOException {
        response.sendError(BAD_REQUEST.value());
    }

    @ExceptionHandler(BadCredentialsException.class)
    void badCredentialsException(BadCredentialsException e, HttpServletResponse response) throws IOException {
        response.sendError(BAD_REQUEST.value());
    }
}
