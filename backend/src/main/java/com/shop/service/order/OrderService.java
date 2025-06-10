package com.shop.service.order;

import com.shop.domain.dto.order.OrderDTO;
import org.springframework.data.domain.Page;

import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface OrderService {

    OrderDTO createOrder (OrderDTO orderDTO);

    OrderDTO getOrder (String orderId);

    Page<OrderDTO> getOrders (Pageable pageable);

    OrderDTO updateOrderStatus (String orderId, String status);

}
