import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from "../../shared/services/product.service";
import { Product } from "../../shared/classes/product";
import { QuickProductSpecComponent } from 'src/app/shared/components/modal/quick-product-spec/quick-product-spec.component';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  public products: Product[] = [];
  @ViewChild("quickProductSpecView") QuickSpecView: QuickProductSpecComponent;

  constructor(private router: Router,
    public productService: ProductService) {
    this.productService.wishlistItems.subscribe(response => this.products = response);
  }

  ngOnInit(): void {
  }

  async addToCart(product: any) {
    const status = await this.productService.addToCart(product);
    if (status) {
      this.router.navigate(['/shop/cart']);
      this.removeItem(product);
    }
  }

  removeItem(product: any) {
    this.productService.removeWishlistItem(product);
  }

  selectProductSpec(product) {
    if (product.sizes.length || product.colors.length) {
      this.QuickSpecView.openModal(product);
    } else {
      this.addToCart(product)
    }
  }
}
