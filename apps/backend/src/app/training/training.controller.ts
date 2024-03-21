import {
    ApiUserMessage, TrainingBackgroundPictureAllowedExtensions, TrainingErrorMessage,
    TrainingVideoAllowedExtensions
} from '@2299899-fit-friends/consts';
import {
    FilesValidationPipe, JwtAuthGuard, TrainingDataTrasformationPipe, UserParam, UserRolesGuard
} from '@2299899-fit-friends/core';
import {
    CreateTrainingDto, PaginationRdo, TrainingPaginationQuery, TrainingRdo, UpdateTrainingDto
} from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { TokenPayload, TrainingFilesPayload, UserRole } from '@2299899-fit-friends/types';
import {
    Body, Controller, Get, Header, Param, Patch, Post, Query, UploadedFiles, UseGuards,
    UseInterceptors, UsePipes, ValidationPipe
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
    ApiBadRequestResponse, ApiBearerAuth, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse,
    ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse,
    ApiUnsupportedMediaTypeResponse
} from '@nestjs/swagger';

import { TrainingService } from './training.service';

@ApiBearerAuth()
@Controller('training')
export class TrainingController {
  constructor(
    private readonly trainingService: TrainingService,
  ) {}

  @ApiTags('Личный кабинет тренера')
  @ApiOperation({ summary: 'Создание тренировки' })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: 'Тренировка успешно создана', type: TrainingRdo })
  @ApiBadRequestResponse({ description: 'Ошибка валидации данных' })
  @ApiUnsupportedMediaTypeResponse({ description: 'Неподдерживаемый тип файлов' })
  @ApiForbiddenResponse({ description: `Создание запрещено кроме пользователя с ролью ${UserRole.Trainer}` })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Post('')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'backgroundPicture', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]))
  @UseGuards(JwtAuthGuard, new UserRolesGuard([UserRole.Trainer]))
  public async createTraining(
    @Body(new TrainingDataTrasformationPipe()) dto: CreateTrainingDto,
    @UserParam() payload: TokenPayload,
    @UploadedFiles(new FilesValidationPipe({
      backgroundPicture: { formats: TrainingBackgroundPictureAllowedExtensions },
      video: { formats: TrainingVideoAllowedExtensions },
    }, TrainingErrorMessage.FileFormatForbidden)) files: TrainingFilesPayload,
  ) {
    const newTraining = await this.trainingService.create(dto, payload.userId, files);
    return fillDto(TrainingRdo, newTraining.toPOJO());
  }

  @ApiTags('Каталог тренировок')
  @ApiOperation({ summary: 'Каталог тренировок' })
  @ApiOkResponse({ description: 'Каталог тренировок с пагинацией', type: PaginationRdo<TrainingRdo> })
  @ApiBadRequestResponse({ description: 'Ошибка валидации данных' })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get('')
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
  @UseGuards(JwtAuthGuard)
  public async showMyTrainings(@Query() query: TrainingPaginationQuery) {
    const result = await this.trainingService.getByQuery(query);
    return fillDto(PaginationRdo<TrainingRdo>, result);
  }

  @ApiTags('Личный кабинет тренера')
  @ApiOperation({ summary: 'Детальная информация о тренировке' })
  @ApiOkResponse({ description: 'Детальная информация о тренировке', type: TrainingRdo })
  @ApiNotFoundResponse({ description: 'Тренировка не найдена' })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getById(@Param('id') id: string) {
    const training = await this.trainingService.getById(id);
    return fillDto(TrainingRdo, training.toPOJO());
  }

  @ApiTags('Личный кабинет тренера')
  @ApiOperation({ summary: 'Редактирование тренировки' })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOkResponse({ description: 'Детальная информация обновленной тренировки', type: TrainingRdo })
  @ApiNotFoundResponse({ description: 'Тренировка не найдена' })
  @ApiBadRequestResponse({ description: 'Ошибка валидации данных' })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'backgroundPicture', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]))
  @UseGuards(JwtAuthGuard, new UserRolesGuard([UserRole.Trainer]))
  public async update(
    @Param('id') id: string,
    @Body(new TrainingDataTrasformationPipe()) dto: UpdateTrainingDto,
    @UserParam() payload: TokenPayload,
    @UploadedFiles(new FilesValidationPipe({
      backgroundPicture: { formats: TrainingBackgroundPictureAllowedExtensions },
      video: { formats: TrainingVideoAllowedExtensions },
    }, TrainingErrorMessage.FileFormatForbidden)) files: TrainingFilesPayload,
  ) {
    const updatedTraining = await this.trainingService.update(payload, id, dto, files);
    return fillDto(TrainingRdo, updatedTraining.toPOJO());
  }

  @ApiTags('Личный кабинет тренера')
  @ApiOperation({ summary: 'Получение файла фоновой картинки тренировки' })
  @ApiOkResponse({ description: 'Файл фоновой картинки тренировки в виде data url', type: TrainingRdo })
  @ApiNotFoundResponse({ description: 'Тренировка или файл не найдены' })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get(':id/backgroundPicture')
  @UseGuards(JwtAuthGuard)
  public async getBackgroundPicture(@Param('id') id: string) {
    return await this.trainingService.getBackgroundPicture(id);
  }

  @ApiTags('Личный кабинет тренера')
  @ApiOperation({ summary: 'Получение файла видео тренировки' })
  @ApiOkResponse({ description: 'Файл видео тренировки', type: TrainingRdo })
  @ApiNotFoundResponse({ description: 'Тренировка или файл не найдены' })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get(':id/video')
  @Header('Content-disposition', 'attachment; filename=video.mp4')
  @UseGuards(JwtAuthGuard)
  public async getVideo(@Param('id') id: string) {
    return await this.trainingService.getVideo(id);
  }
}
