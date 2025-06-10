import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../shared/classes/product';
import { ProductService } from '../shared/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  
  public themeLogo: string = 'assets/images/icon/logo-10.png'; // Change Logo

  public products: Product[] = [];
  public productCollections: any[] = [];
  public active;
  public categories: any;
  constructor(public productService: ProductService, private router: Router) {

    this.productService.getRandomProducts().subscribe((data:Product[])=>{
      this.productCollections = data;
    })

  }

  //Collection banner
  public collections = [ {
          image: 'assets/images/collection/electronics/most-selled.jpg',
          save: '10% off',
          title: 'Best Selled'
        },
        {
          image: 'assets/images/collection/electronics/new-arrivals.jpg', 
          save: '',
          title: 'New Arrivals'
        },
        {
          image: 'assets/images/collection/electronics/best-deal.jpg',
          save: '10% off',
          title: 'best deal'
        }
      ];
    
  ngOnInit(): void {
    this.productService.getProducts;
    // Change color for this layout
    document.documentElement.style.setProperty('--theme-deafult', '#ff4c3b');
  }

  ngOnDestroy(): void {
    // Remove Color
    document.documentElement.style.removeProperty('--theme-deafult');
  }

  // Product Tab collection
  getCollectionProducts(collection) {
    // return this.products.filter((item) => {
    //   // if (item.collection.find(i => i === collection)) {
    //   //   return item
    //   }
    // })
    return '';
  }

  navigateToShop(collection: any): void {
    this.router.navigate(['/shop'], { state: { title: collection.title } });
  }
}
