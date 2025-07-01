import { HttpResponse } from '@angular/common/http';
import { Component, Input, SimpleChanges, } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';


@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent {
  @Input() userId: any;
 orders: any[] = []; 
  currentPage = 1;
  itemsPerPage = 5;
  pageSizeOptions = [5, 10, 25];
  totalItems = 0; 
  isLoading = false; 


  constructor(private productService: ProductService) {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['userId']) {
      this.fetchUserOrders();
    }
  }



  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.fetchUserOrders();
  }
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
  onItemsPerPageChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.itemsPerPage = Number(select.value);
    this.currentPage = 1; 
    this.fetchUserOrders();
  }

  fetchUserOrders() {
    this.isLoading = true;
    
    // Create pagination parameters
    const params = {
      page: this.currentPage.toString(),
      size: this.itemsPerPage.toString()
    };

    this.productService.getUserOrders(this.userId, params).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.orders = response.body || [];
        this.totalItems = Number(response.headers.get('x-total-elements') || this.orders.length);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
        this.isLoading = false;
      }
    });
  }
}
