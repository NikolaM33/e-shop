package com.shop.repository.mongo.statistic;

import com.shop.domain.entity.EntityStatus;
import com.shop.domain.statistic.MonthStatistic;
import com.shop.repository.AbstractMongoStatusEntityRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MonthStatisticRepository extends AbstractMongoStatusEntityRepository<MonthStatistic, String> {

    List<MonthStatistic> findByYearAndEntityStatus(Integer year, EntityStatus entityStatus);
}
