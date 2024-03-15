import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class LoggedUserRdo {
  @ApiProperty()
  @Expose()
  public id: string;

  @ApiProperty()
  @Expose()
  public name: string;

  @ApiProperty()
  @Expose()
  public email: string;

  @ApiProperty()
  @Expose()
  public accessToken: string;

  @ApiProperty()
  @Expose()
  public refreshToken: string;
}
