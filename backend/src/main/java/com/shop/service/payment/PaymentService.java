package com.shop.service.payment;

import com.shop.domain.dto.order.OrderDTO;
import com.stripe.exception.StripeException;

import java.util.Map;

public interface PaymentService {

     Map<String, Object> generatePaymentIntent (OrderDTO orderDTO) throws StripeException;
}
