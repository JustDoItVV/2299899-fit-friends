import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

import { BALANCE_AVAILABLE_MIN } from '@2299899-fit-friends/consts';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBalanceDto {
  @ApiProperty({ description: 'Идентификатор тренировки' })
  @IsUUID()
  @IsNotEmpty({ message: 'Training id required' })
  public trainingId: string;

  @ApiProperty({ description: 'Количество доступных тренировок' })
  @Min(BALANCE_AVAILABLE_MIN)
  @IsNumber()
  public available: number;
}
