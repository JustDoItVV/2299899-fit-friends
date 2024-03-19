import 'multer';

import {
    AllowedCertificateFormat, AllowedImageFormat, ApiUserMessage, AVATAR_SIZE_LIMIT,
    UserErrorMessage
} from '@2299899-fit-friends/consts';
import {
    FilesValidationPipe, JwtAuthGuard, JwtRefreshGuard, OnlyAnonymousGuard, Token,
    UserDataTrasformationPipe, UserParam, UserRolesGuard
} from '@2299899-fit-friends/core';
import {
    CreateUserDto, LoggedUserRdo, LoginUserDto, PaginationRdo, UpdateUserDto, UserPaginationQuery,
    UserRdo
} from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { TokenPayload, UserFilesPayload, UserRole } from '@2299899-fit-friends/types';
import {
    Body, Controller, Delete, Get, Header, HttpCode, HttpStatus, Param, Patch, Post, Query,
    UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, description: ApiUserMessage.Catalog, type: PaginationRdo<UserRdo> })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: ApiUserMessage.Unauthorized })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: ApiUserMessage.ValidationError })
  @Get('/')
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
  @UseGuards(JwtAuthGuard, new UserRolesGuard([UserRole.User]))
  public async show(@Query() query: UserPaginationQuery) {
    const result = await this.userService.getUsersByQuery(query);
    return fillDto(PaginationRdo<UserRdo>, result);
  }

  @ApiResponse({ status: HttpStatus.CREATED, description: ApiUserMessage.Authorized, type: LoggedUserRdo })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: ApiUserMessage.NotFound })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: ApiUserMessage.LoginWrong })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: ApiUserMessage.PasswordWrong })
  @Post('login')
  @UseGuards(OnlyAnonymousGuard)
  public async login(@Body() dto: LoginUserDto) {
    const userEntity = await this.userService.verifyUser(dto);
    const userToken = await this.userService.createUserToken(userEntity);
    return fillDto(LoggedUserRdo, { ...userEntity.toPOJO(), ...userToken });
  }

  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.CREATED, description: ApiUserMessage.Authorized, type: LoggedUserRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: ApiUserMessage.Unauthorized })
  @Post('check')
  @UseGuards(JwtAuthGuard)
  public async checkToken(@UserParam() payload: TokenPayload) {
    return fillDto(LoggedUserRdo, { ...payload, id: payload.userId });
  }

  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.CREATED, description: ApiUserMessage.TokenNew, type: LoggedUserRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: ApiUserMessage.Unauthorized })
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  public async refreshToken(@UserParam() user: UserEntity) {
    const tokenPayload = await this.userService.createUserToken(user);
    return fillDto(LoggedUserRdo, { ...user.toPOJO(), ...tokenPayload });
  }

  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: ApiUserMessage.TokenRevoked })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: ApiUserMessage.Unauthorized })
  @HttpCode(204)
  @Delete('refresh')
  @UseGuards(JwtRefreshGuard)
  public async destroyRefreshToken(@Token() token: string) {
    await this.userService.deleteRefreshToken(token);
  }

  @Post('register')
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: HttpStatus.CREATED , description: ApiUserMessage.Registered, type: UserRdo })
  @ApiResponse({ status: HttpStatus.CONFLICT , description: ApiUserMessage.EmailExists })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST , description: ApiUserMessage.ValidationError })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'avatar', maxCount: 1 },
    { name: 'pageBackground', maxCount: 1 },
    { name: 'certificate', maxCount: 1 },
  ]))
  @UseGuards(OnlyAnonymousGuard)
  public async create(
    @Body(new UserDataTrasformationPipe()) dto: CreateUserDto,
    @UploadedFiles(new FilesValidationPipe({
      avatar: { size: AVATAR_SIZE_LIMIT, formats: AllowedImageFormat },
      pageBackground: { formats: AllowedImageFormat },
      certificate: { formats: AllowedCertificateFormat },
    }, UserErrorMessage.ImageFormatForbidden))
    files: UserFilesPayload
  ) {
    const newUser = await this.userService.register(dto, files);
    return fillDto(UserRdo, newUser.toPOJO());
  }

  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK , description: ApiUserMessage.Card, type: UserRdo })
  @ApiResponse({ status: HttpStatus.NOT_FOUND , description: ApiUserMessage.NotFound })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED , description: ApiUserMessage.Unauthorized })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getUser(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);
    return fillDto(UserRdo, user.toPOJO());
  }

  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.CREATED , description: ApiUserMessage.Card, type: UserRdo })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: ApiUserMessage.ValidationError })
  @ApiResponse({ status: HttpStatus.NOT_FOUND , description: ApiUserMessage.NotFound })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED , description: ApiUserMessage.Unauthorized })
  @Patch(':id')
  @ApiConsumes('multipart/form-data', 'application/json')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'avatar', maxCount: 1 },
    { name: 'pageBackground', maxCount: 1 },
    { name: 'certificate', maxCount: 1 },
  ]))
  @UseGuards(JwtAuthGuard)
  public async updateUser(
    @Param('id') id: string,
    @Body(new UserDataTrasformationPipe()) dto: UpdateUserDto,
    @UserParam() payload: TokenPayload,
    @UploadedFiles(new FilesValidationPipe({
      avatar: { size: AVATAR_SIZE_LIMIT, formats: AllowedImageFormat },
      pageBackground: { formats: AllowedImageFormat },
      certificate: { formats: AllowedCertificateFormat },
    }, UserErrorMessage.ImageFormatForbidden))
    files: UserFilesPayload
  ) {
    const updatedUser = await this.userService.update(payload, id, dto, files);
    return fillDto(UserRdo, updatedUser.toPOJO());
  }

  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK , description: ApiUserMessage.FileImageUrl })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: ApiUserMessage.Unauthorized })
  @ApiResponse({ status: HttpStatus.NOT_FOUND , description: ApiUserMessage.UserOrFileNotFound })
  @Get(':id/avatar')
  @UseGuards(JwtAuthGuard)
  public async getAvatar(@Param('id') id: string) {
    return await this.userService.getAvatar(id);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK , description: ApiUserMessage.FileImageUrl })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: ApiUserMessage.Unauthorized })
  @ApiResponse({ status: HttpStatus.NOT_FOUND , description: ApiUserMessage.UserOrFileNotFound })
  @Get(':id/page-background')
  @UseGuards(JwtAuthGuard)
  public async getPageBackground(@Param('id') id: string) {
    return await this.userService.getPageBackground(id);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK , description: ApiUserMessage.FileCertificate })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: ApiUserMessage.Unauthorized })
  @ApiResponse({ status: HttpStatus.NOT_FOUND , description: ApiUserMessage.UserOrFileNotFound })
  @Get(':id/certificates')
  @Header('Content-disposition', 'attachment; filename=certificate.pdf')
  @UseGuards(JwtAuthGuard)
  public async getCertificate(@Param('id') id: string) {
    return await this.userService.getCertificate(id);
  }
}
