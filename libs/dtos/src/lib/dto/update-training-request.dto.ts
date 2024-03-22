import { IsEnum } from 'class-validator';

import { TrainingRequestStatus } from '@2299899-fit-friends/types';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTrainingRequestDto {
  @ApiProperty({ description: 'Новый статус заявки' })
  @IsEnum(TrainingRequestStatus)
  public status: string;
}
