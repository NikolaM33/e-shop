package com.shop.contoller.customer.account;

import com.shop.domain.dto.order.OrderDTO;
import com.shop.service.order.OrderService;
import com.shop.util.ResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/customer")
public class CustomerAccountController {

private final OrderService orderService;

    @GetMapping("/{userId}/orders")
    ResponseEntity<List<OrderDTO>> getUserOrders (@PathVariable String userId, Pageable pageable){
        return ResponseUtil.page(orderService.getUserOrders(userId,pageable));
    }

}
