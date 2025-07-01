package com.shop.service.payment;

import com.shop.domain.dto.order.OrderDTO;
import com.shop.domain.dto.order.OrderProductDTO;
import com.stripe.exception.StripeException;

import java.util.List;
import java.util.Map;

public interface PaymentService {

     Map<String, Object> processOrder (OrderDTO orderDTO) throws StripeException;

     double validateOrderAndCalculateTotal (List<OrderProductDTO> productDTOS);
}
