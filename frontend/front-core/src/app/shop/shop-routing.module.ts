import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductLeftSidebarComponent } from './product/sidebar/product-left-sidebar/product-left-sidebar.component';
import { FourImageComponent } from './product/four-image/four-image.component';
import { BundleProductComponent } from './product/bundle-product/bundle-product.component';
import { ImageOutsideComponent } from './product/image-outside/image-outside.component';

import { CollectionLeftSidebarComponent } from './collection/collection-left-sidebar/collection-left-sidebar.component';

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

const routes: Routes = [
  {
    path: 'product/left/sidebar/:slug',
    component: ProductLeftSidebarComponent,
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
    path: 'collection/left/sidebar',
    component: CollectionLeftSidebarComponent
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
    component: SuccessComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
