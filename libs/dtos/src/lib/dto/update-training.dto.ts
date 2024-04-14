import {
    IsBoolean, IsEnum, IsNotEmptyObject, IsNumber, IsOptional, IsString, Max, MaxLength, Min,
    MinLength
} from 'class-validator';

import {
    PriceLimit, TitleLength, TrainingCaloriesLimit, TrainingDescriptionLimit, TrainingErrorMessage
} from '@2299899-fit-friends/consts';
import { getDtoMessageCallback } from '@2299899-fit-friends/helpers';
import {
    TrainingAuditory, TrainingDuration, TrainingLevel, TrainingType
} from '@2299899-fit-friends/types';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTrainingDto {
  @ApiPropertyOptional({ description: 'Название тренировки' })
  @MaxLength(TitleLength.Max, { message: getDtoMessageCallback(TrainingErrorMessage.TitleMaxLength) })
  @MinLength(TitleLength.Min, { message: getDtoMessageCallback(TrainingErrorMessage.TitleMinLength) })
  @IsString({ message: getDtoMessageCallback(TrainingErrorMessage.NotString) })
  @IsOptional()
  public title: string;

  @ApiPropertyOptional({
    description: 'Файл фонового изображения страницы тренировки',
    name: 'backgroundPicture',
    type: 'file',
    properties: { file: { type: 'string', format: 'binary' } },
    required: false
  })
  @IsNotEmptyObject()
  @IsOptional()
  public backgroundPicture: Express.Multer.File;

  @ApiPropertyOptional({ description: 'Уровень физической подготовки пользователя, на которого рассчитана тренировка', enum: TrainingLevel })
  @IsEnum(TrainingLevel, { message: getDtoMessageCallback(TrainingErrorMessage.Enum, TrainingLevel) })
  @IsOptional()
  public level: TrainingLevel;

  @ApiPropertyOptional({ description: 'Тип тренировки', enum: TrainingType })
  @IsEnum(TrainingType, { message: getDtoMessageCallback(TrainingErrorMessage.Enum, TrainingType) })
  @IsOptional()
  public type: TrainingType;

  @ApiPropertyOptional({ description: 'Длительность тренировки', enum: TrainingDuration})
  @IsEnum(TrainingDuration, { message: getDtoMessageCallback(TrainingErrorMessage.Enum, TrainingDuration) })
  @IsOptional()
  public duration: TrainingDuration;

  @ApiPropertyOptional({ description: 'Цена тренировки в рублях' })
  @Max(PriceLimit.Max, { message: getDtoMessageCallback(TrainingErrorMessage.PriceMax) })
  @Min(PriceLimit.Min, { message: getDtoMessageCallback(TrainingErrorMessage.PriceMin) })
  @IsNumber({}, { message: getDtoMessageCallback(TrainingErrorMessage.Nan) })
  @IsOptional()
  public price: number;

  @ApiPropertyOptional({ description: 'Количество калорий' })
  @Max(TrainingCaloriesLimit.Max, { message: getDtoMessageCallback(TrainingErrorMessage.CaloriesMax) })
  @Min(TrainingCaloriesLimit.Min, { message: getDtoMessageCallback(TrainingErrorMessage.CaloriesMin) })
  @IsNumber({}, { message: getDtoMessageCallback(TrainingErrorMessage.Nan) })
  @IsOptional()
  public calories: number;

  @ApiPropertyOptional({ description: 'Описание тренировки' })
  @MaxLength(TrainingDescriptionLimit.Max, { message: getDtoMessageCallback(TrainingErrorMessage.DescriptionMaxLength) })
  @MinLength(TrainingDescriptionLimit.Min, { message: getDtoMessageCallback(TrainingErrorMessage.DescriptionMinLength) })
  @IsString({ message: getDtoMessageCallback(TrainingErrorMessage.NotString) })
  @IsOptional()
  public description: string;

  @ApiPropertyOptional({ description: 'Пол пользователя, для которого предназначена тренировка', enum: TrainingAuditory })
  @IsEnum(TrainingAuditory, { message: getDtoMessageCallback(TrainingErrorMessage.Enum, TrainingAuditory) })
  @IsOptional()
  public gender: TrainingAuditory;

  @ApiPropertyOptional({
    description: 'Файл видео тренировки',
    name: 'video',
    type: 'file',
    properties: { file: { type: 'string', format: 'binary' } },
    required: false,
  })
  @IsNotEmptyObject()
  @IsOptional()
  public video: Express.Multer.File;

  @ApiPropertyOptional({ description: 'Флаг специального предложения' })
  @IsBoolean()
  @IsOptional()
  public isSpecialOffer: boolean;
}
