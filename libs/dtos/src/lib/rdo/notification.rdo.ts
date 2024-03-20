import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class NotificationRdo {
  @ApiProperty({ description: 'Идентификатор уведомления' })
  @Expose()
  public id?: string;

  @ApiProperty({ description: 'Запланированная дата отправки' })
  @Expose()
  public sentDate: Date;

  @ApiProperty({ description: 'Идентификатор пользователя, для которого предназначено уведомление' })
  @Expose()
  public userId: string;

  @ApiProperty({ description: 'Текст уведомления' })
  @Expose()
  public text: string;

  @ApiProperty({ description: 'Дата создания уведомления' })
  @Expose()
  public createdAt?: Date;
}
