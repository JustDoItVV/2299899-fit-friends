import { AnonymousValidationPipe, UserParam } from '@2299899-fit-friends/core';
import { LoggedUserRdo, LoginUserDto } from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { TokenPayload } from '@2299899-fit-friends/types';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @UseGuards(AuthGuard(['jwt', 'anonymous']))
  public async login(
    @UserParam(new AnonymousValidationPipe()) _user: TokenPayload,
    @Body() dto: LoginUserDto
  ) {
    const userEntity = await this.userService.verifyUser(dto);
    const userToken = await this.userService.createUserToken(userEntity);
    return fillDto(LoggedUserRdo, { ...userEntity.toPOJO(), ...userToken });
  }
}
