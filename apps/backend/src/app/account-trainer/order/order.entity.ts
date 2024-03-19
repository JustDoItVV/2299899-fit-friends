import { BaseEntity, Order, OrderPaymentMethod, OrderType } from '@2299899-fit-friends/types';

import { TrainingEntity } from '../../training/training.entity';

export class OrderEntity implements Order, BaseEntity<string, Order> {
  public id?: string | undefined;
  public type: OrderType;
  public trainingId: string;
  public price: number;
  public amount: number;
  public orderSum: number;
  public paymentMethod: OrderPaymentMethod;
  public training: TrainingEntity;

  public populate(data: Order): OrderEntity {
    this.id = data.id || undefined;
    this.type = data.type;
    this.trainingId = data.trainingId;
    this.price = data.price;
    this.amount = data.amount;
    this.paymentMethod = data.paymentMethod;
    this.orderSum = data.amount * data.price;

    return this;
  }

  public toPOJO(): Order {
    return {
      id: this.id,
      type: this.type,
      trainingId: this.trainingId,
      price: this.price,
      amount: this.amount,
      orderSum: this.orderSum,
      paymentMethod: this.paymentMethod,
    };
  }

  static fromObject(data: Order): OrderEntity {
    return new OrderEntity().populate(data);
  }
}
