import {
    ArrayMaxSize, IsArray, IsBoolean, IsDateString, IsEmail, IsEnum, IsIn, IsNotEmpty, IsNumber,
    IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength, Validate, ValidateIf
} from 'class-validator';

import {
    CaloriesPerDayLimit, CaloriesTargetLimit, MeritsLength, METRO_STATIONS, NameLength,
    PasswordLength, TRAINING_TYPE_LIMIT, UserDescriptionLength, UserErrorMessage
} from '@2299899-fit-friends/consts';
import {
    ArrayMinLengthByUserRole, TransformToArray, TransformToBool, TransformToInt
} from '@2299899-fit-friends/core';
import {
    TrainingDuration, TrainingLevel, TrainingType, UserGender, UserRole
} from '@2299899-fit-friends/types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Имя, одно слово, только английские и русские буквы', example: 'Иван' })
  @MaxLength(NameLength.Max, { message: UserErrorMessage.NameMaxLength })
  @MinLength(NameLength.Min, { message: UserErrorMessage.NameMinLength })
  @Matches(/^[a-zа-я]+$/gui, { message: UserErrorMessage.NameWrongPattern })
  @IsString({ message: UserErrorMessage.NotString })
  @IsNotEmpty({ message: UserErrorMessage.NameRequired })
  public name: string;

  @ApiProperty({ description: 'Уникальный email', example: 'email@local.local' })
  @IsEmail({}, { message: UserErrorMessage.EmailNotValid })
  @IsNotEmpty({ message: UserErrorMessage.EmailRequired })
  public email: string;

  @ApiProperty({ description: 'Пароль', example: '123456', minLength: PasswordLength.Min, maxLength: PasswordLength.Max })
  @MaxLength(PasswordLength.Max, { message: UserErrorMessage.PasswordMaxLength })
  @MinLength(PasswordLength.Min, { message: UserErrorMessage.PasswordMinLength })
  @IsString({ message: UserErrorMessage.NotString })
  @IsNotEmpty({ message: UserErrorMessage.PasswordRequired })
  public password: string;

  @ApiPropertyOptional({ name: 'avatar', type: 'file', properties: { file: { type: 'string', format: 'binary' } }, required: false })
  public avatar: Express.Multer.File;

  @ApiProperty({ description: 'Пол', example: UserGender.Male, enum: UserGender })
  @IsEnum(UserGender)
  @IsString({ message: UserErrorMessage.NotString })
  @IsNotEmpty({ message: UserErrorMessage.GenderRequired })
  public gender: UserGender;

  @ApiPropertyOptional({ description: 'Дата рождения, строка в формате ISO', example: '1967-07-26T12:00:00.000Z' })
  @IsDateString({}, { message: UserErrorMessage.BirthdateNotValid })
  @IsOptional()
  public birthdate?: Date;

  @ApiProperty({ description: 'Роль пользователя в системе', enum: UserRole, example: UserRole.User })
  @IsEnum(UserRole)
  @IsString({ message: UserErrorMessage.NotString })
  @IsNotEmpty({ message: UserErrorMessage.RoleRequired })
  public role: UserRole;

  @ApiPropertyOptional({ description: 'Описание, текст с общей информацией о пользователе', example: 'Длинное описание', minLength: UserDescriptionLength.Min, maxLength: UserDescriptionLength.Max })
  @MaxLength(UserDescriptionLength.Max, { message: UserErrorMessage.DescriptionMaxLength })
  @MinLength(UserDescriptionLength.Min, { message: UserErrorMessage.DescriptionMinLength })
  @IsString({ message: UserErrorMessage.NotString })
  @IsOptional()
  public description?: string;

  @ApiProperty({ description: 'Локация, станция метро', example: METRO_STATIONS[0], enum: METRO_STATIONS })
  @IsIn(METRO_STATIONS)
  @IsNotEmpty({ message: UserErrorMessage.LocationRequired })
  public location: string;

  @ApiPropertyOptional({ name: 'pageBackground', type: 'file', properties: { file: { type: 'string', format: 'binary' } }, required: true })
  public pageBackground: Express.Multer.File;

  @ApiProperty({ description: 'Уровень физической подготовки', enum: TrainingLevel, example: TrainingLevel.Amateur })
  @IsEnum(TrainingLevel)
  @IsNotEmpty({ message: UserErrorMessage.TrainingLevelRequired })
  public trainingLevel: TrainingLevel;

  @ApiProperty({ description: 'Тип тренировок', minItems: 0, maxItems: 3, type: Array<TrainingType> })
  @Validate(ArrayMinLengthByUserRole)
  @IsEnum(TrainingType, { each: true })
  @ArrayMaxSize(TRAINING_TYPE_LIMIT, { message: UserErrorMessage.TrainingTypeMaxSize })
  @IsArray({ message: UserErrorMessage.TariningTypeMustBeArray })
  @TransformToArray()
  public trainingType: TrainingType[];

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.User}": Время на тренировку"`, enum: TrainingDuration, example: TrainingDuration.Eighty })
  @IsEnum(TrainingDuration)
  @IsString({ message: UserErrorMessage.NotString })
  @IsNotEmpty({ message: UserErrorMessage.TrainingDurationRequired })
  @ValidateIf((object) => object.role === UserRole.User)
  public trainingDuration: TrainingDuration;

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.User}": Количество калорий для сброса"`, minimum: CaloriesTargetLimit.Min, maximum: CaloriesTargetLimit.Max, example: CaloriesTargetLimit.Max })
  @Max(CaloriesTargetLimit.Max, { message: UserErrorMessage.CaloriesTargetMax })
  @Min(CaloriesTargetLimit.Min, { message: UserErrorMessage.CaloriesTargetMin })
  @IsNumber()
  @TransformToInt(UserErrorMessage.Nan)
  @IsNotEmpty({ message: UserErrorMessage.CaloriesTargetRequired })
  @ValidateIf((object) => object.role === UserRole.User)
  public caloriesTarget: number;

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.User}": Количество калорий для траты в день"`, minimum: CaloriesPerDayLimit.Min, maximum: CaloriesPerDayLimit.Max, example: CaloriesPerDayLimit.Max })
  @Max(CaloriesPerDayLimit.Max, { message: UserErrorMessage.CaloriesPerDayMax })
  @Min(CaloriesPerDayLimit.Min, { message: UserErrorMessage.CaloriesPerDayMin })
  @IsNumber()
  @TransformToInt(UserErrorMessage.Nan)
  @IsNotEmpty({ message: UserErrorMessage.CaloriesPerDayRequired })
  @ValidateIf((object) => object.role === UserRole.User)
  public caloriesPerDay: number;

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.User}": Флаг готовности пользователя к приглашениям на тренировку"`, enum: ['true', 'false'] })
  @IsBoolean()
  @TransformToBool(UserErrorMessage.NotBoolString)
  @IsNotEmpty({ message: UserErrorMessage.IsReadyToTrainingRequired })
  @ValidateIf((object) => object.role === UserRole.User)
  public isReadyToTraining: boolean;

  @ApiPropertyOptional({ name: 'certificate', type: 'file', properties: { file: { type: 'string', format: 'binary' } }, required: false })
  public certificate?: Express.Multer.File;

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.Trainer}": Текст с описание заслуг тренера`, minLength: MeritsLength.Min, maxLength: MeritsLength.Max, example: 'Большие заслуги' })
  @MaxLength(MeritsLength.Max, { message: UserErrorMessage.MeritsMaxLength })
  @MinLength(MeritsLength.Min, { message: UserErrorMessage.MeritsMinLength })
  @IsString({ message: UserErrorMessage.NotString })
  @IsOptional()
  @ValidateIf((object) => object.role === UserRole.Trainer)
  public merits?: string;

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.Trainer}": Флаг готовности проводить индивидуальные тренировки"`, enum: ['true', 'false'] })
  @IsBoolean()
  @TransformToBool(UserErrorMessage.NotBoolString)
  @IsNotEmpty({ message: UserErrorMessage.IsReadyToPersonalRequired })
  @ValidateIf((object) => object.role === UserRole.Trainer)
  public isReadyToPersonal: boolean;
}
