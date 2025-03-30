import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
// import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { environment } from '../../../environments/environment';
import { Product } from "../../shared/classes/product";
import { ProductService } from "../../shared/services/product.service";
import { OrderService } from "../../shared/services/order.service";
import { Appearance, loadStripe, StripeElement, StripeElements, StripeElementsOptions } from '@stripe/stripe-js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentComponent } from './payment/payment/payment.component';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/pages/account/account.service';
import { Order, OrderProduct } from 'src/app/shared/classes/order';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  public checkoutForm:  UntypedFormGroup;
  public products: Product[] = [];
  // public payPalConfig ? : IPayPalConfig;
  public payment: string = 'Stripe';
  public amount:  any;

  stripe: any;
  elements: any;
  card: any;
  userId: any;

  constructor(private fb: UntypedFormBuilder, private router:Router, private accountService: AccountService,
    public productService: ProductService, private modalService: NgbModal,
    private orderService: OrderService) { 
    this.checkoutForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      lastname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.maxLength(50)]],
      country: ['', Validators.required],
      town: ['', Validators.required],
      state: ['', Validators.required],
      postalcode: ['', Validators.required],
      shipping: ['SHIPPING', Validators.required]
    })
  }

 async ngOnInit() {
  this.accountService.currentUser.subscribe(user => {
    this.userId = user?.id;
  });

    this.productService.cartItems.subscribe(response => this.products = response);
    this.getTotal.subscribe(amount => this.amount = amount);
    this.initConfig();
 this.initializeStripe();
    
  }

  async initializeStripe() {
    this.stripe = await loadStripe(environment.stripe_token); // Replace with your public key

    const elements = this.stripe.elements({
      appearance: {
        theme: 'night',
        variables: {
          colorBackground: 'red'
        }
      }
    });
    this.card = elements.create('card');
    // this.card.mount('#card-element');
  }

  async handlePayment() {
    // const stripe = await this.stripePromise;
  }

  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }


  // Stripe Payment Gateway
  stripeCheckout() {
    var handler = (<any>window).StripeCheckout.configure({
      key: environment.stripe_token, // publishble key
      locale: 'auto',
      token: (token: any) => {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
        this.orderService.createOrder(this.products, this.checkoutForm.value, token.id, this.amount);
      }
    });
    handler.open({
      name: 'Multikart',
      description: 'Online Fashion Store',
      amount: this.amount * 100
    }) 
  }

  // Paypal Payment Gateway
  private initConfig(): void {
   
  }

 
  openPaymentDialog() {

    const order = this.generateOrderFromFormData(this.checkoutForm.value, this.products, this.amount)
    const modalRef = this.modalService.open(PaymentComponent);
    modalRef.componentInstance.totalAmount = this.amount;
    modalRef.componentInstance.orderDetails = order;
    
    modalRef.result.then((result) => {
      if (result?.orderId) {
        this.productService.clearCart();
        this.router.navigateByUrl('/shop/checkout/success/'+result?.orderId);
      } else {
        // Handle the case where payment is canceled or failed
        alert('Payment was not completed.');
      }
    });
  }

   generateOrderFromFormData(formData: any, products: Product[], totalAmount: number): Order {
    // Convert FormData into an object
      const orderProducts: OrderProduct[] = products.map(product => ({
        productId: product.id, 
        quantity: product.quantity, 
        size: product.sizes && product.sizes.length > 0 ? product.sizes[0].size : undefined, // If sizes exist, take the first size
        color: product.colors && product.colors.length > 0 ? product.colors[0].color : undefined, // If colors exist, take the first color
        price: product.price,
        name: product.title,
        brand: product.brand,
        discount: product.discount ? true : false, // If there's a discount, it's true, otherwise false
        discountPercent: product.discount || undefined, // Discount percent is optional
        rentDateStart: new Date(product.rentStartDate?.year, product.rentStartDate?.month - 1, product.rentStartDate?.day),
        rentDurationDays: product.rentDuration
      }));
      
      const order: Order = {
      userId: this.userId,
      customerFirstName: formData.firstname,
      customerLastName: formData.lastname,
      customerPhone: formData.phone,
      customerEmail: formData.email,
      type: formData.shipping,
      shippingAddress: formData.address,
      shippingCounty: formData.country,
      shippingState: formData.state,
      shippingTown: formData.town,
      shippingPostalCode: formData.postalcode,
      paymentMethod: 'CARD',
      paymentStatus: formData.paymentStatus,
      paymentId: formData.paymentId,
      amount: totalAmount, 
      products: orderProducts
    };
  
    return order;
  }
}
