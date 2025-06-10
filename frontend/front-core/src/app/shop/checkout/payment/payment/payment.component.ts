import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { loadStripe } from '@stripe/stripe-js';
import { Order } from 'src/app/shared/classes/order';
import { ProductService } from 'src/app/shared/services/product.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  stripe: any;
  elements: any;
  card: any;
  isProcessing: boolean = false;


  @Input() orderDetails: Order;

  @Input() totalAmount: number;

  constructor(public activeModal: NgbActiveModal, public productService: ProductService) { }

  async ngOnInit() {
    this.stripe = await loadStripe(environment.stripe_token);
    this.elements = this.stripe.elements();
   

    this.elements = this.stripe.elements();

    this.card = this.elements.create('card',{
      hidePostalCode: true,
    });
    this.card.mount('#card-element');
  }

  async onSubmit() {


    this.productService.createPaymentIntent(this.orderDetails,
    ).subscribe(
      async (response) => {
        const { clientSecret } = response;

        const { error, paymentIntent } = await this.stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: { card: this.card }
          }
        );

        if (error) {
          alert(error.message);
          this.isProcessing = false;
        } else {
          if (paymentIntent.status === 'succeeded') {
            this.orderDetails.paymentId = paymentIntent.id;
            this.orderDetails.paymentStatus = paymentIntent.status;
            this.orderDetails.paymentMethod = "CARD";
            this.productService.createOrder(this.orderDetails).subscribe((data: any) => {
              this.activeModal.close({ orderId: data.id });
            })
          } else {
            alert(`Payment status: ${paymentIntent.status}`);
            this.isProcessing = false;
          }
        }
      },
      // ... (rest of error handling)
    );
  }
  closeModal() {
    this.activeModal.close();
  }
}
