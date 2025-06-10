package com.shop.scheduler;

import com.shop.service.statistic.MonthStatisticService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;


import java.time.YearMonth;

@Slf4j
@Component
public class MonthlyStatisticsScheduler {

    @Autowired
    private MonthStatisticService monthStatisticService;

    @Scheduled(cron = "0 0 1 1 * *")
    public void runMonthlyStatisticsJob (){
        YearMonth previousMonth = YearMonth.now().minusMonths(1);
        log.info("Starting calculation for month statistic for: {} {}", previousMonth.getMonth(), previousMonth.getYear());
        monthStatisticService.generateMonthStatistic();
        log.info("Finished calculation for month statistic for: {} {}", previousMonth.getMonth(), previousMonth.getYear());
    }
}
