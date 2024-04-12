import {
    ArrayMaxSize, IsArray, IsBoolean, IsDate, IsEmail, IsEnum, IsIn, IsNotEmpty, IsNotEmptyObject,
    IsNumber, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength, Validate, ValidateIf
} from 'class-validator';

import { ArrayMinLengthByUserRole } from '@2299899-fit-friends/backend-core';
import {
    CaloriesPerDayLimit, CaloriesTargetLimit, MeritsLength, METRO_STATIONS, NameLength,
    PasswordLength, TRAINING_TYPE_LIMIT, UserDescriptionLength, UserErrorMessage
} from '@2299899-fit-friends/consts';
import { getDtoMessageCallback } from '@2299899-fit-friends/helpers';
import {
    TrainingDuration, TrainingLevel, TrainingType, UserGender, UserRole
} from '@2299899-fit-friends/types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { TransformToArray } from '../decorators/transform-to-array.decorator';

export class CreateUserDto {
  @ApiProperty({ description: 'Имя, одно слово, только английские и русские буквы', example: 'Иван' })
  @MaxLength(NameLength.Max, { message: getDtoMessageCallback(UserErrorMessage.NameMaxLength) })
  @MinLength(NameLength.Min, { message: getDtoMessageCallback(UserErrorMessage.NameMinLength) })
  @Matches(/^[a-zа-я]+$/giu, { message: getDtoMessageCallback(UserErrorMessage.NameWrongPattern) })
  @IsString({ message: getDtoMessageCallback(UserErrorMessage.NotString) })
  @IsNotEmpty({ message: getDtoMessageCallback(UserErrorMessage.Required) })
  public name: string;

  @ApiProperty({ description: 'Уникальный email', example: 'email@local.local' })
  @IsEmail({}, { message: getDtoMessageCallback(UserErrorMessage.NotValid) })
  @IsNotEmpty({ message: getDtoMessageCallback(UserErrorMessage.Required) })
  public email: string;

  @ApiProperty({ description: 'Пароль', example: '123456' })
  @MaxLength(PasswordLength.Max, { message: getDtoMessageCallback(UserErrorMessage.PasswordMaxLength) })
  @MinLength(PasswordLength.Min, { message: getDtoMessageCallback(UserErrorMessage.PasswordMinLength) })
  @IsString({ message: getDtoMessageCallback(UserErrorMessage.NotString) })
  @IsNotEmpty({ message: getDtoMessageCallback(UserErrorMessage.Required) })
  public password: string;

  @ApiPropertyOptional({
    name: 'avatar',
    type: 'file',
    properties: { file: { type: 'string', format: 'binary' } },
    required: false,
  })
  @IsOptional()
  public avatar: Express.Multer.File;

  @ApiProperty({ description: 'Пол', example: UserGender.Male, enum: UserGender })
  @IsEnum(UserGender, { message: getDtoMessageCallback(UserErrorMessage.Enum, UserGender) })
  @IsString({ message: getDtoMessageCallback(UserErrorMessage.NotString) })
  @IsNotEmpty({ message: getDtoMessageCallback(UserErrorMessage.Required) })
  public gender: UserGender;

  @ApiPropertyOptional({ description: 'Дата рождения, строка в формате ISO', example: '1967-07-26T12:00:00.000Z' })
  @IsDate({ message: getDtoMessageCallback(UserErrorMessage.NotValid) })
  @IsOptional()
  public birthdate?: Date;

  @ApiProperty({ description: 'Роль пользователя в системе', example: UserRole.User, enum: UserRole })
  @IsEnum(UserRole, { message: getDtoMessageCallback(UserErrorMessage.Enum, UserRole) })
  @IsString({ message: getDtoMessageCallback(UserErrorMessage.NotString) })
  @IsNotEmpty({ message: getDtoMessageCallback(UserErrorMessage.Required) })
  public role: UserRole;

  @ApiPropertyOptional({ description: 'Описание, текст с общей информацией о пользователе', example: 'Длинное описание' })
  @MaxLength(UserDescriptionLength.Max, { message: getDtoMessageCallback(UserErrorMessage.DescriptionMaxLength) })
  @MinLength(UserDescriptionLength.Min, { message: getDtoMessageCallback(UserErrorMessage.DescriptionMinLength) })
  @IsString({ message: getDtoMessageCallback(UserErrorMessage.NotString) })
  @IsOptional()
  public description?: string;

  @ApiProperty({ description: 'Локация, станция метро', example: METRO_STATIONS[0], enum: METRO_STATIONS })
  @IsIn(METRO_STATIONS, { message: getDtoMessageCallback(UserErrorMessage.Enum, METRO_STATIONS) })
  @IsNotEmpty({ message: getDtoMessageCallback(UserErrorMessage.Required) })
  public location: string;

