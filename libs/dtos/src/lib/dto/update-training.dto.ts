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

export class UpdateTrainingDto {
  @MaxLength(TitleLength.Max, { message: TrainingErrorMessage.TitleMaxLength })
  @MinLength(TitleLength.Min, { message: TrainingErrorMessage.TitleMinLength })
  @IsString({ message: (validationArguments: ValidationArguments) => `${validationArguments.property} ${TrainingErrorMessage.NotString}`})
  @IsOptional()
  public title: string;

  @IsValidFile({ backgroundPicture: { formats: TrainingBackgroundPictureAllowedExtensions } })
  @IsOptional()
  public backgroundPicture: Express.Multer.File;

  @IsEnum(TrainingLevel)
  @IsOptional()
  public level: TrainingLevel;

  @IsEnum(TrainingType)
  @IsOptional()
  public type: TrainingType;

  @IsEnum(TrainingDuration)
  @IsOptional()
  public duration: TrainingDuration;

  @Max(PriceLimit.Max, { message: TrainingErrorMessage.PriceMax })
  @Min(PriceLimit.Min, { message: TrainingErrorMessage.PriceMin })
  @TransformToInt(TrainingErrorMessage.NotInt)
  @IsOptional()
  public price: number;

  @Max(TrainingCaloriesLimit.Max, { message: TrainingErrorMessage.CaloriesMax })
  @Min(TrainingCaloriesLimit.Min, { message: TrainingErrorMessage.CaloriesMin })
  @TransformToInt(TrainingErrorMessage.NotInt)
  @IsOptional()
  public calories: number;

  @MaxLength(TrainingDescriptionLimit.Max, { message: TrainingErrorMessage.DescriptionMaxLength })
  @MinLength(TrainingDescriptionLimit.Min, { message: TrainingErrorMessage.DescriptionMinLength })
  @IsString({ message: (validationArguments: ValidationArguments) => `${validationArguments.property} ${TrainingErrorMessage.NotString}`})
  @IsOptional()
  public description: string;

  @IsEnum(TrainingAuditory)
  @IsOptional()
  public gender: TrainingAuditory;

  @IsValidFile({ video: { formats: TrainingVideoAllowedExtensions } })
  @IsOptional()
  public video: Express.Multer.File;

  @TransformToBool(TrainingErrorMessage.IsSpecialOfferBool)
  @IsOptional()
  public isSpecialOffer: boolean;
}
