import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { Ng2SmartTableModule } from 'ng2-smart-table';
// import { CKEditorModule } from 'ngx-ckeditor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ProductsRoutingModule } from './products-routing.module';
import { CategoryComponent } from './physical/category/category.component';
import { SubCategoryComponent } from './physical/sub-category/sub-category.component';
import { ProductListComponent } from './physical/product-list/product-list.component';
import { AddProductComponent } from './physical/add-product/add-product.component';
import { ProductDetailComponent } from './physical/product-detail/product-detail.component';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import 'hammerjs';
import 'mousetrap';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxDropzoneModule } from 'ngx-dropzone';
// search module
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SharedModule } from 'src/app/shared/shared.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { EditProductComponent } from './physical/edit-product/edit-product.component';
import { TagComponent } from './physical/tag/tag.component';
// import { NgbdSortableHeader } from "src/app/shared/directives/NgbdSortableHeader";
// import {  } from '../../directives/shorting.directive/';


@NgModule({
  declarations: [CategoryComponent, SubCategoryComponent, ProductListComponent, AddProductComponent, ProductDetailComponent, EditProductComponent, TagComponent
  ],
  imports: [
    Ng2SearchPipeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductsRoutingModule,
    NgbModule,
    GalleryModule,
    CKEditorModule,
    NgxDropzoneModule,
    SharedModule,
    ColorPickerModule

  ],
  exports: [SubCategoryComponent],
  bootstrap: [SubCategoryComponent],
  providers: [
    NgbActiveModal
  ]
})
export class ProductsModule { }
