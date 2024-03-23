import { Expose } from 'class-transformer';

import { TrainingRequestStatus } from '@2299899-fit-friends/types';
import { ApiProperty } from '@nestjs/swagger';

export class TrainingRequestRdo {
  @ApiProperty({ description: 'Идентификатор заявки на тренировку' })
  @Expose()
  public id?: string;

  @ApiProperty({ description: 'Идентификатор автора заявки' })
  @Expose()
  public authorId: string;

  @ApiProperty({ description: 'Идентификатор пользователя, для кого предназанчена заявка' })
  @Expose()
  public targetId: string;

  @ApiProperty({ description: 'Статус заявки', enum: TrainingRequestStatus })
  @Expose()
  public status: TrainingRequestStatus;

  @ApiProperty({ description: 'Дата создания заявки' })
  @Expose()
  public createdAt?: Date;

  @ApiProperty({ description: 'Дата обновления статуса заявки' })
  @Expose()
  public updatedAt?: Date;
}
