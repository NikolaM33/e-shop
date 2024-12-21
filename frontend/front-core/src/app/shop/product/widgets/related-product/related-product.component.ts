import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../../../shared/classes/product';
import { ProductService } from '../../../../shared/services/product.service';

@Component({
  selector: 'app-related-product',
  templateUrl: './related-product.component.html',
  styleUrls: ['./related-product.component.scss']
})
export class RelatedProductComponent implements OnInit {
  
  @Input() categoryId: string

  public products: Product[] = [];

  constructor(public productService: ProductService) { 
  
  }

  ngOnInit(): void {
    console.log(this.categoryId)
    this.productService.getRelatedProducts(this.categoryId).subscribe((data:any) => 
      this.products = data
  
    );
  }

}
