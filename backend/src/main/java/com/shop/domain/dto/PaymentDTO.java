package com.shop.domain.dto;

import lombok.Data;

@Data
public class PaymentDTO {

    private String paymentId;

    private String paymentStatus;

    private String paymentMethod;
}
