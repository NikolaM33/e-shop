package com.shop.service.order;

import com.shop.config.error.BadRequestException;
import com.shop.domain.dto.PaymentDTO;
import com.shop.domain.dto.order.OrderDTO;
import com.shop.domain.dto.order.OrderProductDTO;
import com.shop.domain.entity.EntityStatus;
import com.shop.domain.order.*;
import com.shop.domain.order.product.OrderProduct;
import com.shop.domain.product.Product;
import com.shop.repository.order.OrderRepository;
import com.shop.repository.product.ProductRepository;
import com.shop.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static com.shop.config.error.ErrorMessageConstants.*;


@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Service
public class OrderServiceImpl implements OrderService{

    private final UserRepository userRepository;

    private final OrderRepository orderRepository;

    private final ProductRepository productRepository;
    /**
     * @param orderDTO
     * @return
     */
    @Override
    @Transactional
    public OrderDTO createOrder(OrderDTO orderDTO) {
        Order order = convertFromDTO(orderDTO);
        order.setEntityStatus(EntityStatus.REGULAR);
        if ((PaymentStatus.SUCCEEDED.equals(order.getPaymentStatus())) ||
                PaymentMethod.PAY_ON_DELIVERY.equals(order.getPaymentMethod())){
            order.setStatus(OrderStatus.PROCESSING);
        }else {
            order.setStatus(OrderStatus.PENDING_APPROVAL);
        }
        reduceOrderedProductsStock(order.getProducts());
        return convertToDTO(orderRepository.save(order));
    }

    /**
     * @param orderId
     * @return
     */
    @Override
    public OrderDTO getOrder(String orderId) {
        return convertToDTO(orderRepository.findByIdAndEntityStatus(orderId,EntityStatus.REGULAR).orElseThrow(()-> new BadRequestException(ORDER_NOT_FOUND)));
    }

    /**
     * @param pageable
     * @return
     */
    @Override
    public Page<OrderDTO> getOrders(Pageable pageable) {
        return orderRepository.findByEntityStatus(EntityStatus.REGULAR, pageable).map(this::convertToDTO);
    }

    /**
     * @param orderId
     * @param status
     * @return
     */
    @Override
    @Transactional
    public OrderDTO updateOrderStatus(String orderId, String status) {
        Order order = orderRepository.findByIdAndEntityStatus(orderId, EntityStatus.REGULAR).orElseThrow(()-> new  BadRequestException(ORDER_NOT_FOUND));
        OrderStatus orderStatus;
        try {
            orderStatus = OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid order status: " + status);
        }

        order.setStatus(orderStatus);
        return convertToDTO(orderRepository.save(order));
    }

    /**
     * @param orderId
     * @param paymentIntentId
     */
    @Override
    public void attachPaymentIntent(String orderId, String paymentIntentId) {
        Order order = orderRepository.findByIdAndEntityStatus(orderId, EntityStatus.REGULAR).orElseThrow(()-> new BadRequestException(ORDER_NOT_FOUND));
        order.setPaymentId(paymentIntentId);
        orderRepository.save(order);
    }

    /**
     * @param orderId
     * @param paymentDTO
     * @return
     */
    @Override
    @Transactional
    public OrderDTO updateOrderPayment(String orderId, PaymentDTO paymentDTO) {
        Order order = orderRepository.findByIdAndEntityStatus(orderId,EntityStatus.REGULAR).orElseThrow(()-> new BadRequestException(ORDER_NOT_FOUND));
        if (!order.getPaymentId().equals(paymentDTO.getPaymentId())) {
            throw new BadRequestException(PAYMENT_INTENT_ID_MISMATCH);
        }

        order.setPaymentStatus(PaymentStatus.valueOf(paymentDTO.getPaymentStatus().toUpperCase()));
        order.setPaymentMethod(PaymentMethod.valueOf(paymentDTO.getPaymentMethod().toUpperCase()));
        order.setPaymentConfirmedAt(LocalDateTime.now());

        return convertToDTO(orderRepository.save(order));
    }

    /**
     * @param userId
     * @param pageable
     * @return
     */
    @Override
    public Page<OrderDTO> getUserOrders(String userId, Pageable pageable) {
        return orderRepository.findByUserIdAndEntityStatus(userId, EntityStatus.REGULAR, pageable).map(this::convertToDTO);
    }

    @Transactional
    private void reduceOrderedProductsStock (List<OrderProduct> orderProduct) {
        for (OrderProduct op : orderProduct) {
            Product product = op.getProduct();
            int remaining = product.getQuantity() - op.getQuantity();

            if (remaining < 0) {
                throw new BadRequestException("Insufficient stock for product: " + product.getName());
            }

            product.setQuantity(remaining);
        }

        productRepository.saveAll(
                orderProduct.stream()
                        .map(OrderProduct::getProduct)
                        .collect(Collectors.toList())
        );
    }

