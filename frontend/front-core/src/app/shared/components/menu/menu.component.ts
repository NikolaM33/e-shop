import { Component, OnInit } from '@angular/core';
import { NavService, Menu } from '../../services/nav.service';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public menuItems: Menu[];
  public categories: any;

  constructor(private router: Router, public navServices: NavService, private productService: ProductService) {
    this.navServices.items.subscribe(menuItems => this.menuItems = menuItems );
    this.router.events.subscribe((event) => {
      this.navServices.mainMenuToggle = false;
    });
  }

  ngOnInit(): void {
    this.productService.getCategories().subscribe(data=>{
      this.categories = data;
      this.addCategoryToManu(this.categories);

   })
  }

  mainMenuToggle(): void {
    this.navServices.mainMenuToggle = !this.navServices.mainMenuToggle;
  }

  // Click Toggle menu (Mobile)
  toggletNavActive(item) {
    item.active = !item.active;
  }

  addCategoryToManu (categories: any){
    const menuCategory: Menu[] =[];

    categories.forEach(element => {
      let item:Menu = {path: `/shop`, queryParams: {category: element.id}, title: element.name, type: 'link'}
      menuCategory.push(item)
    });
    this.menuItems.at(1).children = menuCategory;
    this.navServices.items.next(this.menuItems)
  }
}
