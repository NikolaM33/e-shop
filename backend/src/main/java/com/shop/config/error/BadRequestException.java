package com.shop.config.error;

/**
 Used for throwing Exceptions to a client side
 */
public class BadRequestException extends IllegalArgumentException {

    private static final long serialVersionUID = 1L;


    public BadRequestException(String message) {
        super(message);
    }
}
