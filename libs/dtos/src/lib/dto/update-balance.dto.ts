import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

import { BALANCE_AVAILABLE_MIN, BalanceErrorMessage } from '@2299899-fit-friends/consts';
import { getDtoMessageCallback } from '@2299899-fit-friends/helpers';
import { OrderPaymentMethod } from '@2299899-fit-friends/types';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBalanceDto {
  @ApiProperty({ description: 'Идентификатор тренировки' })
  @IsUUID()
  @IsNotEmpty({ message: getDtoMessageCallback(BalanceErrorMessage.Required) })
  public trainingId: string;

  @ApiProperty({ description: 'Количество доступных тренировок' })
  @Min(BALANCE_AVAILABLE_MIN, { message: getDtoMessageCallback(BalanceErrorMessage.AvailableMin) })
  @IsNumber({}, { message: getDtoMessageCallback(BalanceErrorMessage.Nan) })
  public available: number;

  @ApiProperty({ description: 'Метод оплаты для обновления списка заказов тренера' })
  @IsEnum(OrderPaymentMethod, { message: getDtoMessageCallback(BalanceErrorMessage.Enum, OrderPaymentMethod) })
  @IsOptional()
  public paymentMethod?: OrderPaymentMethod;
}
