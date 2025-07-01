package com.shop.repository.statistic;

import com.shop.domain.entity.EntityStatus;
import com.shop.domain.statistic.MonthStatistic;
import com.shop.repository.AbstractStatusEntityRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MonthStatisticRepository extends AbstractStatusEntityRepository<MonthStatistic, String> {

    List<MonthStatistic> findByYearAndEntityStatus(Integer year, EntityStatus entityStatus);
}
