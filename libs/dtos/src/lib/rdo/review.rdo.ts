import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class ReviewRdo {
  @ApiProperty({ description: 'Идентификатор отзыва' })
  @Expose()
  public id: string;

  @ApiProperty({ description: 'Идентификатор автора отзыва' })
  @Expose()
  public userId: string;

  @ApiProperty({ description: 'Идентификатор тренировки' })
  @Expose()
  public trainingId: string;

  @ApiProperty({ description: 'Рейтинг' })
  @Expose()
  public rating: number;

  @ApiProperty({ description: 'Текст отзыва' })
  @Expose()
  public text: string;
}
