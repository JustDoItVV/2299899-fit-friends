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
import {
    ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiConsumes, ApiCreatedResponse,
    ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation,
    ApiTags, ApiUnauthorizedResponse, ApiUnsupportedMediaTypeResponse
} from '@nestjs/swagger';

import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Каталог пользователей' })
  @ApiOkResponse({ description: ApiUserMessage.Catalog, type: PaginationRdo<UserRdo> })
  @ApiBadRequestResponse({ description: ApiUserMessage.ValidationError })
  @ApiForbiddenResponse({ description: `Запрещено кроме пользователя с ролью ${UserRole.User}` })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get('/')
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
  @UseGuards(JwtAuthGuard, new UserRolesGuard([UserRole.User]))
  public async show(@Query() query: UserPaginationQuery) {
    const result = await this.userService.getUsersByQuery(query);
    return fillDto(PaginationRdo<UserRdo>, result);
  }

  @ApiOperation({ summary: 'Вход в систему' })
  @ApiCreatedResponse({ description: ApiUserMessage.Authorized, type: LoggedUserRdo })
  @ApiBadRequestResponse({ description: ApiUserMessage.LoginWrong })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.PasswordWrong })
  @ApiNotFoundResponse({ description: ApiUserMessage.NotFound })
  @ApiForbiddenResponse({ description: 'Запрещено для авторизованных пользователей' })
  @Post('login')
  @UseGuards(OnlyAnonymousGuard)
  public async login(@Body() dto: LoginUserDto) {
    const userEntity = await this.userService.verifyUser(dto);
    const userToken = await this.userService.createUserToken(userEntity);
    return fillDto(LoggedUserRdo, { ...userEntity.toPOJO(), ...userToken });
  }

  @ApiOperation({ summary: 'Проверка токена' })
  @ApiCreatedResponse({ description: ApiUserMessage.Authorized, type: LoggedUserRdo })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Post('check')
  @UseGuards(JwtAuthGuard)
  public async checkToken(@UserParam() payload: TokenPayload) {
    return fillDto(LoggedUserRdo, { ...payload, id: payload.userId });
  }

  @ApiOperation({ summary: 'Получение новой пары токенов' })
  @ApiCreatedResponse({ description: ApiUserMessage.TokenNew, type: LoggedUserRdo })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  public async refreshToken(@UserParam() user: UserEntity) {
    const tokenPayload = await this.userService.createUserToken(user);
    return fillDto(LoggedUserRdo, { ...user.toPOJO(), ...tokenPayload });
  }

  @ApiOperation({ summary: 'Отзыв токена' })
  @ApiNoContentResponse({ description: ApiUserMessage.TokenRevoked })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('refresh')
  @UseGuards(JwtRefreshGuard)
  public async destroyRefreshToken(@Token() token: string) {
    await this.userService.deleteRefreshToken(token);
  }

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: ApiUserMessage.Registered, type: UserRdo })
  @ApiConflictResponse({ description: ApiUserMessage.EmailExists })
  @ApiBadRequestResponse({ description: ApiUserMessage.ValidationError })
  @ApiUnsupportedMediaTypeResponse({ description: 'неподдерживаемый тип файлов' })
  @ApiForbiddenResponse({ description: 'Запрещено для авторизованных пользователей' })
  @Post('register')
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

  @ApiOperation({ summary: 'Детальная информация о пользователе (Карточка пользователя)' })
  @ApiOkResponse({ description: ApiUserMessage.Card, type: UserRdo })
  @ApiNotFoundResponse({ description: ApiUserMessage.NotFound })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getUser(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);
    return fillDto(UserRdo, user.toPOJO());
  }

  @ApiOperation({ summary: 'Редактирование информации о пользователе' })
  @ApiCreatedResponse({ description: ApiUserMessage.Card, type: UserRdo })
  @ApiBadRequestResponse({ description: ApiUserMessage.ValidationError })
  @ApiNotFoundResponse({ description: ApiUserMessage.NotFound })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
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

  @ApiOperation({ summary: 'Получение файла аватара пользователя' })
  @ApiOkResponse({ description: ApiUserMessage.FileImageUrl })
  @ApiNotFoundResponse({ description: ApiUserMessage.UserOrFileNotFound })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get(':id/avatar')
  @UseGuards(JwtAuthGuard)
  public async getAvatar(@Param('id') id: string) {
    return await this.userService.getAvatar(id);
  }

  @ApiOperation({ summary: 'Получение файла фоновой картинки карточки пользователя' })
  @ApiOkResponse({ description: ApiUserMessage.FileImageUrl })
  @ApiNotFoundResponse({ description: ApiUserMessage.UserOrFileNotFound })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get(':id/page-background')
  @UseGuards(JwtAuthGuard)
  public async getPageBackground(@Param('id') id: string) {
    return await this.userService.getPageBackground(id);
  }

  @ApiOperation({ summary: 'Получение файла сертификата пользователя' })
  @ApiOkResponse({ description: ApiUserMessage.FileCertificate })
  @ApiNotFoundResponse({ description: ApiUserMessage.UserOrFileNotFound })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get(':id/certificates')
  @Header('Content-disposition', 'attachment; filename=certificate.pdf')
  @UseGuards(JwtAuthGuard)
  public async getCertificate(@Param('id') id: string) {
    return await this.userService.getCertificate(id);
  }

  @ApiTags('Account/User')
  @ApiOperation({ summary: 'Добавить в друзья' })
  @ApiCreatedResponse({ description: 'Пользователь успешно добавлен в друзья' })
  @ApiConflictResponse({ description: 'Пользователь уже в друзьях' })
  @ApiNotFoundResponse({ description: ApiUserMessage.NotFound })
  @ApiBadRequestResponse({ description: 'Пользователь не может добавить самого себя в друзья' })
  @ApiForbiddenResponse({ description: `Запрещено кроме пользователей с ролью "${UserRole.User}"` })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Post(':id/friend')
  @UseGuards(JwtAuthGuard, new UserRolesGuard([UserRole.User]))
  public async addToFriends(
    @Param('id') friendId: string,
    @UserParam() payload: TokenPayload,
  ) {
    const result = await this.userService.addToFriends(payload.userId, friendId);
    return fillDto(PaginationRdo<UserRdo>, result);
  }
}
