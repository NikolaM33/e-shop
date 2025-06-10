package com.shop.domain.statistic;

import com.shop.domain.entity.mongo.AbstractMongoStatusEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.mapping.Document;


@Data
@EqualsAndHashCode(callSuper = false)
@Document(collection = "month_statistic")
public class MonthStatistic extends AbstractMongoStatusEntity {

    private static final long serialVersionUID = 1L;

    private Integer month;

    private Integer year;

    private Integer unitsSold;

    private Integer unitsRented;

    private Double revenue;

    private Integer cashTransactions;

    private Integer cardTransactions;

    private Integer newUsers;

    private Integer totalOrders;

    private Integer shippedOrders;

    private Integer pickupOrders;
}
