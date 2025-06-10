package com.shop.contoller.dashboard;

import com.shop.domain.dto.dashboard.CurrentMonthStatisticDTO;
import com.shop.domain.dto.product.ProductDTO;
import com.shop.domain.dto.statistic.MonthStatisticDTO;
import com.shop.domain.dto.user.UserDTO;
import com.shop.service.dashboard.DashboardService;
import com.shop.service.product.ProductService;
import com.shop.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/administration/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    private final ProductService productService;

    private final UserService userService;

    @GetMapping("/month-statistic")
    public ResponseEntity<CurrentMonthStatisticDTO> getCurrentMonthStatistic(){
        return new ResponseEntity<>(dashboardService.getCurrentMonthStatistic(), HttpStatus.OK);
    }

    @GetMapping("/top-sellers")
    public ResponseEntity<List<Map>> getTop5BestSellingProducts () {
        return new ResponseEntity<>(dashboardService.findTop5BestSellingProducts(), HttpStatus.OK);
    }

    @GetMapping("/statistic")
    public ResponseEntity<List<MonthStatisticDTO>> getMonthlyStatistic (){
        return new ResponseEntity<>(dashboardService.getMonthlyStatistic(), HttpStatus.OK);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<ProductDTO>> getProducts (){
        return new ResponseEntity<>(productService.getLowStockProducts(), HttpStatus.OK);
    }

    @GetMapping("/employees")
    public ResponseEntity<List<UserDTO>> getEmployees () {
        return new ResponseEntity<>(userService.getEmployees(), HttpStatus.OK);
    }

    @GetMapping("/sale-stats")
    public ResponseEntity<List<Map>> getSalleStats (){
        return new ResponseEntity<>(dashboardService.getSaleStatistic(), HttpStatus.OK);
    }

    @GetMapping("/order-type")
    public ResponseEntity<List<Map>> getOrderTypeStats () {
        return new ResponseEntity<>(dashboardService.getOrderTypeStatistic(), HttpStatus.OK);
    }
}
