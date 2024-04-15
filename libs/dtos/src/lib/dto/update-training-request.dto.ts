import { IsEnum, IsOptional } from 'class-validator';

import { TrainingRequestErrorMessage } from '@2299899-fit-friends/consts';
import { getDtoMessageCallback } from '@2299899-fit-friends/helpers';
import { TrainingRequestStatus } from '@2299899-fit-friends/types';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTrainingRequestDto {
  @ApiProperty({ description: 'Новый статус заявки' })
  @IsEnum(TrainingRequestStatus, { message: getDtoMessageCallback(TrainingRequestErrorMessage.Enum, TrainingRequestStatus) })
  @IsOptional()
  public status: TrainingRequestStatus;
}
