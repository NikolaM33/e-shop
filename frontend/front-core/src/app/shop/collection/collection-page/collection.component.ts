import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ProductService } from "../../../shared/services/product.service";
import { Product, Images } from '../../../shared/classes/product';
import { environment } from 'src/environments/environment';
import { FilterParams } from '../../product/domain/FillterParams';
import { BehaviorSubject, combineLatest, filter } from 'rxjs';
import { SharedModule } from "../../../shared/shared.module";

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
})
export class CollectionComponent implements OnInit {
  
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
       
        this.category =params.category
        this.productService.updateCategoryFilter(this.category)
        
      })
  }

  ngOnInit(): void {
    combineLatest([this.filterParams, this.params])
    .subscribe(([filters, params]) => {
      // Fetch products with the latest filters and sort
      this.fetchProducts(filters, params);
    });
    
  }

  fetchProducts(filters:any, params:any){
    //remove udnefined filters
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined)
    );    params ={...params,
      type: 'SALE'
    }
    this.productService.getProductsFilter(cleanedFilters, params).subscribe((data:any[])=>{
      this.products=data;
  })
  }



  // SortBy Filter
  sortByFilter(value) {
    
    const sortParams= {
      sortActive: (value === 'a-z' || value ==='z-a')? 'name': 'price',
      sortDirection: (value === 'a-z' || value==='low')? 'asc': 'dsc'
    }
    this.params.next(sortParams);
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
