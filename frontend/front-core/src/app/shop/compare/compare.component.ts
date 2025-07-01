import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from "../../shared/services/product.service";
import { Product } from "../../shared/classes/product";

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {

  public products: Product[] = [];
  public selectedSizes = new Map<String, any>();
  public selectedColors = new Map<String, any>();

  constructor(private router: Router,
    public productService: ProductService) {
    this.productService.compareItems.subscribe(response => this.products = response);

  }

  ngOnInit(): void {
  }

  async addToCart(product: any) {
    product.quantity = 1
    product.sizes = [this.selectedSizes.get(product.id)]
    product.colors = [this.selectedColors.get(product.id)]
    const status = await this.productService.addToCart(product);
    if (status) {
      this.router.navigate(['/shop/cart']);
    }
  }

  removeItem(product: any) {
    this.selectedSizes.delete(product.id);
    this.selectedColors.delete(product.id);
    this.productService.removeCompareItem(product);
  }

  selectSize(size, product) {
    this.selectedSizes.set(product.id, size);
  }

  isSizeSelected(productId: string, sizeObject: any): boolean {
    const sizes = this.selectedSizes.get(productId);
    return sizes && sizes.size === sizeObject.size;
  }

  selectColor(productId: string, color: any) {
    this.selectedColors.set(productId, color);
  }

  isColorSelected(productId: string, color: any): boolean {
    const selected = this.selectedColors.get(productId);
    return selected?.color === color.color; 
  }
}
