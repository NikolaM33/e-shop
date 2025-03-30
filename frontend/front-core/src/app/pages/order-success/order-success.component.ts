import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/shared/classes/order';
import { ProductService } from 'src/app/shared/services/product.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss']
})
export class OrderSuccessComponent implements OnInit {

  orderId: string;
  order: any;
  envurl: string = `${environment.publicS3Url}`
  constructor(private productService: ProductService, private route: ActivatedRoute) {    
   }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      // Extract the last part of the URL
      this.orderId = params.get('id'); 
      this.productService.getOrderById(this.orderId).subscribe((data:any)=>{
        this.order= data;
      })
    });

  }

}
