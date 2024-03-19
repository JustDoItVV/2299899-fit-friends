import {
    IsEnum, IsNotEmpty, IsString, Max, MaxLength, Min, MinLength, ValidationArguments
} from 'class-validator';

import {
    PriceLimit, TitleLength, TrainingBackgroundPictureAllowedExtensions, TrainingCaloriesLimit,
    TrainingDescriptionLimit, TrainingErrorMessage, TrainingVideoAllowedExtensions
} from '@2299899-fit-friends/consts';
import { IsValidFile, TransformToBool, TransformToInt } from '@2299899-fit-friends/core';
import {
    TrainingAuditory, TrainingDuration, TrainingLevel, TrainingType
} from '@2299899-fit-friends/types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrainingDto {
  @ApiProperty({ description: 'Название тренировки', example: 'Тренировка', minLength: TitleLength.Min, maxLength: TitleLength.Max })
  @MaxLength(TitleLength.Max, { message: TrainingErrorMessage.TitleMaxLength })
  @MinLength(TitleLength.Min, { message: TrainingErrorMessage.TitleMinLength })
  @IsString({ message: (validationArguments: ValidationArguments) => `${validationArguments.property} ${TrainingErrorMessage.NotString}`})
  @IsNotEmpty({ message: TrainingErrorMessage.TitleRequired })
  public title: string;

  @ApiProperty({ name: 'backgroundPicture', type: 'file', properties: { file: { type: 'string', format: 'binary' } }, required: true })
  @IsValidFile({ backgroundPicture: { formats: TrainingBackgroundPictureAllowedExtensions } })
  public backgroundPicture: Express.Multer.File;

  @ApiProperty({ description: 'Уровень физической подготовки пользователя, на которого рассчитана тренировка', enum: TrainingLevel, example: TrainingLevel.Amateur })
  @IsEnum(TrainingLevel)
  @IsNotEmpty({ message: TrainingErrorMessage.LevelRequired })
  public level: TrainingLevel;

  @ApiProperty({ description: 'Тип тренировки', enum: TrainingType, example: TrainingType.Crossfit })
  @IsEnum(TrainingType)
  @IsNotEmpty({ message: TrainingErrorMessage.TypeRequired })
  public type: TrainingType;

  @ApiProperty({ description: 'Длительность тренировки', enum: TrainingDuration, example: TrainingDuration.Eighty })
  @IsEnum(TrainingDuration)
  @IsNotEmpty({ message: TrainingErrorMessage.DurationRequired })
  public duration: TrainingDuration;

  @ApiProperty({ description: 'Цена тренировки в рублях', example: 1000, minimum: PriceLimit.Min, maximum: PriceLimit.Max })
  @Max(PriceLimit.Max, { message: TrainingErrorMessage.PriceMax })
  @Min(PriceLimit.Min, { message: TrainingErrorMessage.PriceMin })
  @TransformToInt(TrainingErrorMessage.NotInt)
  @IsNotEmpty({ message: TrainingErrorMessage.PriceRequired })
  public price: number;

  @ApiProperty({ description: 'Количество калорий', example: 2000, minimum: TrainingCaloriesLimit.Min, maximum: TrainingCaloriesLimit.Max })
  @Max(TrainingCaloriesLimit.Max, { message: TrainingErrorMessage.CaloriesMax })
  @Min(TrainingCaloriesLimit.Min, { message: TrainingErrorMessage.CaloriesMin })
  @TransformToInt(TrainingErrorMessage.NotInt)
  @IsNotEmpty({ message: TrainingErrorMessage.CaloriesRequired })
  public calories: number;

  @ApiProperty({ description: 'Описание тренировки', example: 'Описание длиной минимум 10 символов', minLength: TrainingDescriptionLimit.Min, maxLength: TrainingDescriptionLimit.Max })
  @MaxLength(TrainingDescriptionLimit.Max, { message: TrainingErrorMessage.DescriptionMaxLength })
  @MinLength(TrainingDescriptionLimit.Min, { message: TrainingErrorMessage.DescriptionMinLength })
  @IsString({ message: (validationArguments: ValidationArguments) => `${validationArguments.property} ${TrainingErrorMessage.NotString}`})
  @IsNotEmpty({ message: TrainingErrorMessage.DescriptionRequired })
  public description: string;

  @ApiProperty({ description: 'Пол пользователя, для которого предназначена тренировка', enum: TrainingAuditory, example: TrainingAuditory.All })
  @IsEnum(TrainingAuditory)
  @IsNotEmpty({ message: TrainingErrorMessage.GenderRequired })
  public gender: TrainingAuditory;

  @ApiProperty({ name: 'video', type: 'file', properties: { file: { type: 'string', format: 'binary' } }, required: true })
  @IsValidFile({ video: { formats: TrainingVideoAllowedExtensions } })
  public video: Express.Multer.File;

  @ApiProperty({ description: 'Флаг специального предложения', enum: ['true', 'false'], example: 'true' })
  @TransformToBool(TrainingErrorMessage.IsSpecialOfferBool)
  @IsNotEmpty({ message: TrainingErrorMessage.IsSpecialOfferRequired })
  public isSpecialOffer: boolean;
}
