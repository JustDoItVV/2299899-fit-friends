import {
    TrainingBackgroundPictureAllowedExtensions, TrainingErrorMessage, TrainingVideoAllowedExtensions
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
    Body, Controller, Get, Param, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors,
    UsePipes, ValidationPipe
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { TrainingService } from './training.service';

@Controller('training')
export class TrainingController {
  constructor(
    private readonly trainingService: TrainingService,
  ) {}

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

  @Get('')
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
  @UseGuards(JwtAuthGuard)
  public async showMyTrainings(@Query() query: TrainingPaginationQuery) {
    const result = await this.trainingService.getByQuery(query);
    return fillDto(PaginationRdo<TrainingRdo>, result);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getById(@Param('id') id: string) {
    const training = await this.trainingService.getById(id);
    return fillDto(TrainingRdo, training.toPOJO());
  }

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
}
