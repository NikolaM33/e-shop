package com.shop.domain.dto.dashboard;

import lombok.Data;

@Data
public class CurrentMonthStatisticDTO {

    private Double earnings;

    private Integer products;

    private Integer orders;

    private Integer users;
}
