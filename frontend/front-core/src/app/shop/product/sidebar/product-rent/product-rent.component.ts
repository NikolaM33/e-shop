import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailsMainSlider, ProductDetailsThumbSlider } from '../../../../shared/data/slider';
import { Images, Product } from '../../../../shared/classes/product';
import { ProductService } from '../../../../shared/services/product.service';
import { SizeModalComponent } from "../../../../shared/components/modal/size-modal/size-modal.component";
import { environment } from 'src/environments/environment';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-product-rent',
  templateUrl: './product-rent.component.html',
  styleUrls: ['./product-rent.component.scss']
})
export class ProductRentComponent implements OnInit {

  public product: Product;
  public counter: number = 1;
  public activeSlide: any = 0;
  public selectedSize: any;
  public mobileSidebar: boolean = false;
  public active = 1;
  public rentForm: UntypedFormGroup;
  public selectedColor:any;

  public productId:string;
  @ViewChild("sizeChart") SizeChart: SizeModalComponent;
  public productSpecfications: { key: string; value: string }[];
  public ProductDetailsMainSliderConfig: any = ProductDetailsMainSlider;
  public ProductDetailsThumbConfig: any = ProductDetailsThumbSlider;
  formatter = inject(NgbDateParserFormatter);
  private _currentDate: NgbDateStruct;


  constructor(private route: ActivatedRoute, private router: Router, fb: FormBuilder,
    public productService: ProductService) {
    this.route.paramMap.subscribe(params =>  this.productId = params.get('slug'));
    const today = new Date();
    this._currentDate = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,  // Months are 0-based in JavaScript, so we add 1
    day: today.getDate()
  };
    this.rentForm = fb.group({
      startDate: [this._currentDate, Validators.required],
      duration: [1,[Validators.min(0.5), Validators.max(100),Validators.required]]
    })
  
    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params=>
      {this.productId = params.get('slug');
        this.fetchData();
      }
    )

  }

  fetchData (){
    this.productService.getProductById(this.productId).subscribe((data:any)=>{
      this.product=data;
    });
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
    product.rentStartDate =this.rentForm.get("startDate").value;
    product.rentDuration = this.rentForm.get("duration").value;
    product.rent  = true;
    this.selectedSize? product.sizes = [this.selectedSize]: null;
    this.selectedColor? this.product.colors = [this.selectedColor] : null;
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


