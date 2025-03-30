package com.shop.service.payment;

import com.shop.domain.dto.order.OrderDTO;
import com.shop.domain.dto.order.OrderProductDTO;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Service
public class PaymentServiceImpl implements PaymentService{
    /**
     * @param orderDTO
     * @return
     */
    @Override
    public Map<String, Object> generatePaymentIntent(OrderDTO orderDTO) throws StripeException {


        String email = orderDTO.getCustomerEmail();
        double totalAmount = orderDTO.getAmount();


        // Build metadata with limited product details
        StringBuilder productInfo = new StringBuilder();
        for (OrderProductDTO product : orderDTO.getProducts()) {
            productInfo.append(product.getName())
                    .append(" x ")
                    .append(product.getQuantity())
                    .append(", ");
        }

        PaymentIntentCreateParams params =
                PaymentIntentCreateParams.builder()
                        .setAmount((long) totalAmount)
                        .setCurrency("usd")
                        .setReceiptEmail(email)
                        .putMetadata("customer_name", orderDTO.getCustomerFirstName() + " " + orderDTO.getCustomerLastName())
                        .putMetadata("customer_phone", orderDTO.getCustomerPhone())
                        .putMetadata("shipping_address", orderDTO.getShippingAddress() + ", " + orderDTO.getShippingTown()+ ", " +
                                orderDTO.getShippingState() + ", " + orderDTO.getShippingCounty()+ ", " + orderDTO.getShippingPostalCode())
                        .putMetadata("products", productInfo.toString())
                        .build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);
        Map<String, Object> response = new HashMap<>();
        response.put("clientSecret", paymentIntent.getClientSecret());
        return response;
    }
}
