import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../product.service';
import { ProductDetailsMainSlider, ProductDetailsThumbSlider } from '../slider';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  providers: [NgbRatingConfig]
})
export class ProductDetailComponent implements OnInit {
  public closeResult: string;
  public counter: number = 1;
  currentRate = 8;
  productId:string;
  product: any;
  active=1;
  public activeSlide: any = 0;


  public ProductDetailsMainSliderConfig: any = ProductDetailsMainSlider;
  public ProductDetailsThumbConfig: any = ProductDetailsThumbSlider;

  constructor(private modalService: NgbModal, config: NgbRatingConfig,
    private activeRoute: ActivatedRoute, public productService: ProductService) {
    config.max = 5;
    config.readonly = false;
      activeRoute.params.subscribe((data)=>{
      this.productId=data.id;
    })
    this.productService.getProduct(this.productId).subscribe((data)=>{
      this.product=data;
      console.log(this.product)
    })
  }


  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  increment() {
    this.counter += 1;
  }

  decrement() {
    this.counter -= 1;
  }

  ngOnInit() {
  }


}
