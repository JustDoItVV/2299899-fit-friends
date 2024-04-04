import {
  ApiTag,
  ApiTrainingMessage,
  ApiUserMessage,
  TrainingBackgroundPictureAllowedExtensions,
  TrainingErrorMessage,
  TrainingVideoAllowedExtensions,
} from '@2299899-fit-friends/consts';
import {
  FilesPayload,
  FilesValidationPipe,
  JwtAuthGuard,
  UserParam,
  UserRolesGuard,
} from '@2299899-fit-friends/backend-core';
import {
  ApiOkResponsePaginated,
  CreateTrainingDto,
  PaginationRdo,
  TrainingPaginationQuery,
  TrainingRdo,
  UpdateTrainingDto,
} from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { TokenPayload, UserRole } from '@2299899-fit-friends/types';
import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';

import { TrainingService } from './training.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('training')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @ApiTags(ApiTag.AccountTrainer)
  @ApiOperation({ summary: 'Создание тренировки' })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    description: ApiTrainingMessage.CreateSuccess,
    type: TrainingRdo,
  })
  @ApiBadRequestResponse({ description: ApiTrainingMessage.ValidationError })
  @ApiUnsupportedMediaTypeResponse({
    description: ApiTrainingMessage.UnsupportedFile,
  })
  @ApiForbiddenResponse({ description: ApiUserMessage.ForbiddenExceptTrainer })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Post('')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'video', maxCount: 1 }]))
  @UseGuards(new UserRolesGuard([UserRole.Trainer]))
  public async createTraining(
    @Body() dto: CreateTrainingDto,
    @UserParam() payload: TokenPayload,
    @UploadedFiles(
      new FilesValidationPipe(
        {
          backgroundPicture: {
            formats: TrainingBackgroundPictureAllowedExtensions,
          },
          video: { formats: TrainingVideoAllowedExtensions },
        },
        TrainingErrorMessage.FileFormatForbidden
      )
    )
    files: FilesPayload
  ) {
    const newTraining = await this.trainingService.create(
      dto,
      payload.userId,
      files
    );
    return fillDto(TrainingRdo, newTraining.toPOJO());
  }

  @ApiTags(ApiTag.TrainingCatalog)
  @ApiOperation({ summary: 'Каталог тренировок' })
  @ApiOkResponsePaginated(TrainingRdo, ApiTrainingMessage.Catalog)
  @ApiBadRequestResponse({ description: ApiTrainingMessage.ValidationError })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get('')
  public async showMyTrainings(@Query() query: TrainingPaginationQuery) {
    const result = await this.trainingService.getByQuery(query);
    return fillDto(PaginationRdo<TrainingRdo>, result);
  }

  @ApiTags(ApiTag.AccountTrainer)
  @ApiOperation({ summary: 'Детальная информация о тренировке' })
  @ApiOkResponse({
    description: ApiTrainingMessage.TrainingInfo,
    type: TrainingRdo,
  })
  @ApiNotFoundResponse({ description: ApiTrainingMessage.NotFound })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get(':id')
  public async getById(@Param('id') id: string) {
    const training = await this.trainingService.getById(id);
    return fillDto(TrainingRdo, training.toPOJO());
  }

  @ApiTags(ApiTag.AccountTrainer)
  @ApiOperation({ summary: 'Редактирование тренировки' })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOkResponse({
    description: ApiTrainingMessage.UpdateSuccess,
    type: TrainingRdo,
  })
  @ApiNotFoundResponse({ description: ApiTrainingMessage.NotFound })
  @ApiBadRequestResponse({ description: ApiTrainingMessage.ValidationError })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'backgroundPicture', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ])
  )
  @UseGuards(new UserRolesGuard([UserRole.Trainer]))
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateTrainingDto,
    @UserParam() payload: TokenPayload,
    @UploadedFiles(
      new FilesValidationPipe(
        {
          backgroundPicture: {
            formats: TrainingBackgroundPictureAllowedExtensions,
          },
          video: { formats: TrainingVideoAllowedExtensions },
        },
        TrainingErrorMessage.FileFormatForbidden
      )
    )
    files: FilesPayload
  ) {
    const updatedTraining = await this.trainingService.update(
      payload,
      id,
      dto,
      files
    );
    return fillDto(TrainingRdo, updatedTraining.toPOJO());
  }

  @ApiTags(ApiTag.AccountTrainer)
  @ApiOperation({ summary: 'Получение файла фоновой картинки тренировки' })
  @ApiOkResponse({
    description: ApiTrainingMessage.BackgroundPicture,
    type: TrainingRdo,
  })
  @ApiNotFoundResponse({ description: ApiTrainingMessage.NotFoundFile })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get(':id/backgroundPicture')
  public async getBackgroundPicture(@Param('id') id: string) {
    return await this.trainingService.getBackgroundPicture(id);
  }

  @ApiTags(ApiTag.AccountTrainer)
  @ApiOperation({ summary: 'Получение файла видео тренировки' })
  @ApiOkResponse({ description: ApiTrainingMessage.Video, type: TrainingRdo })
  @ApiNotFoundResponse({ description: ApiTrainingMessage.NotFoundFile })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get(':id/video')
  @Header('Content-disposition', 'attachment; filename=video.mp4')
  public async getVideo(@Param('id') id: string) {
    return await this.trainingService.getVideo(id);
  }
}
