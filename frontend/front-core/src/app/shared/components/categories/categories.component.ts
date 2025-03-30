import { Component, OnInit } from '@angular/core';
import { Product } from '../../classes/product';
import { ProductService } from '../../services/product.service';
import { FilterParams } from 'src/app/shop/product/domain/FillterParams';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  public products: Product[] = [];
  public collapse: boolean = true;
  categories:any;
  selectedCategoryId: string;
  constructor(public productService: ProductService) { 
    this.productService.getProducts.subscribe(product => this.products = product);
  }

  ngOnInit(): void {
    this.productService.getCategories().subscribe(data=>{
       this.categories = data;
    })

    this.productService.filterParams.subscribe((filter:FilterParams)=>{
      this.selectedCategoryId=filter.categoryId;
    })
  }

  updateCategoryFilter(category:any){
    this.productService.updateCategoryFilter(category.id);
  }
}
