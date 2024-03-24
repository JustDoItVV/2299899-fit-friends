import { OrderPaymentMethod } from './order-payment-method.enum';
import { OrderType } from './order-type.enum';

export interface Order {
  id?: string;
  type: OrderType;
  trainingId: string;
  price: number;
  amount: number;
  orderSum: number;
  paymentMethod: OrderPaymentMethod;
}
