import {
    IsBoolean, IsEnum, IsNotEmptyObject, IsNumber, IsOptional, IsString, Max, MaxLength, Min,
    MinLength, ValidationArguments
} from 'class-validator';

import {
    PriceLimit, TitleLength, TrainingCaloriesLimit, TrainingDescriptionLimit, TrainingErrorMessage
} from '@2299899-fit-friends/consts';
import {
    TrainingAuditory, TrainingDuration, TrainingLevel, TrainingType
} from '@2299899-fit-friends/types';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTrainingDto {
  @ApiPropertyOptional({ description: 'Название тренировки' })
  @MaxLength(TitleLength.Max, { message: TrainingErrorMessage.TitleMaxLength })
  @MinLength(TitleLength.Min, { message: TrainingErrorMessage.TitleMinLength })
  @IsString({ message: (validationArguments: ValidationArguments) => `${validationArguments.property} ${TrainingErrorMessage.NotString}`})
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
  @IsEnum(TrainingLevel)
  @IsOptional()
  public level: TrainingLevel;

  @ApiPropertyOptional({ description: 'Тип тренировки', enum: TrainingType })
  @IsEnum(TrainingType)
  @IsOptional()
  public type: TrainingType;

  @ApiPropertyOptional({ description: 'Длительность тренировки', enum: TrainingDuration})
  @IsEnum(TrainingDuration)
  @IsOptional()
  public duration: TrainingDuration;

  @ApiPropertyOptional({ description: 'Цена тренировки в рублях' })
  @Max(PriceLimit.Max, { message: TrainingErrorMessage.PriceMax })
  @Min(PriceLimit.Min, { message: TrainingErrorMessage.PriceMin })
  @IsNumber()
  @IsOptional()
  public price: number;

  @ApiPropertyOptional({ description: 'Количество калорий' })
  @Max(TrainingCaloriesLimit.Max, { message: TrainingErrorMessage.CaloriesMax })
  @Min(TrainingCaloriesLimit.Min, { message: TrainingErrorMessage.CaloriesMin })
  @IsNumber()
  @IsOptional()
  public calories: number;

  @ApiPropertyOptional({ description: 'Описание тренировки' })
  @MaxLength(TrainingDescriptionLimit.Max, { message: TrainingErrorMessage.DescriptionMaxLength })
  @MinLength(TrainingDescriptionLimit.Min, { message: TrainingErrorMessage.DescriptionMinLength })
  @IsString({ message: (validationArguments: ValidationArguments) => `${validationArguments.property} ${TrainingErrorMessage.NotString}`})
  @IsOptional()
  public description: string;

  @ApiPropertyOptional({ description: 'Пол пользователя, для которого предназначена тренировка', enum: TrainingAuditory })
  @IsEnum(TrainingAuditory)
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
