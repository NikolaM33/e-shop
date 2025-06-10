import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageService } from '../page.service';
import { UtilService } from '../util.service';
import { environment } from 'src/environments/environment';
import { env } from 'process';
import { Environment } from 'ag-grid-community';
import { Images, Product } from './product';
import { map } from 'rxjs';
import { element } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public Currency = { name: 'Dollar', currency: 'USD', price: 1 }
  constructor(private http: HttpClient,
    private pageService: PageService,
    private utilService: UtilService) {
  }

  createNewCategory(data: FormData) {
    return this.http.post(environment.apiUrl + '/category', data)
  }

  getCategories(params) {
    return this.http.get(environment.apiUrl + '/category', {
      params: this.utilService.generatePageParams(params),
      observe: 'response'

    })
  }

  deleteCategory(categoryId: number) {
    return this.http.delete(environment.apiUrl + '/category/' + categoryId);
  }

  editCateogry(categoryId: string, data: any) {
    return this.http.put(environment.apiUrl + '/category/' + categoryId, data);
  }

  getAllCategories() {
    return this.http.get(environment.apiUrl + '/category/all');
  }

  createNewSubCateogry(data: FormData) {
    return this.http.post(environment.apiUrl + '/sub-category', data)
  }
  getSubCategories(params) {
    return this.http.get(environment.apiUrl + '/sub-category', {
      params: this.utilService.generatePageParams(params),
      observe: 'response'
    })
  }

  editSubCategory(subCategoryId: string, data: any) {
    return this.http.put(environment.apiUrl + '/sub-category/' + subCategoryId, data);
  }

  deleteSubCategory(subCategoryId: string) {
    return this.http.delete(environment.apiUrl + '/sub-category/' + subCategoryId);
  }

  findSubCateogryOfCategory(categoryId: string) {
    return this.http.get(environment.apiUrl + '/category/' + categoryId + '/sub-category');
  }

  addProduct(data: FormData) {
    return this.http.post(environment.apiUrl + '/product', data);
  }

  getProducts(params) {
    return this.http.get(environment.apiUrl + '/product', {
      params: this.utilService.generatePageParams(params),
      observe: 'response'

    })
  }
  getProduct(productId: string) {
    return this.http.get(environment.apiUrl + '/product/' + productId).pipe(
      map(product => this.mapApiResponseToProduct(product)))
  }

  mapApiResponseToProduct(apiData: any): Product {
    console.log(apiData)
    return {
      id: apiData.id,
      title: apiData.name,
      description: apiData.description,
      brand: apiData.brand,
      category: apiData.categoryId,
      subCategory: apiData.subCategoryId,
      price: apiData.price,
      sale: apiData.discount > 0,
      discount: apiData.discount,
      stock: apiData.quantity,
      publish: apiData.publish,
      rent: apiData.rent,
      code: apiData.code,
      quantity: apiData.quantity,
      tag: { id: apiData.tagId, title: apiData.tagTitle },
      images: this.setProductImages(apiData),
      specifications: this.mapSpecifications(apiData.specifications),
      colors: apiData.colors,
      sizes: apiData.sizes,
      priceWithDiscount: apiData.priceWithDiscount,
      discountStartDate: apiData.discountStartDate,
      discountEndDate: apiData.discountEndDate,
    };
  }
  private mapSpecifications(specifications: { [key: string]: string }): any[] {
    console.log(specifications)
    return Object.entries(specifications).map(([key, value]) => ({
      key,
      value
    }));
  }

  public setProductImages(product: any): Images[] {
    console.log(product)
    let images: Images[] = [];
    for (let i = 1; i <= 6; i++) {
      let img: Images = {
        src: `${environment.publicS3Url}/product/${product[`image${i}FileIdentifier`]}`,
        alt: `Image ${i}`
      }
      images.push(img);
    }

    return images;
  }



  updateProduct(productId: string, data: FormData) {
    return this.http.put(environment.apiUrl + "/product/" + productId, data);
  }

  //Product tags

  addTag(title: string) {
    return this.http.post(environment.apiUrl + "/product-tag/add-tag", title)
  }

  getAllTags() {
    return this.http.get(environment.apiUrl + "/product-tag/all-tags")
  }

  updateTag(tagId: string, title: string) {
    return this.http.put(environment.apiUrl + "/product-tag/" + tagId, title);
  }

  deleteTag(tagId: string) {
    return this.http.delete(environment.apiUrl + "/product-tag/" + tagId);
  }

  //ORDERS

  getOrders(params) {
    return this.http.get(environment.apiUrl + "/administration/order", {
      params: this.utilService.generatePageParams(params),
      observe: 'response'

    })
  }

  updateOrderStatus(orderId: string, status: string) {
    return this.http.patch(environment.apiUrl +"/administration/order/"+orderId, status)
  }

  public getOrderById(orderId: string) {
    return this.http.get(`${environment.apiUrl}/shop/order/${orderId}`)
  }

}
