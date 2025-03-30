import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../../shared/classes/product';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {

  @Input() products: Product[] = [];
  @Input() brands: any[] = [];
  @Input() productType: string;
  
  public collapse: boolean = true;
  selectedBrands: string[] = []; 
  constructor(private productService:ProductService) { 
  }

  ngOnInit(): void {
    this.productService.getProductBrands(this.productType).subscribe((data:any[])=>{
      this.brands=data;
    })
  }

  

  appliedFilter(event) {
    const checkbox = event.target as HTMLInputElement;
    const brand = checkbox.value;
  
    if (checkbox.checked) {
      if (!this.selectedBrands.includes(brand)) {
        this.selectedBrands.push(brand);
      }
    } else {
      this.selectedBrands = this.selectedBrands.filter(b => b !== brand);
    }
    this.productService.updateBrendFilter(this.selectedBrands);
  }

  // check if the item are selected
  checked(brand: string): boolean {
      return this.selectedBrands.includes(brand);
  }

}
