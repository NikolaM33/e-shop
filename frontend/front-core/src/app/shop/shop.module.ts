import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { NgxPayPalModule } from 'ngx-paypal';
import { Ng5SliderModule } from 'ng5-slider';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from '../shared/shared.module';
import { ShopRoutingModule } from './shop-routing.module';

// Product Details Components
import { ProductLeftSidebarComponent } from './product/sidebar/product-left-sidebar/product-left-sidebar.component';
import { FourImageComponent } from './product/four-image/four-image.component';
import { ThreeColumnComponent } from './product/three-column/three-column.component';
import { BundleProductComponent } from './product/bundle-product/bundle-product.component';
import { ImageOutsideComponent } from './product/image-outside/image-outside.component';

// Product Details Widgest Components
import { ServicesComponent } from './product/widgets/services/services.component';
import { CountdownComponent } from './product/widgets/countdown/countdown.component';
import { SocialComponent } from './product/widgets/social/social.component';
import { StockInventoryComponent } from './product/widgets/stock-inventory/stock-inventory.component';
import { RelatedProductComponent } from './product/widgets/related-product/related-product.component';


// Collection Widgets
import { GridComponent } from './collection/widgets/grid/grid.component';
import { PaginationComponent } from './collection/widgets/pagination/pagination.component';
import { BrandsComponent } from './collection/widgets/brands/brands.component';
import { ColorsComponent } from './collection/widgets/colors/colors.component';
import { SizeComponent } from './collection/widgets/size/size.component';
import { PriceComponent } from './collection/widgets/price/price.component';

import { CartComponent } from './cart/cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CompareComponent } from './compare/compare.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SuccessComponent } from './checkout/success/success.component';

import {RouterModule} from '@angular/router';
import { RentCollectionComponent } from './collection/rent-collection/rent-collection.component';
import { ProductRentComponent } from './product/sidebar/product-rent/product-rent.component';
import { PaymentComponent } from './checkout/payment/payment/payment.component';
import { CollectionComponent } from './collection/collection-page/collection.component';


@NgModule({
  declarations: [
    ProductLeftSidebarComponent, 
    ThreeColumnComponent,
    FourImageComponent,
    BundleProductComponent,
    ImageOutsideComponent,
    ServicesComponent,
    CountdownComponent,
    SocialComponent,
    StockInventoryComponent,
    RelatedProductComponent,
    CollectionComponent,
    GridComponent,
    PaginationComponent,
    BrandsComponent,
    ColorsComponent,
    SizeComponent,
    PriceComponent,
    CartComponent,
    WishlistComponent,
    CompareComponent,
    CheckoutComponent,
    SuccessComponent,
    RentCollectionComponent,
    ProductRentComponent,
    PaymentComponent
  ],
  imports: [
    CommonModule,
    // NgxPayPalModule,
    Ng5SliderModule,
    InfiniteScrollModule,
    SharedModule,
    ShopRoutingModule,
    RouterModule
  ]
})
export class ShopModule { }