    private Order convertFromDTO(OrderDTO orderDTO){
        Order order =  new Order();
        if(orderDTO.getUserId()!=null){
            order.setUser(userRepository.findByIdAndEntityStatus(orderDTO.getUserId(), EntityStatus.REGULAR).orElseThrow(()-> new BadRequestException(USER_NOT_FOUND)));
        }
        order.setCustomerFirstName(orderDTO.getCustomerFirstName());
        order.setCustomerLastName(orderDTO.getCustomerLastName());
        order.setCustomerPhone(orderDTO.getCustomerPhone());
        order.setCustomerEmail(orderDTO.getCustomerEmail());
        order.setShippingCounty(orderDTO.getShippingCounty());
        order.setShippingAddress(orderDTO.getShippingAddress());
        order.setShippingState(orderDTO.getShippingState());
        order.setShippingTown(orderDTO.getShippingTown());
        order.setShippingPostalCode(orderDTO.getShippingPostalCode());
        order.setType(OrderType.valueOf(orderDTO.getType()));

        order.setPaymentMethod(PaymentMethod.valueOf(orderDTO.getPaymentMethod().toUpperCase()));
        if (order.getPaymentMethod().equals(PaymentMethod.PAY_ON_DELIVERY)){
            order.setPaymentStatus(PaymentStatus.PENDING);
        }else if (orderDTO.getPaymentStatus() != null) {
            order.setPaymentStatus(PaymentStatus.valueOf(orderDTO.getPaymentStatus().toUpperCase()));
        }

        order.setPaymentId(orderDTO.getPaymentId());
        order.setAmount(orderDTO.getAmount());

        order.setProducts(new ArrayList<>(orderDTO.getProducts().stream().map(this::convertFromOrderProductDTO).collect(Collectors.toList())));

        return order;
    }

    public LocalDateTime calculateRentEndDate(LocalDate rentStartDate, double rentDurationDays) {
        LocalDateTime rentStartDateTime = rentStartDate.atStartOfDay();

        long fullDays = (long) rentDurationDays;

        double fractionalPart = rentDurationDays - fullDays;

        LocalDateTime rentEndDateTime = rentStartDateTime.plusDays(fullDays);

        if (fractionalPart > 0) {
            long hours = Math.round(fractionalPart * 24);
            rentEndDateTime = rentEndDateTime.plusHours(hours);
        }

        return rentEndDateTime;
    }


    private OrderProduct convertFromOrderProductDTO (OrderProductDTO orderProductDTO){
        OrderProduct orderProduct =  new OrderProduct();
        orderProduct.setProduct(productRepository.findByIdAndEntityStatus(orderProductDTO.getProductId(),EntityStatus.REGULAR).orElseThrow(()-> new BadRequestException(PRODUCT_NOT_FOUND)));
        orderProduct.setBrand(orderProductDTO.getBrand());
        orderProduct.setColor(orderProductDTO.getColor());
        orderProduct.setName(orderProductDTO.getName());
        orderProduct.setSize(orderProductDTO.getSize());
        orderProduct.setQuantity(orderProductDTO.getQuantity());
        orderProduct.setPrice(orderProductDTO.getPrice());
        orderProduct.setDiscount(orderProductDTO.isDiscount());
        orderProduct.setDiscountPercent(orderProductDTO.getDiscountPercent());
        orderProduct.setRentStartDate(orderProductDTO.getRentDateStart());
        orderProduct.setRentDurationDays(orderProductDTO.getRentDurationDays());
        if (orderProduct.getRentStartDate()!= null){
            orderProduct.setRentEndDate(calculateRentEndDate(orderProduct.getRentStartDate(), orderProduct.getRentDurationDays()));
        }


        return orderProduct;
    }

    private OrderDTO convertToDTO (Order order){
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(order.getId());
        orderDTO.setCustomerFirstName(order.getCustomerFirstName());
        orderDTO.setCustomerLastName(order.getCustomerLastName());
        orderDTO.setCustomerPhone(order.getCustomerPhone());
        orderDTO.setCustomerEmail(order.getCustomerEmail());
        orderDTO.setShippingCounty(order.getShippingCounty());
        orderDTO.setShippingAddress(order.getShippingAddress());
        orderDTO.setShippingState(order.getShippingState());
        orderDTO.setShippingTown(order.getShippingTown());
        orderDTO.setShippingPostalCode(order.getShippingPostalCode());
        orderDTO.setType(order.getType().name());

        orderDTO.setPaymentMethod(order.getPaymentMethod().name());
        orderDTO.setPaymentStatus(order.getPaymentStatus() != null ? order.getPaymentStatus().name() : null);
        orderDTO.setPaymentId(order.getPaymentId());
        orderDTO.setAmount(order.getAmount());
        orderDTO.setCreatedDate(Date.from(order.getCreatedDate()));
        orderDTO.setStatus(order.getStatus().name());
        orderDTO.setProducts(new ArrayList<>(order.getProducts().stream().map(this::convertToProductOrderDTO).collect(Collectors.toList())));
        return orderDTO;
    }

    private OrderProductDTO convertToProductOrderDTO (OrderProduct orderProduct){
        OrderProductDTO orderProductDTO = new OrderProductDTO();
        orderProductDTO.setProductId(orderProduct.getProduct().getId());
        orderProductDTO.setBrand(orderProduct.getBrand());
        orderProductDTO.setColor(orderProduct.getColor());
        orderProductDTO.setName(orderProduct.getName());
        orderProductDTO.setSize(orderProduct.getSize());
        orderProductDTO.setQuantity(orderProduct.getQuantity());
        orderProductDTO.setPrice(orderProduct.getPrice());
        orderProductDTO.setDiscount(orderProduct.isDiscount());
        orderProductDTO.setImage(orderProduct.getProduct().getImage1FileIdentifier());
        orderProductDTO.setDiscountPercent(orderProduct.getDiscountPercent());
        orderProductDTO.setRentDateStart(orderProduct.getRentStartDate());
//        orderProductDTO.setRentDurationDays(orderProduct.getRentDurationDays());
        return orderProductDTO;
    }
}
