import { Expose } from 'class-transformer';

import { OrderPaymentMethod, OrderType } from '@2299899-fit-friends/types';
import { ApiProperty } from '@nestjs/swagger';

import { TrainingRdo } from './training.rdo';

export class OrderRdo {
  @ApiProperty({ description: 'Идентификатор заказа' })
  @Expose()
  public id?: string;

  @ApiProperty({ description: 'Тип приобретаемой услуги', enum: OrderType })
  @Expose()
  public type: OrderType;

  @ApiProperty({ description: 'Идентификатор тренировки' })
  @Expose()
  public trainingId: string;

  @ApiProperty({ description: 'Цена тренировки' })
  @Expose()
  public price: number;

  @ApiProperty({ description: 'Количество совершенных заказов' })
  @Expose()
  public amount: number;

  @ApiProperty({ description: 'Общая сумма заказов' })
  @Expose()
  public orderSum: number;

  @ApiProperty({ description: 'Метод оплаты', enum: OrderPaymentMethod })
  @Expose()
  public paymentMethod: OrderPaymentMethod;

  @ApiProperty({ description: 'Информация о тренировке' })
  @Expose()
  public training: TrainingRdo;
}
