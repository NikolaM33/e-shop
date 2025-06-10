import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith, delay } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Images, Product } from '../classes/product';
import { environment } from 'src/environments/environment';
import { FilterParams } from 'src/app/shop/product/domain/FillterParams';
import { UtilService } from './util.service';
import { Order } from '../classes/order';
import { ColorsComponent } from '../../shop/collection/widgets/colors/colors.component';

const state = {
  products: JSON.parse(localStorage['products'] || '[]'),
  wishlist: JSON.parse(localStorage['wishlistItems'] || '[]'),
  compare: JSON.parse(localStorage['compareItems'] || '[]'),
  cart: JSON.parse(localStorage['cartItems'] || '[]')
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public filterParam:FilterParams={};
  private _filterParams: BehaviorSubject<FilterParams> = new BehaviorSubject<FilterParams>(this.filterParam);
  public Currency = { name: 'EURO', currency: 'EUR', price: 1 } // Default Currency
  public OpenCart: boolean = false;
  public Products

  constructor(private http: HttpClient,
    private toastrService: ToastrService,
    private utilService: UtilService) { }
  /*
    ---------------------------------------------
    ---------------  Product  -------------------
    ---------------------------------------------
  */

  // Product
  private get products(): Observable<Product[]> {
    this.Products = this.http.get<Product[]>('assets/data/products.json').pipe(map(data => data));
    this.Products.subscribe(next => { localStorage['products'] = JSON.stringify(next) });
    return this.Products = this.Products.pipe(startWith(JSON.parse(localStorage['products'] || '[]')));
  }

  // Get Products
  public get getProducts(): Observable<Product[]> {
    return this.products;
  }

  // Get Products By Slug
  public getProductBySlug(slug: string): Observable<Product> {
    return this.products.pipe(map(items => { 
      return items.find((item: any) => { 
        return item.title.replace(' ', '-') === slug; 
      }); 
    }));
  }

  public getProductsFilter(filters:any, params) {
    let allParams= this.utilService.generatePageParams(params);
    allParams = { ...allParams, ...filters };
    return this.http.get(environment.apiUrl+'/shop/products',{params:allParams}).pipe(
      map((response: any) => {
        return response.map((product: any) => this.mapApiResponseToProduct(product));
      })
    );
  }

  public getProductBrands(productType:string){
    const params = {type: productType}
    return this.http.get(environment.apiUrl+'/shop/brand', {params: params});
  }

  getProductById (productId: string){
    return this.http.get<any>(environment.apiUrl+'/shop/product/'+productId).pipe(
      map(product => this.mapApiResponseToProduct(product)))
    
  }

  getNewProducts (){
    return this.http.get(environment.apiUrl+'/shop/product/new-products');
  }

  public setProductImages (product:any):Images[]{
    let images:Images[]=[];
    for (let i=1; i<=6; i++){
      let img: Images={
      src:`${environment.publicS3Url}/product/${product[`image${i}FileIdentifier`]}`,
      alt: `Image ${i}`
      }
      images.push(img);
    }

    return images;
  }

 public getRelatedProducts (categoryId:string){
  return this.http.get<Product[]>(environment.apiUrl+'/shop/product/related-products/'+categoryId).pipe(
    map(products => products.map(product=> this.mapApiResponseToProduct(product))))
 }

  public getRandomProducts (){
  return this.http.get<Product[]>(environment.apiUrl+'/shop/product/random').pipe(
    map(products => products.map(product=> this.mapApiResponseToProduct(product))))
 }

 mapApiResponseToProduct(apiData: any): Product {
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
    publish: apiData.publish,
    rent: apiData.rent,
    code: apiData.code,
    quantity: apiData.quantity,
    tag: { id: apiData.tagId, title: apiData.tagTitle }, 
    images:this.setProductImages(apiData),
    specifications: this.mapSpecifications(apiData.specifications),
    colors: apiData.colors,
    sizes: apiData.sizes,
    priceWithDiscount: apiData.priceWithDiscount,
    discountStartDate: apiData.discountStartDate,
    discountEndDate:  apiData.discountEndDate,
  };
}
private mapSpecifications(specifications: { [key: string]: string }): any[] {
  return Object.entries(specifications).map(([key, value]) => ({
    key,
    value
  }));

  
}
  /*
    ---------------------------------------------
    ---------------  Payment  -----------------
    ---------------------------------------------
  */
