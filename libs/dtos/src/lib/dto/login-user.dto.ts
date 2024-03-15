import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { UserErrorMessage } from '@2299899-fit-friends/consts';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ description: 'Уникальный email', example: 'email@local.local' })
  @IsEmail({}, { message: UserErrorMessage.EmailNotValid })
  @IsNotEmpty({ message: UserErrorMessage.EmailRequired })
  public email: string;

  @ApiProperty({ description: 'Пароль', example: '123456' })
  @IsString({ message: UserErrorMessage.NotString })
  @IsNotEmpty({ message: UserErrorMessage.PasswordRequired })
  public password: string;
}
