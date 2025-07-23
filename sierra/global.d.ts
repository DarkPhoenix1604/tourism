declare var Razorpay: any;
interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    prefill: {
      email: string;
    };
    handler: (response: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }) => void;
    theme: {
      color: string;
    };
  }
  
  interface RazorpayInstance {
    open: () => void;
  }
  
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
  