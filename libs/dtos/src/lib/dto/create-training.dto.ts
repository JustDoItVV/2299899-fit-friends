import {
    IsBoolean, IsEnum, IsNotEmpty, IsNotEmptyObject, IsNumber, IsOptional, IsString, Max, MaxLength,
    Min, MinLength
} from 'class-validator';

import {
    PriceLimit, TitleLength, TrainingCaloriesLimit, TrainingDescriptionLimit, TrainingErrorMessage
} from '@2299899-fit-friends/consts';
import { getDtoMessageCallback } from '@2299899-fit-friends/helpers';
import {
    TrainingAuditory, TrainingDuration, TrainingLevel, TrainingType
} from '@2299899-fit-friends/types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrainingDto {
  @ApiProperty({ description: 'Название тренировки', example: 'Тренировка' })
  @MaxLength(TitleLength.Max, { message: getDtoMessageCallback(TrainingErrorMessage.TitleMaxLength) })
  @MinLength(TitleLength.Min, { message: getDtoMessageCallback(TrainingErrorMessage.TitleMinLength) })
  @IsString({ message: getDtoMessageCallback(TrainingErrorMessage.NotString) })
  @IsNotEmpty({ message: getDtoMessageCallback(TrainingErrorMessage.Required) })
  public title: string;

  @ApiProperty({ description: 'Уровень физической подготовки пользователя, на которого рассчитана тренировка', example: TrainingLevel.Amateur, enum: TrainingLevel })
  @IsEnum(TrainingLevel, { message: getDtoMessageCallback(TrainingErrorMessage.Enum, TrainingLevel) })
  @IsNotEmpty({ message: getDtoMessageCallback(TrainingErrorMessage.Required) })
  public level: TrainingLevel;

  @ApiProperty({ description: 'Тип тренировки', example: TrainingType.Crossfit, enum: TrainingType })
  @IsEnum(TrainingType, { message: getDtoMessageCallback(TrainingErrorMessage.Enum, TrainingLevel) })
  @IsNotEmpty({ message: getDtoMessageCallback(TrainingErrorMessage.Required) })
  public type: TrainingType;

  @ApiProperty({ description: 'Длительность тренировки', example: TrainingDuration.Eighty, enum: TrainingDuration })
  @IsEnum(TrainingDuration, { message: getDtoMessageCallback(TrainingErrorMessage.Enum, TrainingDuration) })
  @IsNotEmpty({ message: getDtoMessageCallback(TrainingErrorMessage.Required) })
  public duration: TrainingDuration;

  @ApiProperty({ description: 'Цена тренировки в рублях', example: PriceLimit.Min })
  @Max(PriceLimit.Max, { message: getDtoMessageCallback(TrainingErrorMessage.PriceMax) })
  @Min(PriceLimit.Min, { message: getDtoMessageCallback(TrainingErrorMessage.PriceMin) })
  @IsNumber({}, { message: getDtoMessageCallback(TrainingErrorMessage.Nan) })
  @IsNotEmpty({ message: getDtoMessageCallback(TrainingErrorMessage.Required) })
  public price: number;

  @ApiProperty({ description: 'Количество калорий', example: TrainingCaloriesLimit.Min })
  @Max(TrainingCaloriesLimit.Max, { message: getDtoMessageCallback(TrainingErrorMessage.CaloriesMax) })
  @Min(TrainingCaloriesLimit.Min, { message: getDtoMessageCallback(TrainingErrorMessage.CaloriesMin) })
  @IsNumber({}, { message: getDtoMessageCallback(TrainingErrorMessage.Nan) })
  @IsNotEmpty({ message: getDtoMessageCallback(TrainingErrorMessage.Required) })
  public calories: number;

  @ApiProperty({ description: 'Описание тренировки', example: 'Описание длиной минимум 10 символов' })
  @MaxLength(TrainingDescriptionLimit.Max, { message: getDtoMessageCallback(TrainingErrorMessage.DescriptionMaxLength) })
  @MinLength(TrainingDescriptionLimit.Min, { message: getDtoMessageCallback(TrainingErrorMessage.DescriptionMinLength) })
  @IsString({ message: getDtoMessageCallback(TrainingErrorMessage.NotString) })
  @IsNotEmpty({ message: getDtoMessageCallback(TrainingErrorMessage.Required) })
  public description: string;

  @ApiProperty({ description: 'Пол пользователя, для которого предназначена тренировка', example: TrainingAuditory.All, enum: TrainingAuditory })
  @IsEnum(TrainingAuditory, { message: getDtoMessageCallback(TrainingErrorMessage.Enum, TrainingAuditory) })
  @IsNotEmpty({ message: getDtoMessageCallback(TrainingErrorMessage.Required) })
  public gender: TrainingAuditory;

  @ApiProperty({
    description: 'Файл видео тренировки',
    name: 'video',
    type: 'file',
    properties: { file: { type: 'string', format: 'binary' } },
    required: true,
  })
  @IsNotEmptyObject()
  @IsOptional()
  public video: Express.Multer.File;

  @ApiProperty({ description: 'Флаг специального предложения', example: true })
  @IsBoolean()
  @IsNotEmpty({ message: getDtoMessageCallback(TrainingErrorMessage.Required) })
  public isSpecialOffer: boolean;
}
