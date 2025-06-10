package com.shop.service.statistic;

import com.shop.domain.entity.EntityStatus;
import com.shop.domain.order.Order;
import com.shop.domain.order.OrderType;
import com.shop.domain.order.PaymentMethod;
import com.shop.domain.order.product.OrderProduct;
import com.shop.domain.product.ProductType;
import com.shop.domain.statistic.MonthStatistic;
import com.shop.domain.user.User;
import com.shop.domain.user.UserType;
import com.shop.repository.mongo.statistic.MonthStatisticRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

@Transactional(readOnly = true)
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Service
public class MonthStatisticServiceImpl implements MonthStatisticService {

    private final MongoTemplate mongoTemplate;

    private final MonthStatisticRepository monthStatisticRepository;

    /**
     *
     */
    @Override
    @Transactional
    public void generateMonthStatistic() {
        YearMonth lastMonth = YearMonth.now().minusMonths(1);
        LocalDateTime start = lastMonth.atDay(1).atStartOfDay();
        LocalDateTime end = lastMonth.atEndOfMonth().atTime(23, 59, 59);

        List<Order> orders = mongoTemplate.find(Query.query(Criteria.where("created_date").gte(start).lte(end).and("entity_status").is(EntityStatus.REGULAR)), Order.class);
        int unitsSold = 0;
        int unitsRented = 0;
        double revenue = 0.0;
        int cashTransactions = 0;
        int cardTransactions = 0;
        int shippedOrders = 0;
        int pickupOrders = 0;

        for (Order order : orders) {
            if (order.getProducts() != null) {
                for (OrderProduct item : order.getProducts()) {
                    if (item.getProduct().getType().equals(ProductType.SALE)) {
                        unitsSold += item.getQuantity();
                    } else if (item.getProduct().getType().equals(ProductType.RENT)) {
                        unitsRented += item.getQuantity();
                    }
                }
            }

            revenue += order.getAmount() != null ? order.getAmount() : 0;
            if (order.getPaymentMethod() == PaymentMethod.PAY_ON_DELIVERY) {
                cashTransactions++;
            } else if (order.getPaymentMethod() == PaymentMethod.CARD) {
                cardTransactions++;
            }

            if (order.getType() == OrderType.SHIPPING) {
                shippedOrders++;
            } else if (order.getType() == OrderType.LOCAL_PICKUP) {
                pickupOrders++;
            }
        }
        long newUsers = mongoTemplate.count(
                Query.query(Criteria.where("created_date").gte(start).lte(end).and("entity_status").is(EntityStatus.REGULAR)
                        .and("userType").is(UserType.CUSTOMER)),
                User.class
        );

        MonthStatistic stat = new MonthStatistic();
        stat.setYear(lastMonth.getYear());
        stat.setMonth(lastMonth.getMonthValue());
        stat.setUnitsSold(unitsSold);
        stat.setUnitsRented(unitsRented);
        stat.setRevenue(revenue);
        stat.setCashTransactions(cashTransactions);
        stat.setCardTransactions(cardTransactions);
        stat.setTotalOrders(orders.size());
        stat.setShippedOrders(shippedOrders);
        stat.setPickupOrders(pickupOrders);
        stat.setNewUsers((int) newUsers);
        stat.setEntityStatus(EntityStatus.REGULAR);

        monthStatisticRepository.save(stat);
    }

}
