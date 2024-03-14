import {
    ArrayMaxSize, IsArray, IsBoolean, IsDateString, IsEmail, IsEnum, IsIn, IsNotEmpty, IsNumber,
    IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength, Validate, ValidateIf
} from 'class-validator';

import {
    CaloriesPerDayLimit, CaloriesTargetLimit, MeritsLength, METRO_STATIONS, NameLength,
    PasswordLength, TRAINING_TYPE_LIMIT, UserDescriptionLength, UserErrorMessage
} from '@2299899-fit-friends/consts';
import {
    ArrayMinLengthByUserRole, TransformToBool, TransformToInt
} from '@2299899-fit-friends/core';
import {
    TrainingDuration, TrainingLevel, TrainingType, UserGender, UserRole
} from '@2299899-fit-friends/types';

export class CreateUserDto {
  @MaxLength(NameLength.Max, { message: UserErrorMessage.NameMaxLength })
  @MinLength(NameLength.Min, { message: UserErrorMessage.NameMinLength })
  @Matches(/^[a-zа-я]+$/gui, { message: UserErrorMessage.NameWrongPattern })
  @IsString({ message: UserErrorMessage.NotString })
  @IsNotEmpty({ message: UserErrorMessage.NameRequired })
  public name: string;

  @IsEmail({}, { message: UserErrorMessage.EmailNotValid })
  @IsNotEmpty({ message: UserErrorMessage.EmailRequired })
  public email: string;

  @MaxLength(PasswordLength.Max, { message: UserErrorMessage.PasswordMaxLength })
  @MinLength(PasswordLength.Min, { message: UserErrorMessage.PasswordMinLength })
  @IsString({ message: UserErrorMessage.NotString })
  @IsNotEmpty({ message: UserErrorMessage.PasswordRequired })
  public password: string;

  @IsEnum(UserGender)
  @IsString({ message: UserErrorMessage.NotString })
  @IsNotEmpty({ message: UserErrorMessage.GenderRequired })
  public gender: UserGender;

  @IsDateString({}, { message: UserErrorMessage.BirthdateNotValid })
  @IsOptional()
  public birthdate?: Date;

  @IsEnum(UserRole)
  @IsString({ message: UserErrorMessage.NotString })
  @IsNotEmpty({ message: UserErrorMessage.RoleRequired })
  public role: UserRole;

  @MaxLength(UserDescriptionLength.Max, { message: UserErrorMessage.DescriptionMaxLength })
  @MinLength(UserDescriptionLength.Min, { message: UserErrorMessage.DescriptionMinLength })
  @IsString({ message: UserErrorMessage.NotString })
  @IsOptional()
  public description?: string;

  @IsIn(METRO_STATIONS)
  @IsNotEmpty({ message: UserErrorMessage.LocationRequired })
  public location: string;

  @IsEnum(TrainingLevel)
  @IsNotEmpty({ message: UserErrorMessage.TrainingLevelRequired })
  public trainingLevel: TrainingLevel;

  @Validate(ArrayMinLengthByUserRole)
  @IsEnum(TrainingType, { each: true })
  @ArrayMaxSize(TRAINING_TYPE_LIMIT, { message: UserErrorMessage.TrainingTypeMaxSize })
  @IsArray({ message: UserErrorMessage.TariningTypeMustBeArray })
  public trainingType: TrainingType[];

  @IsEnum(TrainingDuration)
  @IsString({ message: UserErrorMessage.NotString })
  @IsNotEmpty({ message: UserErrorMessage.TrainingDurationRequired })
  @ValidateIf((object) => object.role === UserRole.User)
  public trainingDuration: TrainingDuration;

  @Max(CaloriesTargetLimit.Max, { message: UserErrorMessage.CaloriesTargetMax })
  @Min(CaloriesTargetLimit.Min, { message: UserErrorMessage.CaloriesTargetMin })
  @IsNumber()
  @TransformToInt(UserErrorMessage.Nan)
  @IsNotEmpty({ message: UserErrorMessage.CaloriesTargetRequired })
  @ValidateIf((object) => object.role === UserRole.User)
  public caloriesTarget: number;

  @Max(CaloriesPerDayLimit.Max, { message: UserErrorMessage.CaloriesPerDayMax })
  @Min(CaloriesPerDayLimit.Min, { message: UserErrorMessage.CaloriesPerDayMin })
  @IsNumber()
  @TransformToInt(UserErrorMessage.Nan)
  @IsNotEmpty({ message: UserErrorMessage.CaloriesPerDayRequired })
  @ValidateIf((object) => object.role === UserRole.User)
  public caloriesPerDay: number;

  @IsBoolean()
  @TransformToBool(UserErrorMessage.NotBoolString)
  @IsNotEmpty({ message: UserErrorMessage.IsReadyToTrainingRequired })
  @ValidateIf((object) => object.role === UserRole.User)
  public isReadyToTraining: boolean;

  @MaxLength(MeritsLength.Max, { message: UserErrorMessage.MeritsMaxLength })
  @MinLength(MeritsLength.Min, { message: UserErrorMessage.MeritsMinLength })
  @IsString({ message: UserErrorMessage.NotString })
  @IsOptional()
  @ValidateIf((object) => object.role === UserRole.Trainer)
  public merits?: string;

  @IsBoolean()
  @TransformToBool(UserErrorMessage.NotBoolString)
  @IsNotEmpty({ message: UserErrorMessage.IsReadyToPersonalRequired })
  @ValidateIf((object) => object.role === UserRole.Trainer)
  public isReadyToPersonal: boolean;
}
