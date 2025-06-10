package com.shop.service.dashboard;

import com.shop.domain.dto.dashboard.CurrentMonthStatisticDTO;
import com.shop.domain.dto.statistic.MonthStatisticDTO;
import com.shop.domain.entity.EntityStatus;
import com.shop.domain.order.Order;
import com.shop.domain.product.Product;
import com.shop.domain.statistic.MonthStatistic;
import com.shop.domain.user.User;
import com.shop.domain.user.UserType;
import com.shop.repository.mongo.statistic.MonthStatisticRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.ConvertOperators;
import org.springframework.data.mongodb.core.aggregation.Fields;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Transactional(readOnly = true)
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Service
public class DashboardServiceImpl implements DashboardService{


    private final MongoTemplate mongoTemplate;

    private final MonthStatisticRepository monthStatisticRepository;
    /**
     * @return
     */
    @Override
    public CurrentMonthStatisticDTO getCurrentMonthStatistic() {
        CurrentMonthStatisticDTO currentMonthStatisticDTO =  new CurrentMonthStatisticDTO();
        currentMonthStatisticDTO.setEarnings(getTotalAmountForOrdersThisMonth());
        currentMonthStatisticDTO.setProducts(countProductsPublishedThisMonth());
        currentMonthStatisticDTO.setOrders(countOrdersForThisMonth());
        currentMonthStatisticDTO.setUsers(countNewUsersForThisMonth());
        return currentMonthStatisticDTO;
    }

