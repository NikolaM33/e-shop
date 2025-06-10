package com.shop.contoller.order;

import com.shop.domain.dto.order.OrderDTO;
import com.shop.service.order.OrderService;
import com.shop.util.ResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/administration/order")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getOrders (@RequestParam("filter") Optional<String> filter, Pageable pageable){
        return ResponseUtil.page(orderService.getOrders(pageable));
    }

    @PatchMapping("/{orderId}")
    ResponseEntity<OrderDTO> updateOrderStatus (@PathVariable String orderId, @RequestBody String status){
        return new ResponseEntity<>(orderService.updateOrderStatus(orderId, status), HttpStatus.OK);
    }
}
