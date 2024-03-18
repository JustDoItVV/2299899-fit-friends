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

export class CreateTrainingDto {
  @MaxLength(TitleLength.Max, { message: TrainingErrorMessage.TitleMaxLength })
  @MinLength(TitleLength.Min, { message: TrainingErrorMessage.TitleMinLength })
  @IsString({ message: (validationArguments: ValidationArguments) => `${validationArguments.property} ${TrainingErrorMessage.NotString}`})
  @IsNotEmpty({ message: TrainingErrorMessage.TitleRequired })
  public title: string;

  @IsValidFile({ backgroundPicture: { formats: TrainingBackgroundPictureAllowedExtensions } })
  public backgroundPicture: Express.Multer.File;

  @IsEnum(TrainingLevel)
  @IsNotEmpty({ message: TrainingErrorMessage.LevelRequired })
  public level: TrainingLevel;

  @IsEnum(TrainingType)
  @IsNotEmpty({ message: TrainingErrorMessage.TypeRequired })
  public type: TrainingType;

  @IsEnum(TrainingDuration)
  @IsNotEmpty({ message: TrainingErrorMessage.DurationRequired })
  public duration: TrainingDuration;

  @Max(PriceLimit.Max, { message: TrainingErrorMessage.PriceMax })
  @Min(PriceLimit.Min, { message: TrainingErrorMessage.PriceMin })
  @TransformToInt(TrainingErrorMessage.NotInt)
  @IsNotEmpty({ message: TrainingErrorMessage.PriceRequired })
  public price: number;

  @Max(TrainingCaloriesLimit.Max, { message: TrainingErrorMessage.CaloriesMax })
  @Min(TrainingCaloriesLimit.Min, { message: TrainingErrorMessage.CaloriesMin })
  @TransformToInt(TrainingErrorMessage.NotInt)
  @IsNotEmpty({ message: TrainingErrorMessage.CaloriesRequired })
  public calories: number;

  @MaxLength(TrainingDescriptionLimit.Max, { message: TrainingErrorMessage.DescriptionMaxLength })
  @MinLength(TrainingDescriptionLimit.Min, { message: TrainingErrorMessage.DescriptionMinLength })
  @IsString({ message: (validationArguments: ValidationArguments) => `${validationArguments.property} ${TrainingErrorMessage.NotString}`})
  @IsNotEmpty({ message: TrainingErrorMessage.DescriptionRequired })
  public description: string;

  @IsEnum(TrainingAuditory)
  @IsNotEmpty({ message: TrainingErrorMessage.GenderRequired })
  public gender: TrainingAuditory;

  @IsValidFile({ video: { formats: TrainingVideoAllowedExtensions } })
  public video: Express.Multer.File;

  @TransformToBool(TrainingErrorMessage.IsSpecialOfferBool)
  @IsNotEmpty({ message: TrainingErrorMessage.IsSpecialOfferRequired })
  public isSpecialOffer: boolean;
}
