import {
    IsBoolean, IsEnum, IsNotEmpty, IsNotEmptyObject, IsNumber, IsOptional, IsString, Max, MaxLength,
    Min, MinLength, ValidationArguments
} from 'class-validator';

import {
    PriceLimit, TitleLength, TrainingCaloriesLimit, TrainingDescriptionLimit, TrainingErrorMessage
} from '@2299899-fit-friends/consts';
import {
    TrainingAuditory, TrainingDuration, TrainingLevel, TrainingType
} from '@2299899-fit-friends/types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrainingDto {
  @ApiProperty({ description: 'Название тренировки', example: 'Тренировка' })
  @MaxLength(TitleLength.Max, { message: TrainingErrorMessage.TitleMaxLength })
  @MinLength(TitleLength.Min, { message: TrainingErrorMessage.TitleMinLength })
  @IsString({ message: (validationArguments: ValidationArguments) => `${validationArguments.property} ${TrainingErrorMessage.NotString}`})
  @IsNotEmpty({ message: TrainingErrorMessage.TitleRequired })
  public title: string;

  @ApiProperty({
    description: 'Файл фонового изображения страницы тренировки',
    name: 'backgroundPicture',
    type: 'file',
    properties: { file: { type: 'string', format: 'binary' } },
    required: true
  })
  @IsNotEmptyObject()
  @IsOptional()
  public backgroundPicture: Express.Multer.File;

  @ApiProperty({ description: 'Уровень физической подготовки пользователя, на которого рассчитана тренировка', example: TrainingLevel.Amateur, type: String })
  @IsEnum(TrainingLevel)
  @IsNotEmpty()
  public level: TrainingLevel;

  @ApiProperty({ description: 'Тип тренировки', example: TrainingType.Crossfit, type: String })
  @IsEnum(TrainingType)
  @IsNotEmpty({ message: TrainingErrorMessage.TypeRequired })
  public type: TrainingType;

  @ApiProperty({ description: 'Длительность тренировки', example: TrainingDuration.Eighty, type: String })
  @IsEnum(TrainingDuration)
  @IsNotEmpty({ message: TrainingErrorMessage.DurationRequired })
  public duration: TrainingDuration;

  @ApiProperty({ description: 'Цена тренировки в рублях', example: PriceLimit.Min })
  @Max(PriceLimit.Max, { message: TrainingErrorMessage.PriceMax })
  @Min(PriceLimit.Min, { message: TrainingErrorMessage.PriceMin })
  @IsNumber()
  @IsNotEmpty({ message: TrainingErrorMessage.PriceRequired })
  public price: number;

  @ApiProperty({ description: 'Количество калорий', example: TrainingCaloriesLimit.Min })
  @Max(TrainingCaloriesLimit.Max, { message: TrainingErrorMessage.CaloriesMax })
  @Min(TrainingCaloriesLimit.Min, { message: TrainingErrorMessage.CaloriesMin })
  @IsNumber()
  @IsNotEmpty({ message: TrainingErrorMessage.CaloriesRequired })
  public calories: number;

  @ApiProperty({ description: 'Описание тренировки', example: 'Описание длиной минимум 10 символов' })
  @MaxLength(TrainingDescriptionLimit.Max, { message: TrainingErrorMessage.DescriptionMaxLength })
  @MinLength(TrainingDescriptionLimit.Min, { message: TrainingErrorMessage.DescriptionMinLength })
  @IsString({ message: (validationArguments: ValidationArguments) => `${validationArguments.property} ${TrainingErrorMessage.NotString}`})
  @IsNotEmpty({ message: TrainingErrorMessage.DescriptionRequired })
  public description: string;

  @ApiProperty({ description: 'Пол пользователя, для которого предназначена тренировка', example: TrainingAuditory.All, type: String })
  @IsEnum(TrainingAuditory)
  @IsNotEmpty({ message: TrainingErrorMessage.GenderRequired })
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

  @ApiProperty({ description: 'Флаг специального предложения', example: 'false', type: String })
  @IsBoolean()
  @IsNotEmpty({ message: TrainingErrorMessage.IsSpecialOfferRequired })
  public isSpecialOffer: boolean;
}
