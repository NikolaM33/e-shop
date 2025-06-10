import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { ProductListComponent } from './product-list/product-list.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { TagComponent } from './tag/tag.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'category',
        component: CategoryComponent,
        data: {
          title: "CATEGORY",
          breadcrumb: "CATEGORY"
        }
      },
      {
        path: 'sub-category',
        component: SubCategoryComponent,
        data: {
          title: "Sub Category",
          breadcrumb: "Sub Category"
        }
      },
      {
        path: 'product-list',
        component: ProductListComponent,
        data: {
          title: "Product List",
          breadcrumb: "Product List"
        }
      },
      {
        path: 'product-detail/:id',
        component: ProductDetailComponent,
        data: {
          title: "Product Detail",
          breadcrumb: "Product Detail"
        }
      },
      {
        path: 'add-product',
        component: AddProductComponent,
        data: {
          title: "ADD_PRODUCT",
          breadcrumb: "ADD_PRODUCT"
        }
      },
      {
        path: 'edit-product/:id',
        component: EditProductComponent,
        data: {
          title: "Edit Product",
          breadcrumb: "Edit Product"
        }
      },
      {
        path: 'tags',
        component: TagComponent,
        data: {
          title: "Tags",
          breadcrumb: "Tags"
        }
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
