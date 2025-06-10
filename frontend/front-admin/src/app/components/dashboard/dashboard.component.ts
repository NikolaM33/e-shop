import { Component, OnInit } from '@angular/core';
import * as chartData from '../../shared/data/chart';
import { doughnutChartcolorScheme } from '../../shared/data/chart';
import { DashboardService } from './dashboard.service';
import { ProductService } from '../products/product.service';
import { HttpResponse } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public saleStatistic: any;
  public orders: any;
  public monthStatistic: any;
  public lastMonthStasticData: any;
  public lastMonthName: any;
  public lowStackProducts: any;

  public employees: any;

  public statistic: any;
  public saleCountValue: number = 0;
  public rentCountValue: number = 0;

  public orderTypeShipping: number = 0;
  public orderTypeLocalPickup: number = 0;
  public orderTypeStatistic: any;
  public orderTypeChartCustomColors =[];

  constructor(private dashboardService: DashboardService, private productService: ProductService, private translateService: TranslateService) {
  }

  // doughnut 2
  public view = chartData.view;
  public doughnutChartCustomColors = [];
  public doughnutChartColorScheme = chartData.doughnutChartcolorScheme;
  public doughnutChartShowLabels = chartData.doughnutChartShowLabels;
  public doughnutChartGradient = chartData.doughnutChartGradient;
  public doughnutChartTooltip = chartData.doughnutChartTooltip;

  public chart5 = chartData.chart5;


  // lineChart
  public lineChartData = chartData.lineChartData;
  public lineChartLabels = chartData.lineChartLabels;
  public lineChartOptions = chartData.lineChartOptions;
  public lineChartColors = chartData.lineChartColors;
  public lineChartLegend = chartData.lineChartLegend;
  public lineChartType = chartData.lineChartType;

  // lineChart
  public smallLineChartData = chartData.smallLineChartData;
  public smallLineChartLabels = chartData.smallLineChartLabels;
  public smallLineChartOptions = chartData.smallLineChartOptions;
  public smallLineChartLegend = chartData.smallLineChartLegend;
  public smallLineChartType = chartData.smallLineChartType;

  // lineChart
  public smallLine2ChartData = chartData.smallLine2ChartData;
  public smallLine2ChartLabels = chartData.smallLine2ChartLabels;
  public smallLine2ChartOptions = chartData.smallLine2ChartOptions;
  public smallLine2ChartLegend = chartData.smallLine2ChartLegend;
  public smallLine2ChartType = chartData.smallLine2ChartType;

  // lineChart
  public smallLine3ChartData = chartData.smallLine3ChartData;
  public smallLine3ChartLabels = chartData.smallLine3ChartLabels;
  public smallLine3ChartOptions = chartData.smallLine3ChartOptions;
  public smallLine3ChartLegend = chartData.smallLine3ChartLegend;
  public smallLine3ChartType = chartData.smallLine3ChartType;

  // lineChart
  public smallLine4ChartData = chartData.smallLine4ChartData;
  public smallLine4ChartLabels = chartData.smallLine4ChartLabels;
  public smallLine4ChartOptions = chartData.smallLine4ChartOptions;
  public smallLine4ChartColors = chartData.smallLine4ChartColors;
  public smallLine4ChartLegend = chartData.smallLine4ChartLegend;
  public smallLine4ChartType = chartData.smallLine4ChartType;

  public chart3 = chartData.chart3;



  // events
  public chartClicked(e: any): void {
  }
  public chartHovered(e: any): void {
  }

  ngOnInit() {


    this.dashboardService.getCurrentMonthStatistic().subscribe((data: any) => {
      this.monthStatistic = data;
    })
    const orderParams = {
      sortActive: 'createdDate',
      sortDirection: 'asc',
      size: 5
    }
    this.productService.getOrders(orderParams).subscribe((response: HttpResponse<any[]>) => {
      this.orders = response.body;
    })

    this.dashboardService.getTop5BestSellingProducts().subscribe((data: any) => {
      chartData.chart3.data.labels = data.map(p => p.name);
      chartData.chart3.data.series = [data.map(p => p.totalSold)];
      this.chart3 = { ...chartData.chart3 }
    })

    this.dashboardService.getMonthlyStatistic().subscribe((data: any) => {
      this.statistic = data;
      console.log("STATS", data)
      this.getLastMonthStatistic();
    });

    this.dashboardService.getLowStockProducts().subscribe((data: any) => {
      console.log("PRODUCTS", data);
      this.lowStackProducts = data;
    });

    this.dashboardService.getEmplyees().subscribe((data: any) => {
      this.employees = data.map(employee => ({
        ...employee,
        experience: this.getExperience(employee?.createdDate)
      }))
    })

    this.dashboardService.getSaleStatistic().subscribe((data: any) => {

      this.saleStatistic = data.map(stat => ({
        name: this.translateService.instant(stat.productType),
        value: stat.totalCount
      }));
      this.doughnutChartCustomColors = [
        { name: this.translateService.instant('SALE'), value: '#ff7f83' },
        { name: this.translateService.instant('RENT'), value: '#02cccd' }];
      this.getSaleAndRentValue();
    });

    this.dashboardService.getOrderTypeStatistic().subscribe((data:any)=>{
      this.orderTypeStatistic = data.map(stat =>({
        name: this.translateService.instant(stat.orderType),
        value: stat.value
      }))
      this.orderTypeChartCustomColors = [
        { name: this.translateService.instant('SHIPPING'), value: '#ffbc58' },
        { name: this.translateService.instant('LOCAL_PICKUP'), value: '#81ba00' }];

        this.getShiipedAndLocalPickupValue();
    })
  }

  getLastMonthStatistic() {
    const currentMonth = new Date().getMonth() + 1;

    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;

    this.lastMonthStasticData = this.statistic.find(stat => stat.month === lastMonth && stat.year === new Date().getFullYear());
    this.lastMonthName = this.getMonthName(this.lastMonthStasticData.month)
  }

  getMonthName(month: number): string {
    const date = new Date(2025, month - 1);
    return date.toLocaleString('default', { month: 'long' });
  }

  getExperience(createdDate: string): { years: number, months: number } {
    const startDate = new Date(createdDate);
    const currentDate = new Date();

    let yearsOfExperience = currentDate.getFullYear() - startDate.getFullYear();
    let monthsOfExperience = currentDate.getMonth() - startDate.getMonth();

    // Adjust years if the current month is earlier than the start month
    if (monthsOfExperience < 0) {
      yearsOfExperience--;
      monthsOfExperience += 12; // Add 12 months because months are 0-based
    }

    // Adjust months if the current day of the month is before the start day
    if (currentDate.getDate() < startDate.getDate()) {
      monthsOfExperience--;
      if (monthsOfExperience < 0) {
        monthsOfExperience = 11;
        yearsOfExperience--;
      }
    }

    return { years: yearsOfExperience, months: monthsOfExperience };
  }

  getSaleAndRentValue() {
    this.saleCountValue = this.saleStatistic.find(s => s.name === this.translateService.instant('SALE'))?.value?? 0;
    this.rentCountValue = this.saleStatistic.find(s => s.name === this.translateService.instant('RENT'))?.value?? 0;
  }

  getShiipedAndLocalPickupValue() {
    this.orderTypeShipping = this.orderTypeStatistic.find(s => s.name === this.translateService.instant('SHIPPING'))?.value?? 0;
    this.orderTypeLocalPickup = this.orderTypeStatistic.find(s => s.name === this.translateService.instant('LOCAL_PICKUP'))?.value ?? 0;
  }
}
