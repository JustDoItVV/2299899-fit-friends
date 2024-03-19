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
    Body, Controller, Get, HttpStatus, Param, Patch, Post, Query, UploadedFiles, UseGuards,
    UseInterceptors, UsePipes, ValidationPipe
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { TrainingService } from './training.service';

@ApiBearerAuth()
@Controller('training')
export class TrainingController {
  constructor(
    private readonly trainingService: TrainingService,
  ) {}

  @ApiTags('Account/Trainer')
  @ApiResponse({ status: HttpStatus.CREATED, type: TrainingRdo })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @ApiResponse({ status: HttpStatus.UNSUPPORTED_MEDIA_TYPE })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: ApiUserMessage.Unauthorized })
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

  @ApiTags('Trainings catalog')
  @ApiResponse({ status: HttpStatus.OK, type: PaginationRdo<TrainingRdo> })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: ApiUserMessage.Unauthorized })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @Get('')
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
  @UseGuards(JwtAuthGuard)
  public async showMyTrainings(@Query() query: TrainingPaginationQuery) {
    const result = await this.trainingService.getByQuery(query);
    return fillDto(PaginationRdo<TrainingRdo>, result);
  }

  @ApiTags('Account/Trainer')
  @ApiResponse({ status: HttpStatus.OK, type: TrainingRdo })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: ApiUserMessage.Unauthorized })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getById(@Param('id') id: string) {
    const training = await this.trainingService.getById(id);
    return fillDto(TrainingRdo, training.toPOJO());
  }

  @ApiTags('Account/Trainer')
  @ApiResponse({ status: HttpStatus.OK, type: PaginationRdo<TrainingRdo> })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: ApiUserMessage.Unauthorized })
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
