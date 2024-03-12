import { LoginUserDto } from '@2299899-fit-friends/dtos';
import { Body, Controller, Post } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  public async login(@Body() dto: LoginUserDto) {
    const userEntity = await this.userService.verifyUser(dto);
    return userEntity.toPOJO();
  }
}
