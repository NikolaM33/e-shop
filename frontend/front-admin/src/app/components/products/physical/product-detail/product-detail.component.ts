import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Image } from '@ks89/angular-modal-gallery';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../product.service';

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

  public imagesRect: Image[] = [
    new Image(0, { img: 'assets/images/pro3/2.jpg' }, { img: 'assets/images/pro3/1.jpg' }),
    new Image(1, { img: 'assets/images/pro3/27.jpg' }, { img: 'assets/images/pro3/27.jpg' }),
    new Image(2, { img: 'assets/images/pro3/1.jpg' }, { img: 'assets/images/pro3/1.jpg' }),
    new Image(3, { img: 'assets/images/pro3/2.jpg' }, { img: 'assets/images/pro3/2.jpg' })]

  constructor(private modalService: NgbModal, config: NgbRatingConfig,
    private activeRoute: ActivatedRoute, private productService: ProductService) {
    config.max = 5;
    config.readonly = false;
      activeRoute.params.subscribe((data)=>{
      this.productId=data.id;
    })
    this.productService.getProduct(this.productId).subscribe((data)=>{
      this.product=data;
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