  @ApiPropertyOptional({
    name: 'pageBackground',
    type: 'file',
    properties: { file: { type: 'string', format: 'binary' } },
    required: true,
  })
  @IsNotEmptyObject()
  @IsOptional()
  public pageBackground: Express.Multer.File;

  @ApiProperty({ description: 'Уровень физической подготовки', example: TrainingLevel.Amateur, enum: TrainingLevel })
  @IsEnum(TrainingLevel, { message: getDtoMessageCallback(UserErrorMessage.Enum, TrainingLevel) })
  @IsNotEmpty({ message: getDtoMessageCallback(UserErrorMessage.Required) })
  @IsOptional()
  public trainingLevel?: TrainingLevel;

  @ApiProperty({ description: 'Тип тренировок', example: [TrainingType.Running], enum: TrainingType, isArray: true })
  @Validate(ArrayMinLengthByUserRole)
  @IsEnum(TrainingType, { each: true, message: getDtoMessageCallback(UserErrorMessage.Enum, TrainingType) })
  @ArrayMaxSize(TRAINING_TYPE_LIMIT, { message: getDtoMessageCallback(UserErrorMessage.TrainingTypeMaxSize) })
  @IsArray({ message: getDtoMessageCallback(UserErrorMessage.MustBeArray) })
  @TransformToArray()
  @IsOptional()
  public trainingType?: TrainingType[];

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.User}": Время на тренировку"`, example: TrainingDuration.Eighty, enum: TrainingDuration })
  @IsEnum(TrainingDuration, { message: getDtoMessageCallback(UserErrorMessage.Enum, TrainingDuration) })
  @IsString({ message: getDtoMessageCallback(UserErrorMessage.NotString) })
  @IsNotEmpty({ message: getDtoMessageCallback(UserErrorMessage.Required) })
  @ValidateIf((object) => object.role === UserRole.User)
  @IsOptional()
  public trainingDuration?: TrainingDuration;

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.User}": Количество калорий для сброса"`, example: CaloriesTargetLimit.Max })
  @Max(CaloriesTargetLimit.Max, { message: getDtoMessageCallback(UserErrorMessage.CaloriesTargetMax) })
  @Min(CaloriesTargetLimit.Min, { message: getDtoMessageCallback(UserErrorMessage.CaloriesTargetMin) })
  @IsNumber({}, { message: getDtoMessageCallback(UserErrorMessage.Nan) })
  @IsNotEmpty({ message: getDtoMessageCallback(UserErrorMessage.Required) })
  @ValidateIf((object) => object.role === UserRole.User)
  @IsOptional()
  public caloriesTarget?: number;

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.User}": Количество калорий для траты в день"`, example: CaloriesPerDayLimit.Max })
  @Max(CaloriesPerDayLimit.Max, { message: getDtoMessageCallback(UserErrorMessage.CaloriesPerDayMax) })
  @Min(CaloriesPerDayLimit.Min, { message: getDtoMessageCallback(UserErrorMessage.CaloriesPerDayMin) })
  @IsNumber({}, { message: getDtoMessageCallback(UserErrorMessage.Nan) })
  @IsNotEmpty({ message: getDtoMessageCallback(UserErrorMessage.Required) })
  @ValidateIf((object) => object.role === UserRole.User)
  @IsOptional()
  public caloriesPerDay?: number;

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.User}": Флаг готовности пользователя к приглашениям на тренировку"` })
  @IsBoolean()
  @IsNotEmpty({ message: getDtoMessageCallback(UserErrorMessage.Required) })
  @ValidateIf((object) => object.role === UserRole.User)
  @IsOptional()
  public isReadyToTraining?: boolean;

  @ApiPropertyOptional({
    name: 'certificate',
    type: 'file',
    properties: { file: { type: 'string', format: 'binary' } },
    required: false,
  })
  @IsNotEmptyObject()
  @ValidateIf((object) => object.role === UserRole.Trainer)
  @IsOptional()
  public certificate?: Express.Multer.File;

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.Trainer}": Текст с описание заслуг тренера`, example: 'Большие заслуги' })
  @MaxLength(MeritsLength.Max, { message: getDtoMessageCallback(UserErrorMessage.MeritsMaxLength) })
  @MinLength(MeritsLength.Min, { message: getDtoMessageCallback(UserErrorMessage.MeritsMinLength) })
  @IsString({ message: getDtoMessageCallback(UserErrorMessage.NotString) })
  @ValidateIf((object) => object.role === UserRole.Trainer)
  @IsOptional()
  public merits?: string;

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.Trainer}": Флаг готовности проводить индивидуальные тренировки"` })
  @IsBoolean()
  @IsNotEmpty({ message: getDtoMessageCallback(UserErrorMessage.Required) })
  @ValidateIf((object) => object.role === UserRole.Trainer)
  @IsOptional()
  public isReadyToPersonal?: boolean;
}
