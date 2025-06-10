package com.shop.domain.dto.statistic;

import lombok.Data;

@Data
public class MonthStatisticDTO {

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
