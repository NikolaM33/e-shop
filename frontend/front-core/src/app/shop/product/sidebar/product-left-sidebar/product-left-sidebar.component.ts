import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailsMainSlider, ProductDetailsThumbSlider } from '../../../../shared/data/slider';
import { Images, Product } from '../../../../shared/classes/product';
import { ProductService } from '../../../../shared/services/product.service';
import { SizeModalComponent } from "../../../../shared/components/modal/size-modal/size-modal.component";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-left-sidebar',
  templateUrl: './product-left-sidebar.component.html',
  styleUrls: ['./product-left-sidebar.component.scss']
})
export class ProductLeftSidebarComponent implements OnInit {

  public product: Product;
  public counter: number = 1;
  public activeSlide: any = 0;
  public selectedSize: any;
  public mobileSidebar: boolean = false;
  public active = 1;
  public selectedColor: any;

  public productId:string;
  @ViewChild("sizeChart") SizeChart: SizeModalComponent;
  public productSpecfications: { key: string; value: string }[];
  public ProductDetailsMainSliderConfig: any = ProductDetailsMainSlider;
  public ProductDetailsThumbConfig: any = ProductDetailsThumbSlider;

  constructor(private route: ActivatedRoute, private router: Router,
    public productService: ProductService) {
    this.route.paramMap.subscribe(params =>  {this.productId = params.get('slug')
      this.fetchData();
    }
  );
    
  }

  ngOnInit(): void {
    // this.route.paramMap.subscribe(params=>
    //   {this.productId = params.get('slug');
        
    //   }
    // )

  }

  fetchData (){
    this.productService.getProductById(this.productId).subscribe((data:any)=>{
      this.product=data;
    });
  }

  // Get Product Color
  Color(variants) {
    const uniqColor = []
    // for (let i = 0; i < Object.keys(variants).length; i++) {
    //   if (uniqColor.indexOf(variants[i].color) === -1 && variants[i].color) {
    //     uniqColor.push(variants[i].color)
    //   }
    // }
    return uniqColor
  }

  // Get Product Size
  Size(variants) {
    const uniqSize = []
    // for (let i = 0; i < Object.keys(variants).length; i++) {
    //   if (uniqSize.indexOf(variants[i].size) === -1 && variants[i].size) {
    //     uniqSize.push(variants[i].size)
    //   }
    // }
    return uniqSize
  }

  selectSize(size) {
    this.selectedSize = size;
  }

  // Increament
  increment() {
    this.counter++;
  }

  // Decrement
  decrement() {
    if (this.counter > 1) this.counter--;
  }

  // Add to cart
  async addToCart(product: any) {
    product.quantity = this.counter || 1;
    product.sizes = [this.selectedSize];
    product.colors = [this.selectedColor]
    const status = await this.productService.addToCart(product);
    if (status)
      this.router.navigate(['/shop/cart']);
  }

  // Buy Now
  async buyNow(product: any) {
    product.quantity = this.counter || 1;
    const status = await this.productService.addToCart(product);
    if (status)
      this.router.navigate(['/shop/checkout']);
  }

  // Add to Wishlist
  addToWishlist(product: any) {
    this.productService.addToWishlist(product);
  }

  // Toggle Mobile Sidebar
  toggleMobileSidebar() {
    this.mobileSidebar = !this.mobileSidebar;
  }

  private setProductImages (product:any):Images[]{
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


  selectColor(color, index){
    this.activeSlide = index;
    this.selectedColor = color;
  }
}
