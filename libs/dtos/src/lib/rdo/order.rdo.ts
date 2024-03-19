import { Expose } from 'class-transformer';

import { OrderPaymentMethod, OrderType } from '@2299899-fit-friends/types';

import { TrainingRdo } from './training.rdo';

export class OrderRdo {
  @Expose()
  public id?: string;

  @Expose()
  public type: OrderType;

  @Expose()
  public trainingId: string;

  @Expose()
  public price: number;

  @Expose()
  public amount: number;

  @Expose()
  public orderSum: number;

  @Expose()
  public paymentMethod: OrderPaymentMethod;

  @Expose()
  public training: TrainingRdo;
}
