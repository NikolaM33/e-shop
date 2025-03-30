package com.shop.service.order;

import com.shop.domain.dto.order.OrderDTO;

import java.util.Map;

public interface OrderService {

    OrderDTO createOrder (OrderDTO orderDTO);

    OrderDTO getOrder (String orderId);

}