public createPaymentIntent (order: Order){
  return this.http.post<{ clientSecret: string }>(`${environment.apiUrl}/shop/payment/create-payment-intent`, order);
}
  /*
    ---------------------------------------------
    ---------------  Order  -----------------
    ---------------------------------------------
  */
 public createOrder (order){
  return this.http.post(`${environment.apiUrl}/shop/order`, order)
 }

 public getOrderById (orderId: string){
  return this.http.get(`${environment.apiUrl}/shop/order/${orderId}`)
 }
  /*
    ---------------------------------------------
    ---------------  Wish List  -----------------
    ---------------------------------------------
  */

  // Get Wishlist Items
  public get wishlistItems(): Observable<Product[]> {
    const itemsStream = new Observable(observer => {
      observer.next(state.wishlist);
      observer.complete();
    });
    return <Observable<Product[]>>itemsStream;
  }

  // Add to Wishlist
  public addToWishlist(product): any {
    const wishlistItem = state.wishlist.find(item => item.id === product.id)
    if (!wishlistItem) {
      state.wishlist.push({
        ...product
      })
    }
    this.toastrService.success('Product has been added in wishlist.');
    localStorage.setItem("wishlistItems", JSON.stringify(state.wishlist));
    return true
  }

  // Remove Wishlist items
  public removeWishlistItem(product: Product): any {
    const index = state.wishlist.indexOf(product);
    state.wishlist.splice(index, 1);
    localStorage.setItem("wishlistItems", JSON.stringify(state.wishlist));
    return true
  }

  /*
    ---------------------------------------------
    -------------  Compare Product  -------------
    ---------------------------------------------
  */

  // Get Compare Items
  public get compareItems(): Observable<Product[]> {
    const itemsStream = new Observable(observer => {
      observer.next(state.compare);
      observer.complete();
    });
    return <Observable<Product[]>>itemsStream;
  }

  // Add to Compare
  public addToCompare(product): any {
    const compareItem = state.compare.find(item => item.id === product.id)
    if (!compareItem) {
      state.compare.push({
        ...product
      })
    }
    this.toastrService.success('Product has been added in compare.');
    localStorage.setItem("compareItems", JSON.stringify(state.compare));
    return true
  }

  // Remove Compare items
  public removeCompareItem(product: Product): any {
    const index = state.compare.indexOf(product);
    state.compare.splice(index, 1);
    localStorage.setItem("compareItems", JSON.stringify(state.compare));
    return true
  }

  /*
    ---------------------------------------------
    -----------------  Cart  --------------------
    ---------------------------------------------
  */

  // Get Cart Items
  public get cartItems(): Observable<Product[]> {
    const itemsStream = new Observable(observer => {
      observer.next(state.cart);
      observer.complete();
    });
    return <Observable<Product[]>>itemsStream;
  }

  // Add to Cart
  public addToCart(product): any {
    const cartItem = state.cart.find(item => item.id === product.id && item.sizes[0]?.size === product.sizes[0]?.size && item?.colors[0]?.color === product?.colors[0]?.color);
    const qty = product.quantity ? product.quantity : 1;
    const items = cartItem ? cartItem : product;
    const stock = this.calculateStockCounts(items, qty);
    
    if(!stock) return false

    if (cartItem) {
        cartItem.quantity += qty    
    } else {
      state.cart.push({
        ...product,
        quantity: qty
      })
    }

    this.OpenCart = true; // If we use cart variation modal
    localStorage.setItem("cartItems", JSON.stringify(state.cart));
    return true;
  }

  // Update Cart Quantity
  public updateCartQuantity(product: Product, quantity: number): Product | boolean {
    return state.cart.find((items, index) => {
      if (items.id === product.id) {
        const qty = state.cart[index].quantity + quantity
        const stock = this.calculateStockCounts(state.cart[index], quantity)
        if (qty !== 0 && stock) {
          state.cart[index].quantity = qty
        }
        localStorage.setItem("cartItems", JSON.stringify(state.cart));
        return true
      }
    })
  }

    // Calculate Stock Counts
  public calculateStockCounts(product, quantity) {
    const qty = product.quantity + quantity
    const stock = product.stock
    if (stock < qty || stock == 0) {
      this.toastrService.error('You can not add more items than available. In stock '+ stock +' items.');
      return false
    }
    return true
  }

  // Remove Cart items
  public removeCartItem(product: Product): any {
    const index = state.cart.indexOf(product);
    state.cart.splice(index, 1);
    localStorage.setItem("cartItems", JSON.stringify(state.cart));
    return true
  }

  // Total amount 
  public cartTotalAmount(): Observable<number> {
    return this.cartItems.pipe(map((product: Product[]) => {
      return product.reduce((prev, curr: Product) => {
        let price = curr.price;
        if(curr.discount) {
          price = curr.price - (curr.price * curr.discount / 100)
        }
        return (prev + price * curr.quantity) * this.Currency.price;
      }, 0);
    }));
  }

  public clearCart(): boolean {
    state.cart = [];
    localStorage.removeItem("cartItems");
    return true;
  }

  /*
    ---------------------------------------------
    ------------  Filter Product  ---------------
    ---------------------------------------------
  */

  // Get Product Filter
  // public filterProducts(filter: any): Observable<Product[]> {
  //   return this.products.pipe(map(product => 
  //     product.filter((item: Product) => {
  //       if (!filter.length) return true
  //       const Tags = filter.some((prev) => { // Match Tags
  //         if (item.tags) {
  //           if (item.tags.includes(prev)) {
  //             return prev
  //           }
  //         }
  //       })
  //       return Tags
  //     })
  //   ));
  // }

  // Sorting Filter
  public sortProducts(products: Product[], payload: string): any {

    if(payload === 'ascending') {
      return products.sort((a, b) => {
        if (a.id < b.id) {
          return -1;
        } else if (a.id > b.id) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'a-z') {
      return products.sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        } else if (a.title > b.title) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'z-a') {
      return products.sort((a, b) => {
        if (a.title > b.title) {
          return -1;
        } else if (a.title < b.title) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'low') {
      return products.sort((a, b) => {
        if (a.price < b.price) {
          return -1;
        } else if (a.price > b.price) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'high') {
      return products.sort((a, b) => {
        if (a.price > b.price) {
          return -1;
        } else if (a.price < b.price) {
          return 1;
        }
        return 0;
      })
    } 
  }

  /*
    ---------------------------------------------
    ------------- Product Pagination  -----------
    ---------------------------------------------
  */
  public getPager(totalItems: number, currentPage: number = 1, pageSize: number = 16) {
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);

    // Paginate Range
    let paginateRange = 3;

    // ensure current page isn't out of range
    if (currentPage < 1) { 
      currentPage = 1; 
    } else if (currentPage > totalPages) { 
      currentPage = totalPages; 
    }
    
    let startPage: number, endPage: number;
    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else if(currentPage < paginateRange - 1){
      startPage = 1;
      endPage = startPage + paginateRange - 1;
    } else {
      startPage = currentPage - 1;
      endPage =  currentPage + 1;
    }

    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }

  /*
   --------------------------------------
   -------------Category-----------------
   --------------------------------------
  */

  getCategories (){
    return  this.http.get(environment.apiUrl +'/shop/categories')
  }
  get filterParams() {
    return this._filterParams.asObservable();
  }

  updateFilterParams(newValue: FilterParams) {
    this._filterParams.next(newValue);
  }
  
  updateCategoryFilter(newCategory: string) {
    const currentFilter = this._filterParams.value;  
    const updatedFilter = { ...currentFilter, categoryId: newCategory }; 
    this._filterParams.next(updatedFilter); 
  }

  updatePriceFilter(min: number, max:number) {
    const currentFilter = this._filterParams.value;  
    const updatedFilter = { ...currentFilter,  minPrice: min, maxPrice:max }; 
    this._filterParams.next(updatedFilter); 
  }

  updateBrendFilter(brands: string[]) {
    const currentFilter = this._filterParams.value;  
    const updatedFilter = { ...currentFilter, brand: brands}; 
    this._filterParams.next(updatedFilter); 
  }
}
