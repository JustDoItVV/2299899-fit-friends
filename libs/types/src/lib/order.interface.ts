import { OrderPaymentMethod } from './order-payment-method.enum';
import { OrderType } from './order-type.enum';
import { Training } from './training.interface';

export interface Order {
  id?: string;
  type: OrderType;
  training: Training;
  price: number;
  amount: number;
  paymentMethod: OrderPaymentMethod;
}
