import {
    ArrayMaxSize, IsArray, IsDateString, IsEmpty, IsEnum, IsIn, IsNotEmpty, IsOptional, IsString,
    Matches, Max, MaxLength, Min, MinLength, Validate, ValidateIf
} from 'class-validator';

import {
    CaloriesPerDayLimit, CaloriesTargetLimit, MeritsLength, METRO_STATIONS, NameLength,
    TRAINING_TYPE_LIMIT, UserDescriptionLength, UserErrorMessage
} from '@2299899-fit-friends/consts';
import {
    ArrayMinLengthByUserRole, TransformToBool, TransformToInt
} from '@2299899-fit-friends/core';
import {
    TrainingDuration, TrainingLevel, TrainingType, UserGender, UserRole
} from '@2299899-fit-friends/types';

export class UpdateUserDto {
  @MaxLength(NameLength.Max, { message: UserErrorMessage.NameMaxLength })
  @MinLength(NameLength.Min, { message: UserErrorMessage.NameMinLength })
  @Matches(/^[a-zа-я]+$/gui, { message: UserErrorMessage.NameWrongPattern })
  @IsString({ message: UserErrorMessage.NotString })
  @IsOptional()
  public name?: string;

  @IsEmpty({ message: UserErrorMessage.EmailUpdateForbidden })
  public email?: string;

  @IsEmpty({ message: UserErrorMessage.PasswordUpdateForbidden })
  public password?: string;

  @IsEmpty({ message: UserErrorMessage.RoleUpdateForbidden })
  public role: string;

  @IsEnum(UserGender)
  @IsString({ message: UserErrorMessage.NotString })
  @IsOptional()
  public gender: UserGender;

  @IsDateString({}, { message: UserErrorMessage.BirthdateNotValid })
  @IsOptional()
  public birthdate?: Date;

  @MaxLength(UserDescriptionLength.Max, { message: UserErrorMessage.DescriptionMaxLength })
  @MinLength(UserDescriptionLength.Min, { message: UserErrorMessage.DescriptionMinLength })
  @IsString({ message: UserErrorMessage.NotString })
  @IsOptional()
  public description?: string;

  @IsIn(METRO_STATIONS)
  @IsOptional()
  public location?: string;

  @IsEnum(TrainingLevel)
  @IsOptional()
  public trainingLevel?: TrainingLevel;

  @Validate(ArrayMinLengthByUserRole)
  @IsEnum(TrainingType, { each: true })
  @ArrayMaxSize(TRAINING_TYPE_LIMIT, { message: UserErrorMessage.TrainingTypeMaxSize })
  @IsArray({ message: UserErrorMessage.TariningTypeMustBeArray })
  @IsOptional()
  public trainingType?: TrainingType[];

  @IsEnum(TrainingDuration)
  @IsString({ message: UserErrorMessage.NotString })
  @IsNotEmpty({ message: UserErrorMessage.TrainingDurationRequired })
  @ValidateIf((object) => object.role === UserRole.User)
  @IsOptional()
  public trainingDuration?: TrainingDuration;

  @Max(CaloriesTargetLimit.Max, { message: UserErrorMessage.CaloriesTargetMax })
  @Min(CaloriesTargetLimit.Min, { message: UserErrorMessage.CaloriesTargetMin })
  @TransformToInt(UserErrorMessage.Nan)
  @IsNotEmpty({ message: UserErrorMessage.CaloriesTargetRequired })
  @ValidateIf((object) => object.role === UserRole.User)
  @IsOptional()
  public caloriesTarget?: number;

  @Max(CaloriesPerDayLimit.Max, { message: UserErrorMessage.CaloriesPerDayMax })
  @Min(CaloriesPerDayLimit.Min, { message: UserErrorMessage.CaloriesPerDayMin })
  @TransformToInt(UserErrorMessage.Nan)
  @IsNotEmpty({ message: UserErrorMessage.CaloriesPerDayRequired })
  @ValidateIf((object) => object.role === UserRole.User)
  @IsOptional()
  public caloriesPerDay?: number;

  @TransformToBool(UserErrorMessage.NotBoolString)
  @IsNotEmpty({ message: UserErrorMessage.IsReadyToTrainingRequired })
  @ValidateIf((object) => object.role === UserRole.User)
  @IsOptional()
  public isReadyToTraining?: boolean;

  @MaxLength(MeritsLength.Max, { message: UserErrorMessage.MeritsMaxLength })
  @MinLength(MeritsLength.Min, { message: UserErrorMessage.MeritsMinLength })
  @IsString({ message: UserErrorMessage.NotString })
  @IsOptional()
  @ValidateIf((object) => object.role === UserRole.Trainer)
  public merits?: string;

  @TransformToBool(UserErrorMessage.NotBoolString)
  @IsNotEmpty({ message: UserErrorMessage.IsReadyToPersonalRequired })
  @ValidateIf((object) => object.role === UserRole.Trainer)
  @IsOptional()
  public isReadyToPersonal?: boolean;
}
