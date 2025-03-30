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

  constructor(public activeModal: NgbActiveModal, public productService: ProductService) {}

  async ngOnInit() {
    this.stripe = await loadStripe(environment.stripe_token);  
    this.elements = this.stripe.elements();
    const appearance = {
      theme: 'stripe', // or 'flat', 'night', 'none'
      variables: {
        colorPrimary: '#6772e5', // Primary color
        colorBackground: '#ffffff', // Background color
        colorText: '#32325d', // Text color
        colorDanger: '#df1b41', // Error color
        fontFamily: 'Inter, sans-serif', // Custom font
        spacingUnit: '4px', // Spacing unit
        borderRadius: '4px', // Border radius
      },
      rules: {
        '.Input': {
          border: '1px solid #e0e0e0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '12px',
        },
        '.Input--invalid': {
          color: '#df1b41',
        },
      },
    };

    // Initialize Stripe Elements with appearance
    this.elements = this.stripe.elements({ appearance });

    this.card = this.elements.create('card');
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
                    payment_method: {card: this.card}
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
                  this.productService.createOrder(this.orderDetails).subscribe((data: any)=>{
                    this.activeModal.close({orderId: data.id});
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
