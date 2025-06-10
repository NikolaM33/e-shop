import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProductService } from '../../products/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})


export class OrderDetailsComponent  implements OnInit{
  public order:any;
    envurl: string = `${environment.publicS3Url}`
    expectedDeliveryDate: Date;

    private orderId: string;
 constructor(private productService: ProductService, private route: ActivatedRoute) {
       this.orderId = this.route.snapshot.paramMap.get('orderId');

  }

ngOnInit(): void {

  this.productService.getOrderById(this.orderId).subscribe((data:any)=>{
    this.order = data;
          const createdDate = new Date(this.order.createdDate);
      this.expectedDeliveryDate = new Date(createdDate.setDate(createdDate.getDate() + 5));
  })
}




}