    private Double getTotalAmountForOrdersThisMonth (){
        Date startOfMonth =  getStartOfMonth();
        Date endOfMonth = getEndOfMonth();

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("entity_status").is(EntityStatus.REGULAR)
                        .and("created_date").gte(startOfMonth).lt(endOfMonth)),
                Aggregation.group().sum("amount").as("totalAmount")
        );

        AggregationResults<Map> result = mongoTemplate.aggregate(aggregation, Order.class, Map.class);

        Map<String, Object> resultMap = result.getUniqueMappedResult();

        if (resultMap != null && resultMap.containsKey("totalAmount")) {
            return (Double) resultMap.get("totalAmount");
        }

        return 0.0;
    }

    private Integer countProductsPublishedThisMonth () {

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("entity_status").is(EntityStatus.REGULAR)
                        .and("publishedDate").gte(getStartOfMonth()).lte(getEndOfMonth())),
                Aggregation.count().as("total")
        );

        AggregationResults<Map> result = mongoTemplate.aggregate(aggregation, Product.class, Map.class);

        Map<String, Object> resultMap = result.getUniqueMappedResult();

        if (resultMap != null && resultMap.containsKey("total")) {
            return (Integer) resultMap.get("total");
        }

        return 0;
    }

    private Integer countOrdersForThisMonth () {

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("entity_status").is(EntityStatus.REGULAR)
                        .and("created_date").gte(getStartOfMonth()).lte(getEndOfMonth())),
                Aggregation.count().as("total")
        );

        AggregationResults<Map> result = mongoTemplate.aggregate(aggregation, Order.class, Map.class);

        Map<String, Object> resultMap = result.getUniqueMappedResult();

        if (resultMap != null && resultMap.containsKey("total")) {
            return (Integer) resultMap.get("total");
        }

        return 0;
    }

    private Integer countNewUsersForThisMonth () {

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("entity_status").is(EntityStatus.REGULAR)
                        .and("created_date").gte(getStartOfMonth()).lte(getEndOfMonth())
                        .and("userType").is(UserType.CUSTOMER)),
                Aggregation.count().as("total")
        );

        AggregationResults<Map> result = mongoTemplate.aggregate(aggregation, User.class, Map.class);

        Map<String, Object> resultMap = result.getUniqueMappedResult();

        if (resultMap != null && resultMap.containsKey("total")) {
            return (Integer) resultMap.get("total");
        }

        return 0;
    }

    public List<Map> findTop5BestSellingProducts(){
        Aggregation aggregation =Aggregation.newAggregation(
                Aggregation.unwind("products"),
                Aggregation.addFields().addField("productId")
                        .withValue(ConvertOperators.ToObjectId.toObjectId(Fields.field("products.product.$id"))).build(),

                Aggregation.group("productId")
                        .sum("products.quantity").as("totalSold"),
                Aggregation.sort(Sort.by(Sort.Direction.DESC, "totalSold")),
                Aggregation.limit(5),
                Aggregation.lookup("product", "_id","_id", "productDetails"),
                Aggregation.unwind("productDetails"),
                Aggregation.project()
                        .and("productDetails.name").as("name")
                        .and("totalSold").as("totalSold")
        );

        AggregationResults<Map> results = mongoTemplate.aggregate(
                aggregation, "order", Map.class
        );

        return results.getMappedResults();
    }

    /**
     * @return
     */
    @Override
    public List<MonthStatisticDTO> getMonthlyStatistic() {

        return monthStatisticRepository.findByYearAndEntityStatus(YearMonth.now().getYear(), EntityStatus.REGULAR).stream().map(this::convertToMonthStatisticDTO).collect(Collectors.toList());
    }

    /**
     * @return
     */
    @Override
    public List<Map> getSaleStatistic() {

        Aggregation aggregation =Aggregation.newAggregation(
                Aggregation.unwind("products"),
                Aggregation.addFields().addField("productId")
                        .withValue(ConvertOperators.ToObjectId.toObjectId(Fields.field("products.product.$id"))).build(),


                Aggregation.lookup("product", "productId","_id", "productDetails"),
                Aggregation.unwind("productDetails"),
                Aggregation.group("productDetails.type").sum("products.quantity").as("totalCount"),
                Aggregation.project().and("_id").as("productType")
                        .and("totalCount").as("totalCount")
                        .andExclude("_id")
        );

        AggregationResults<Map> results = mongoTemplate.aggregate(
                aggregation, "order", Map.class
        );
        return results.getMappedResults();
    }

    /**
     * @return
     */
    @Override
    public List<Map> getOrderTypeStatistic() {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.group("type").count().as("count"),
                Aggregation.project().and("_id").as("orderType")
                        .and("count").as("value").andExclude("_id")
        );
        AggregationResults<Map> results = mongoTemplate.aggregate(
                aggregation, "order", Map.class
        );
        return results.getMappedResults();
    }

    private static Date getStartOfMonth() {
        LocalDate firstDayOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDateTime startOfMonth = firstDayOfMonth.atStartOfDay();

        return Date.from(startOfMonth.atZone(ZoneId.systemDefault()).toInstant());
    }

    private static Date getEndOfMonth() {
        LocalDate lastDayOfMonth = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());
        LocalDateTime endOfMonth = lastDayOfMonth.atTime(23, 59, 59, 999999999);

        return Date.from(endOfMonth.atZone(ZoneId.systemDefault()).toInstant());
    }

    private MonthStatisticDTO convertToMonthStatisticDTO (MonthStatistic monthStatistic){
        MonthStatisticDTO monthStatisticDTO = new MonthStatisticDTO();
        monthStatisticDTO.setMonth(monthStatistic.getMonth());
        monthStatisticDTO.setYear(monthStatistic.getYear());

        monthStatisticDTO.setUnitsSold(monthStatistic.getUnitsSold());
        monthStatisticDTO.setUnitsRented(monthStatistic.getUnitsRented());
        monthStatisticDTO.setRevenue(monthStatistic.getRevenue());
        monthStatisticDTO.setCashTransactions(monthStatistic.getCashTransactions());
        monthStatisticDTO.setCardTransactions(monthStatistic.getCardTransactions());
        monthStatisticDTO.setNewUsers(monthStatistic.getNewUsers());
        monthStatisticDTO.setTotalOrders(monthStatistic.getTotalOrders());
        monthStatisticDTO.setShippedOrders(monthStatistic.getShippedOrders());
        monthStatisticDTO.setPickupOrders(monthStatistic.getPickupOrders());

        return monthStatisticDTO;
    }
}
