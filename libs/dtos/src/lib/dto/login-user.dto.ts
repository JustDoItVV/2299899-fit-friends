import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { UserErrorMessage } from '@2299899-fit-friends/consts';
import { getDtoMessageCallback } from '@2299899-fit-friends/helpers';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ description: 'Уникальный email', example: 'email@local.local' })
  @IsEmail({}, { message: getDtoMessageCallback(UserErrorMessage.EmailNotValid) })
  @IsNotEmpty({ message: getDtoMessageCallback(UserErrorMessage.Required) })
  public email: string;

  @ApiProperty({ description: 'Пароль', example: '123456' })
  @IsString({ message: getDtoMessageCallback(UserErrorMessage.NotString) })
  @IsNotEmpty({ message: getDtoMessageCallback(UserErrorMessage.Required) })
  public password: string;
}
