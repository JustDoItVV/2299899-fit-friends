import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { UserErrorMessage } from '@2299899-fit-friends/consts';

export class LoginUserDto {
  @IsEmail({}, { message: UserErrorMessage.EmailNotValid })
  @IsNotEmpty({ message: UserErrorMessage.EmailRequired })
  public email: string;

  @IsString({ message: UserErrorMessage.NotString })
  @IsNotEmpty({ message: UserErrorMessage.PasswordRequired })
  public password: string;
}
