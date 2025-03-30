export interface OrderProduct {
    productId: string;
    quantity?: number;
    size?: string;
    color?: string;
    price?: number;
    name?: string;
    brand?: string;
    discount: boolean;
    discountPercent?: number;
    rentDateStart?: Date,
    rentDurationDays?: number
  }
  
  export interface Order {
    userId: string;
    customerFirstName: string;
    customerLastName: string;
    customerPhone: string;
    customerEmail: string;
    type: string;
    shippingAddress: string;
    shippingCounty: string;
    shippingState: string;
    shippingTown: string;
    shippingPostalCode: string;
    paymentMethod: string;
    paymentStatus: string;
    paymentId: string;
    amount: number;
    products: OrderProduct[];
  }
  