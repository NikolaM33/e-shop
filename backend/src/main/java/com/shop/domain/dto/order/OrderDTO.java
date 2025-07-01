package com.shop.domain.dto.order;

import lombok.Data;


import javax.validation.Valid;
import javax.validation.constraints.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Data
public class OrderDTO {

    private String id;

    private String userId;

    private String customerFirstName;

    private String customerLastName;

    @NotBlank
    private String customerPhone;

    @NotBlank
    @Email
    private String customerEmail;

    @NotBlank
    private String type;

    private String shippingAddress;

    private String shippingCounty;

    private String shippingState;

    private String shippingTown;

    private String shippingPostalCode;

    @NotBlank
    private String paymentMethod;

    private String paymentStatus;

    private String paymentId;

    @NotNull
    @DecimalMin(value = "0.01")
    private Double amount;

    private Date createdDate;

    private String status;

    @NotEmpty
    @Valid
    private List<OrderProductDTO> products;


}
