package com.shop.service.dashboard;

import com.shop.domain.dto.dashboard.CurrentMonthStatisticDTO;
import com.shop.domain.dto.statistic.MonthStatisticDTO;

import java.util.List;
import java.util.Map;

public interface DashboardService {


    CurrentMonthStatisticDTO getCurrentMonthStatistic();

    List<Map> findTop5BestSellingProducts();

    List<MonthStatisticDTO> getMonthlyStatistic();

    List<Map> getSaleStatistic();

    List<Map> getOrderTypeStatistic();
}
