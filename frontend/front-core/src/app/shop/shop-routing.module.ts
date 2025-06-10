import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductLeftSidebarComponent } from './product/sidebar/product-left-sidebar/product-left-sidebar.component';
import { FourImageComponent } from './product/four-image/four-image.component';
import { BundleProductComponent } from './product/bundle-product/bundle-product.component';
import { ImageOutsideComponent } from './product/image-outside/image-outside.component';

import { CollectionComponent } from './collection/collection-page/collection.component';

import { CartComponent } from './cart/cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CompareComponent } from './compare/compare.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SuccessComponent } from './checkout/success/success.component';

import { Resolver } from '../shared/services/resolver.service';
import { ContactComponent } from '../pages/account/contact/contact.component';
import { ForgetPasswordComponent } from '../pages/account/forget-password/forget-password.component';
import { ProfileComponent } from '../pages/account/profile/profile.component';
import { RegisterComponent } from '../pages/account/register/register.component';
import { LoginComponent } from '../pages/account/login/login.component';
import { DashboardComponent } from '../pages/account/dashboard/dashboard.component';
import { RentCollectionComponent } from './collection/rent-collection/rent-collection.component';
import { ProductRentComponent } from './product/sidebar/product-rent/product-rent.component';
import { OrderSuccessComponent } from '../pages/order-success/order-success.component';

const routes: Routes = [
  {
    path: 'product/:slug',
    component: ProductLeftSidebarComponent,
    resolve: {
      data: Resolver
    }
  },
  {
    path: 'rent/product/:slug',
    component: ProductRentComponent,
    resolve: {
      data: Resolver
    }
  },
  {
    path: 'product/four/image/:slug',
    component: FourImageComponent,
    resolve: {
      data: Resolver
    }
  },
  {
    path: 'product/bundle/:slug',
    component: BundleProductComponent,
    resolve: {
      data: Resolver
    }
  },
  {
    path: 'product/image/outside/:slug',
    component: ImageOutsideComponent,
    resolve: {
      data: Resolver
    }
  },
  {
    path: '',
    component: CollectionComponent
  },
  {
    path: 'rent',
    component: RentCollectionComponent
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  {
    path: 'dashboard', 
    component: DashboardComponent 
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'wishlist',
    component: WishlistComponent
  },
  { 
    path: 'register', 
    component: RegisterComponent 
  },
  { 
    path: 'forget/password', 
    component: ForgetPasswordComponent 
  },
  { 
    path: 'profile', 
    component: ProfileComponent 
  },
  { 
    path: 'contact', 
    component: ContactComponent 
  },
  {
    path: 'compare',
    component: CompareComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: 'checkout/success/:id',
    component: OrderSuccessComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
