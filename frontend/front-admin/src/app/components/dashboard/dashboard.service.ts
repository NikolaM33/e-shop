import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient,
  ) {
  }


  getCurrentMonthStatistic() {
    return this.http.get(environment.apiUrl + '/administration/dashboard/month-statistic')
  }

  getTop5BestSellingProducts() {
    return this.http.get(environment.apiUrl + '/administration/dashboard/top-sellers')
  }

  getMonthlyStatistic() {
    return this.http.get(environment.apiUrl + '/administration/dashboard/statistic')

  }

  getLowStockProducts() {
    return this.http.get(environment.apiUrl + '/administration/dashboard/low-stock')
  }

  getEmplyees() {
    return this.http.get(environment.apiUrl + '/administration/dashboard/employees')
  }

  getSaleStatistic() {
    return this.http.get(environment.apiUrl + '/administration/dashboard/sale-stats')
  }

  getOrderTypeStatistic() {
    return this.http.get(environment.apiUrl + '/administration/dashboard/order-type')
  }
}
