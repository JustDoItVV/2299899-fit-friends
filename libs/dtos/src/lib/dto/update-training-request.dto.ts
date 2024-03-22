import { IsEnum, IsUUID } from 'class-validator';

import { TrainingRequestStatus } from '@2299899-fit-friends/types';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTrainingRequestDto {
  @ApiProperty({ description: 'Идентификатор пользователя, для которого предназначен запрос на тренировку' })
  @IsUUID()
  public targetId: string;

  @IsEnum(TrainingRequestStatus)
  public status: string;
}
