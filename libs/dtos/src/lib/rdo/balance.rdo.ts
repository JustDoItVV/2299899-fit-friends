import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class BalanceRdo {
  @ApiProperty({ description: 'Идентификатор записи баланса' })
  @Expose()
  public id?: string;

  @ApiProperty({ description: 'Идентификатор пользователя' })
  @Expose()
  public userId: string;

  @ApiProperty({ description: 'Идентификатор тренировки' })
  @Expose()
  public trainingId: string;

  @ApiProperty({ description: 'Количество доступных тренировок на балансе' })
  @Expose()
  public available: number;

  @ApiProperty({ description: 'Время обновления записи баланса' })
  @Expose()
  public updatedAt?: Date;

  @ApiProperty({ description: 'Время создания записи баланса' })
  @Expose()
  public createdAt?: Date;
}
