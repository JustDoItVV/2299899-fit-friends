import {
    IsEnum, IsOptional, IsString, Max, MaxLength, Min, MinLength, ValidationArguments
} from 'class-validator';

import {
    PriceLimit, TitleLength, TrainingBackgroundPictureAllowedExtensions, TrainingCaloriesLimit,
    TrainingDescriptionLimit, TrainingErrorMessage, TrainingVideoAllowedExtensions
} from '@2299899-fit-friends/consts';
import { IsValidFile, TransformToBool, TransformToInt } from '@2299899-fit-friends/core';
import {
    TrainingAuditory, TrainingDuration, TrainingLevel, TrainingType
} from '@2299899-fit-friends/types';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTrainingDto {
  @ApiPropertyOptional({ description: 'Название тренировки', minLength: TitleLength.Min, maxLength: TitleLength.Max })
  @MaxLength(TitleLength.Max, { message: TrainingErrorMessage.TitleMaxLength })
  @MinLength(TitleLength.Min, { message: TrainingErrorMessage.TitleMinLength })
  @IsString({ message: (validationArguments: ValidationArguments) => `${validationArguments.property} ${TrainingErrorMessage.NotString}`})
  @IsOptional()
  public title: string;

  @ApiPropertyOptional({ name: 'backgroundPicture', type: 'file', properties: { file: { type: 'string', format: 'binary' } }, required: false })
  @IsValidFile({ backgroundPicture: { formats: TrainingBackgroundPictureAllowedExtensions } })
  @IsOptional()
  public backgroundPicture: Express.Multer.File;

  @ApiPropertyOptional({ description: 'Уровень физической подготовки пользователя, на которого рассчитана тренировка', enum: TrainingLevel })
  @IsEnum(TrainingLevel)
  @IsOptional()
  public level: TrainingLevel;

  @ApiPropertyOptional({ description: 'Тип тренировки', enum: TrainingType })
  @IsEnum(TrainingType)
  @IsOptional()
  public type: TrainingType;

  @ApiPropertyOptional({ description: 'Длительность тренировки', enum: TrainingDuration })
  @IsEnum(TrainingDuration)
  @IsOptional()
  public duration: TrainingDuration;

  @ApiPropertyOptional({ description: 'Цена тренировки в рублях', minimum: PriceLimit.Min, maximum: PriceLimit.Max })
  @Max(PriceLimit.Max, { message: TrainingErrorMessage.PriceMax })
  @Min(PriceLimit.Min, { message: TrainingErrorMessage.PriceMin })
  @TransformToInt(TrainingErrorMessage.NotInt)
  @IsOptional()
  public price: number;

  @ApiPropertyOptional({ description: 'Количество калорий', minimum: TrainingCaloriesLimit.Min, maximum: TrainingCaloriesLimit.Max })
  @Max(TrainingCaloriesLimit.Max, { message: TrainingErrorMessage.CaloriesMax })
  @Min(TrainingCaloriesLimit.Min, { message: TrainingErrorMessage.CaloriesMin })
  @TransformToInt(TrainingErrorMessage.NotInt)
  @IsOptional()
  public calories: number;

  @ApiPropertyOptional({ description: 'Описание тренировки', minLength: TrainingDescriptionLimit.Min, maxLength: TrainingDescriptionLimit.Max })
  @MaxLength(TrainingDescriptionLimit.Max, { message: TrainingErrorMessage.DescriptionMaxLength })
  @MinLength(TrainingDescriptionLimit.Min, { message: TrainingErrorMessage.DescriptionMinLength })
  @IsString({ message: (validationArguments: ValidationArguments) => `${validationArguments.property} ${TrainingErrorMessage.NotString}`})
  @IsOptional()
  public description: string;

  @ApiPropertyOptional({ description: 'Пол пользователя, для которого предназначена тренировка', enum: TrainingAuditory, example: TrainingAuditory.All })
  @IsEnum(TrainingAuditory)
  @IsOptional()
  public gender: TrainingAuditory;

  @ApiPropertyOptional({ name: 'video', type: 'file', properties: { file: { type: 'string', format: 'binary' } }, required: false })
  @IsValidFile({ video: { formats: TrainingVideoAllowedExtensions } })
  @IsOptional()
  public video: Express.Multer.File;

  @ApiPropertyOptional({ description: 'Флаг специального предложения', enum: ['true', 'false'] })
  @TransformToBool(TrainingErrorMessage.IsSpecialOfferBool)
  @IsOptional()
  public isSpecialOffer: boolean;
}
