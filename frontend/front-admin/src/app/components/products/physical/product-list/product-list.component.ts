import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map} from 'rxjs/operators';
import { productDB } from 'src/app/shared/tables/product-list';
import { ProductService } from '../../product.service';
import { HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  total$: Observable<number>;
  page:number=1;
  pageSize:number=10;
  totalElements:number=0;

  public product_list = []

  constructor(private productService: ProductService,
    private router: Router) {

    this.product_list = productDB.product;
    this.fetchData();
  }

  ngOnInit() {}


  fetchData(){
    let params={
      size: this.pageSize,
      page:this.page,
    //  filter: this.searchText
    };
    this.productService.getProducts(params).pipe(map((response:HttpResponse<any[]>)=>{
      this.totalElements=Number(response.headers.get('X-Total-Elements'));
      const transformedData: any[] = response.body.map(item => {
        return {
          id: item.id,
          img: `${environment.publicS3Url}/product/${item.image1FileIdentifier}`,
          name: item.name,
          price: item.price,
          tagTitle: item.tagTitle,
          priceWithDiscount: item.priceWithDiscount
        };
      });
      return transformedData;

    })).subscribe((data:any)=>{
        this.product_list=data;
    })

  }
  onPageChange(page){
    this.fetchData();
   }

   onPageSizeChange(){
    this.fetchData();
   }

   openProductDetail(productId:string){
    this.router.navigate(['products/physical/product-detail/',productId])
   }
   editProduct(productId:string){
    this.router.navigate(['products/physical/edit-product/',productId])

   }
}
