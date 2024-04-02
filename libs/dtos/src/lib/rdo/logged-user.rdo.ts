import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class LoggedUserRdo {
  @ApiProperty({ description: 'Идентификатор пользователя' })
  @Expose()
  public id: string;

  @ApiProperty({ description: 'Имя пользователя' })
  @Expose()
  public name: string;

  @ApiProperty({ description: 'Уникальный email пользователя' })
  @Expose()
  public email: string;

  @ApiProperty({ description: 'Роль пользователя' })
  @Expose()
  public role: string;

  @ApiProperty({ description: 'Access token' })
  @Expose()
  public accessToken: string;

  @ApiProperty({ description: 'Refresh token' })
  @Expose()
  public refreshToken: string;
}
