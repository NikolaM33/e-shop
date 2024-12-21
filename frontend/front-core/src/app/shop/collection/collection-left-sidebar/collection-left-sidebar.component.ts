import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ProductService } from "../../../shared/services/product.service";
import { Product, Images } from '../../../shared/classes/product';
import { environment } from 'src/environments/environment';
import { FilterParams } from '../../product/domain/FillterParams';
import { BehaviorSubject, combineLatest } from 'rxjs';

@Component({
  selector: 'app-collection-left-sidebar',
  templateUrl: './collection-left-sidebar.component.html',
  styleUrls: ['./collection-left-sidebar.component.scss']
})
export class CollectionLeftSidebarComponent implements OnInit {
  
  public grid: string = 'col-xl-3 col-md-6';
  public layoutView: string = 'grid-view';
  public products: Product[] = [];
  public brands: any[] = [];
  public colors: any[] = [];
  public size: any[] = [];
  public minPrice: number = 0;
  public maxPrice: number = 1200;
  public tags: any[] = [];
  public category: string;
  public pageNo: number = 1;
  public paginate: any = {}; // Pagination use only
  public sortBy: string; // Sorting Order
  public mobileSidebar: boolean = false;
  public loader: boolean = true;

  filterParams = this.productService.filterParams;

  // Assuming sortParams is an Observable that emits the current sort criteria
  params = new BehaviorSubject<any>({}); 

  constructor(private route: ActivatedRoute, private router: Router,
    private viewScroller: ViewportScroller, public productService: ProductService) {   
      // Get Query params..
      this.route.queryParams.subscribe(params => {
        this.brands = params.brand ? params.brand.split(",") : [];
        this.colors = params.color ? params.color.split(",") : [];
        this.size  = params.size ? params.size.split(",")  : [];
        this.minPrice = params.minPrice ? params.minPrice : this.minPrice;
        this.maxPrice = params.maxPrice ? params.maxPrice : this.maxPrice;
        this.tags = [...this.brands, ...this.colors, ...this.size]; // All Tags Array
        
        this.category = params.category ? params.category : null;
        this.sortBy = params.sortBy ? params.sortBy : 'ascending';
        this.pageNo = params.page ? params.page : this.pageNo;

        // Get Filtered Products..
        // this.productService.filterProducts(this.tags).subscribe(response => {         
        //   // Sorting Filter
        //   this.products = this.productService.sortProducts(response, this.sortBy);
        //   // Category Filter
        //   if(params.category)
        //     this.products = this.products.filter(item => item.type == this.category);
        //   // Price Filter
        //   this.products = this.products.filter(item => item.price >= this.minPrice && item.price <= this.maxPrice) 
        //   // Paginate Products
        //   this.paginate = this.productService.getPager(this.products.length, +this.pageNo);     // get paginate object from service
        //   this.products = this.products.slice(this.paginate.startIndex, this.paginate.endIndex + 1); // get current page of items
        // })
        if(this.category){
          this.productService.updateCategoryFilter(this.category)
        }
      })
  }

  ngOnInit(): void {
    combineLatest([this.filterParams, this.params])
    .subscribe(([filters, params]) => {
      // Fetch products with the latest filters and sort
      this.fetchProducts(filters, params);
    });
    // this.productService.filterParams.subscribe(filters=>{
    //   this.fetchProducts(filters);
    
    // })
  }

  fetchProducts(filters:any, params:any){

    this.productService.getProductsFilter(filters, params).subscribe((data:any[])=>{

      const products: Product[] = data.map(item => ({
        id: item.id,
        title: item.name,
        description: item.description,
        type: item.type,
        brand: item.brand,
        collection: item.collection, // Assuming collection is already in the right format
        category: item.category,
        price: item.price,
        sale: item.sale,
        discount: item.discount,
        stock: item.stock,
        new: item.new,
        quantity: item.quantity,
        tags: item.tags, // Assuming tags are already in the right format
        images: this.setProductImages(item)
    
    }));
      this.products=products;
  })
  }

  private setProductImages (product:any):Images[]{
    let images:Images[]=[];
    for (let i=1; i<=6; i++){
      let img: Images={
      src:`${environment.publicS3Url}/product/${product[`image${i}FileIdentifier`]}`
      }
      images.push(img);
    }

    return images;
  }

  // Append filter value to Url
  updateFilter(tags: any) {
    tags.page = null; // Reset Pagination
    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: tags,
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // SortBy Filter
  sortByFilter(value) {
    
    const sortParams= {
      sortActive: (value === 'a-z' || value ==='z-a')? 'name': 'price',
      sortDirection: (value === 'a-z' || value==='low')? 'asc': 'dsc'
    }
    this.params.next(sortParams);
  }

  // Remove Tag
  removeTag(tag) {
  
    this.brands = this.brands.filter(val => val !== tag);
    this.colors = this.colors.filter(val => val !== tag);
    this.size = this.size.filter(val => val !== tag );

    let params = { 
      brand: this.brands.length ? this.brands.join(",") : null, 
      color: this.colors.length ? this.colors.join(",") : null, 
      size: this.size.length ? this.size.join(",") : null
    }

    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // Clear Tags
  removeAllTags() {
    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: {},
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // product Pagination
  setPage(page: number) {
    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // Change Grid Layout
  updateGridLayout(value: string) {
    this.grid = value;
  }

  // Change Layout View
  updateLayoutView(value: string) {
    this.layoutView = value;
    if(value == 'list-view')
      this.grid = 'col-lg-12';
    else
      this.grid = 'col-xl-3 col-md-6';
  }

  // Mobile sidebar
  toggleMobileSidebar() {
    this.mobileSidebar = !this.mobileSidebar;
  }

}
