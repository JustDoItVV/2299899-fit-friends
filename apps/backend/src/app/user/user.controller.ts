import 'multer';

import { AllowedImageFormat, UserErrorMessage } from '@2299899-fit-friends/consts';
import {
    FileFormatValidationPipe, JwtAuthGuard, JwtRefreshGuard, OnlyAnonymousGuard, Token,
    UserDataTrasformationPipe, UserParam
} from '@2299899-fit-friends/core';
import {
    CreateUserDto, LoggedUserRdo, LoginUserDto, UpdateUserDto, UserRdo
} from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { TokenPayload } from '@2299899-fit-friends/types';
import {
    Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseGuards, UseInterceptors
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @UseGuards(OnlyAnonymousGuard)
  public async login(@Body() dto: LoginUserDto) {
    const userEntity = await this.userService.verifyUser(dto);
    const userToken = await this.userService.createUserToken(userEntity);
    return fillDto(LoggedUserRdo, { ...userEntity.toPOJO(), ...userToken });
  }

  @Post('check')
  @UseGuards(JwtAuthGuard)
  public async checkToken(@UserParam() payload: TokenPayload) {
    return fillDto(LoggedUserRdo, { ...payload, id: payload.userId });
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  public async refreshToken(@UserParam() user: UserEntity) {
    const tokenPayload = await this.userService.createUserToken(user);
    return fillDto(LoggedUserRdo, { ...user.toPOJO(), ...tokenPayload });
  }

  @Delete('refresh')
  @UseGuards(JwtRefreshGuard)
  public async destroyRefreshToken(@Token() token: string) {
    await this.userService.deleteRefreshToken(token);
  }

  @Post('register')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'avatar', maxCount: 1 },
    { name: 'pageBackground', maxCount: 1 },
  ]))
  @UseGuards(OnlyAnonymousGuard)
  public async create(
    @Body(new UserDataTrasformationPipe()) dto: CreateUserDto,
    @UploadedFiles(new FileFormatValidationPipe(AllowedImageFormat, UserErrorMessage.ImageFormatForbidden))
    files: { avatar?: Express.Multer.File[], pageBackground: Express.Multer.File[] }
  ) {
    const newUser = await this.userService.register(dto, files);
    return fillDto(UserRdo, newUser.toPOJO());
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getUser(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);
    return fillDto(UserRdo, user.toPOJO());
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  public async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto, @UserParam() payload: TokenPayload) {
    const updatedUser = await this.userService.update(payload, id, dto);
    return fillDto(UserRdo, updatedUser.toPOJO());
  }

  @Get(':id/avatar')
  @UseGuards(JwtAuthGuard)
  public async getUserAvatar(@Param('id') id: string) {
    return await this.userService.getUserAvatar(id);
  }

  @Get(':id/page-background')
  @UseGuards(JwtAuthGuard)
  public async getUserpageBackground(@Param('id') id: string) {
    return await this.userService.getUserPageBackground(id);
  }
}
