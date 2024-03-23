import { IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateTrainingRequestDto {
  @ApiProperty({ description: 'Идентификатор пользователя, для которого создается запрос на тренировку' })
  @IsUUID()
  public targetId: string;
}
