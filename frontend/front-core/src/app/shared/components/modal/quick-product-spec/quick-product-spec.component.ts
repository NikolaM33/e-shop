import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, PLATFORM_ID, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Product } from 'src/app/shared/classes/product';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-quick-product-spec',
  templateUrl: './quick-product-spec.component.html',
  styleUrls: ['./quick-product-spec.component.scss']
})
export class QuickProductSpecComponent {
  product: Product;
  @Input() source: string;
  @ViewChild("content", { static: false }) QuickSpecView: TemplateRef<any>;

  public closeResult: string;

  public modalOpen: boolean = false;
  public selectedSize: any;
  public selectedColor: any;
  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private router: Router, private modalService: NgbModal,
    public productService: ProductService) { }

  ngOnInit(): void {
  }

  openModal(product: Product) {
    this.modalOpen = true;
    this.product = product;
    if (isPlatformBrowser(this.platformId)) { // For SSR 
      this.modalService.open(this.QuickSpecView, {
        size: 'xs',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
        windowClass: 'Quickview'
      }).result.then((result) => {
        `Result ${result}`
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
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

  async addToCart(product: any) {
    product.quantity = 1;
    product.sizes = [this.selectedSize];
    product.colors = [this.selectedColor]
    const status = await this.productService.addToCart(product);
    if (status)
      if (this.source === 'whishlist') {
        this.productService.removeWishlistItem(product)
         this.router.navigate(['/shop/cart']);
      }
    this.modalService.dismissAll();

  }

  selectColor(color) {
    this.selectedColor = color;
  }

  selectSize(size) {
    this.selectedSize = size;
  }
}
