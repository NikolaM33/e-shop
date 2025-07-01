package com.shop.service.payment;

import com.shop.config.error.BadRequestException;
import com.shop.domain.dto.order.OrderDTO;
import com.shop.domain.dto.order.OrderProductDTO;
import com.shop.domain.product.Product;
import com.shop.domain.product.ProductState;
import com.shop.domain.product.ProductType;
import com.shop.repository.product.ProductRepository;
import com.shop.service.order.OrderService;
import com.shop.service.product.ProductService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.shop.config.error.ErrorMessageConstants.*;
import static com.shop.constants.StripeConstants.*;

@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Service
public class PaymentServiceImpl implements PaymentService {

    private static final int EURO_TO_CENT = 100;
    private final ProductRepository productRepository;

    private final OrderService orderService;

    private final ProductService productService;


    /**
     * @param orderDTO
     * @return
     */
    @Override
    public Map<String, Object> processOrder (OrderDTO orderDTO) throws StripeException {
        double totalOrderPrice = validateOrderAndCalculateTotal(orderDTO.getProducts());
        orderDTO.setAmount(totalOrderPrice);
        OrderDTO pendingOrderDTO =  orderService.createOrder(orderDTO);

        PaymentIntentCreateParams params = createPaymentIntentParams(pendingOrderDTO, totalOrderPrice);
        PaymentIntent paymentIntent = PaymentIntent.create(params);

        orderService.attachPaymentIntent(pendingOrderDTO.getId(), paymentIntent.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("clientSecret", paymentIntent.getClientSecret());
        response.put("orderId", pendingOrderDTO.getId());
        return response;
    }


    private PaymentIntentCreateParams createPaymentIntentParams(OrderDTO orderDTO, double totalPrice) {
        return PaymentIntentCreateParams.builder()
                .setAmount(Math.round(totalPrice) * EURO_TO_CENT)
                .setCurrency(CURRENCY)
                .setReceiptEmail(orderDTO.getCustomerEmail())
                .putAllMetadata(buildMetadata(orderDTO))
                .build();
    }


    private Map<String, String> buildMetadata(OrderDTO orderDTO) {
        Map<String, String> metadata = new HashMap<>();
        metadata.put(CUSTOMER_NAME, orderDTO.getCustomerFirstName() + " " + orderDTO.getCustomerLastName());
        metadata.put(CUSTOMER_PHONE, orderDTO.getCustomerPhone());
        metadata.put(SHIPPING_ADDRESS, String.join(", ",
                orderDTO.getShippingAddress(),
                orderDTO.getShippingTown(),
                orderDTO.getShippingState(),
                orderDTO.getShippingCounty(),
                orderDTO.getShippingPostalCode()));
        metadata.put(PRODUCTS, buildProductInfo(orderDTO.getProducts()));
        return metadata;
    }

    private String buildProductInfo(List<OrderProductDTO> products) {
        return products.stream()
                .map(p -> p.getName() + " x " + p.getQuantity())
                .collect(Collectors.joining(", "));
    }


    /**
     * Validates the order products for availability, stock, and calculates the total price with discounts.
     *
     * @param orderProducts list of products in the order
     * @return total order amount
     * @throws com.shop.config.error.BadRequestException if is some problem with order
     */
    @Override
    public double validateOrderAndCalculateTotal(List<OrderProductDTO> orderProducts) {
        LocalDateTime now = LocalDateTime.now();
        double total = 0.0;

        for (OrderProductDTO dto : orderProducts) {
            Product product = productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new BadRequestException(PRODUCT_NOT_FOUND));
            if (dto.getRentDateStart()!= null ){
                int quantityAvailableForRent = productService.getQuantityAvailableForRent(dto.getProductId(), dto.getRentDateStart(), dto.getRentDurationDays());
                if (quantityAvailableForRent < dto.getQuantity()) {
                    log.error("{} Product ID: {}", INSUFFICIENT_STOCK_FOR_PRODUCT, product.getId());
                    throw new BadRequestException(INSUFFICIENT_STOCK_FOR_PRODUCT);
                }
            }else {
                validateProductAvailability(product);
                validateStock(product, dto.getQuantity());
            }

            double effectivePrice = calculateEffectivePrice(product, now);
            if (product.getType() == ProductType.RENT){
                total+= effectivePrice * dto.getQuantity() * dto.getRentDurationDays();
            }else {
                total += effectivePrice * dto.getQuantity();
            }

        }

        return total;
    }

    private void validateProductAvailability(Product product) {
        if (product.getState() != ProductState.PUBLISHED) {
            log.error("{} Product ID: {}", PRODUCT_NOT_AVAILABLE_FOR_PURCHASE, product.getId());
            throw new BadRequestException(PRODUCT_NOT_AVAILABLE_FOR_PURCHASE);
        }
    }

    private void validateStock(Product product, int requestedQuantity) {
        if (product.getQuantity() < requestedQuantity) {
            log.error("{} Product ID: {}", INSUFFICIENT_STOCK_FOR_PRODUCT, product.getId());
            throw new BadRequestException(INSUFFICIENT_STOCK_FOR_PRODUCT);
        }
    }

    /**
     * Calculate effective price based on discount and current time.
     */
    private double calculateEffectivePrice(Product product, LocalDateTime now) {
        if ( product.getDiscount()!=null && product.getDiscount() > 0 &&
                product.getDiscountStartDate() != null &&
                product.getDiscountEndDate() != null &&
                isWithinDiscountPeriod(product.getDiscountStartDate(), product.getDiscountEndDate(), now)) {
            double discountRate = product.getDiscount() / 100.0;
            return product.getPrice() * (1 - discountRate);
        }
        return product.getPrice();
    }

    private boolean isWithinDiscountPeriod(LocalDateTime discountStart, LocalDateTime discountEnd, LocalDateTime now) {
        return !now.isBefore(discountStart) && !now.isAfter(discountEnd);
    }
}
