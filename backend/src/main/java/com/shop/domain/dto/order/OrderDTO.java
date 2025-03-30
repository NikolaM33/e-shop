package com.shop.domain.dto.order;

import lombok.Data;


import java.util.ArrayList;
import java.util.Date;


@Data
public class OrderDTO {

    private String id;

    private String userId;

    private String customerFirstName;

    private String customerLastName;

    private String customerPhone;

    private String customerEmail;

    private String type;

    private String shippingAddress;

    private String shippingCounty;

    private String shippingState;

    private String shippingTown;

    private String shippingPostalCode;

    private String paymentMethod;

    private String paymentStatus;

    private String paymentId;

    private Double amount;

    private Date createdDate;

    private ArrayList<OrderProductDTO> products;


}
