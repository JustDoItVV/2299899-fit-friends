import {
    ArrayMaxSize, IsArray, IsBoolean, IsDate, IsEmpty, IsEnum, IsIn, IsNotEmpty, IsNotEmptyObject,
    IsNumber, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength, Validate
} from 'class-validator';

import { ArrayMinLengthByUserRole } from '@2299899-fit-friends/backend-core';
import {
    CaloriesPerDayLimit, CaloriesTargetLimit, MeritsLength, METRO_STATIONS, NameLength,
    TRAINING_TYPE_LIMIT, UserDescriptionLength, UserErrorMessage
} from '@2299899-fit-friends/consts';
import { getDtoMessageCallback } from '@2299899-fit-friends/helpers';
import {
    TrainingDuration, TrainingLevel, TrainingType, UserGender, UserRole
} from '@2299899-fit-friends/types';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { TransformToArray } from '../decorators/transform-to-array.decorator';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Имя, одно слово, только английские и русские буквы' })
  @MaxLength(NameLength.Max, { message: getDtoMessageCallback(UserErrorMessage.NameMaxLength) })
  @MinLength(NameLength.Min, { message: getDtoMessageCallback(UserErrorMessage.NameMinLength) })
  @Matches(/^[a-zа-я]+$/giu, { message: getDtoMessageCallback(UserErrorMessage.NameWrongPattern) })
  @IsString({ message: getDtoMessageCallback(UserErrorMessage.NotString) })
  @IsOptional()
  public name?: string;

  @IsEmpty({ message: getDtoMessageCallback(UserErrorMessage.EmailUpdateForbidden) })
  public email?: string;

  @IsEmpty({ message: getDtoMessageCallback(UserErrorMessage.PasswordUpdateForbidden) })
  public password?: string;

  @IsEmpty({ message: getDtoMessageCallback(UserErrorMessage.RoleUpdateForbidden) })
  public role: string;

  @ApiPropertyOptional({
    name: 'avatar',
    type: 'file',
    properties: { file: { type: 'string', format: 'binary' } },
    required: false,
  })
  @IsNotEmptyObject()
  @IsOptional()
  public avatar: Express.Multer.File;

  @ApiPropertyOptional({ description: 'Пол', enum: UserGender })
  @IsEnum(UserGender, { message: getDtoMessageCallback(UserErrorMessage.Enum, UserGender) })
  @IsString({ message: getDtoMessageCallback(UserErrorMessage.NotString) })
  @IsOptional()
  public gender: UserGender;

  @ApiPropertyOptional({ description: 'Дата рождения, строка в формате ISO' })
  @IsDate({ message: getDtoMessageCallback(UserErrorMessage.NotValid) })
  @IsOptional()
  public birthdate?: Date;

  @ApiPropertyOptional({ description: 'Описание, текст с общей информацией о пользователе' })
  @MaxLength(UserDescriptionLength.Max, { message: getDtoMessageCallback(UserErrorMessage.DescriptionMaxLength) })
  @MinLength(UserDescriptionLength.Min, { message: getDtoMessageCallback(UserErrorMessage.DescriptionMinLength) })
  @IsString({ message: getDtoMessageCallback(UserErrorMessage.NotString) })
  @IsOptional()
  public description?: string;

  @ApiPropertyOptional({ description: 'Локация, станция метро', enum: METRO_STATIONS })
  @IsIn(METRO_STATIONS, { message: getDtoMessageCallback(UserErrorMessage.Enum, METRO_STATIONS) })
  @IsOptional()
  public location?: string;

  @ApiPropertyOptional({
    name: 'pageBackground',
    type: 'file',
    properties: { file: { type: 'string', format: 'binary' } },
    required: false,
  })
  @IsNotEmptyObject()
  @IsOptional()
  public pageBackground?: Express.Multer.File;

  @ApiPropertyOptional({ description: 'Уровень физической подготовки', enum: TrainingLevel })
  @IsEnum(TrainingLevel, { message: getDtoMessageCallback(UserErrorMessage.Enum, TrainingLevel) })
  @IsOptional()
  public trainingLevel?: TrainingLevel;

  @ApiPropertyOptional({ description: 'Тип тренировок', enum: TrainingType, isArray: true })
  @Validate(ArrayMinLengthByUserRole)
  @IsEnum(TrainingType, { each: true, message: getDtoMessageCallback(UserErrorMessage.Enum, TrainingType) })
  @ArrayMaxSize(TRAINING_TYPE_LIMIT, { message: getDtoMessageCallback(UserErrorMessage.TrainingTypeMaxSize) })
  @IsArray({ message: getDtoMessageCallback(UserErrorMessage.MustBeArray) })
  @TransformToArray()
  @IsOptional()
  public trainingType?: TrainingType[];

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.User}": Время на тренировку"`, enum: TrainingDuration })
  @IsEnum(TrainingDuration, { message: getDtoMessageCallback(UserErrorMessage.Enum, TrainingDuration) })
  @IsString({ message: getDtoMessageCallback(UserErrorMessage.NotString) })
  @IsNotEmpty({ message: getDtoMessageCallback(UserErrorMessage.Required) })
  @IsOptional()
  public trainingDuration?: TrainingDuration;

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.User}": Количество калорий для сброса"` })
  @Max(CaloriesTargetLimit.Max, { message: getDtoMessageCallback(UserErrorMessage.CaloriesTargetMax) })
  @Min(CaloriesTargetLimit.Min, { message: getDtoMessageCallback(UserErrorMessage.CaloriesTargetMin) })
  @IsNotEmpty({ message: getDtoMessageCallback(UserErrorMessage.Required) })
  @IsOptional()
  public caloriesTarget?: number;

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.User}": Количество калорий для траты в день"` })
  @Max(CaloriesPerDayLimit.Max, { message: getDtoMessageCallback(UserErrorMessage.CaloriesPerDayMax) })
  @Min(CaloriesPerDayLimit.Min, { message: getDtoMessageCallback(UserErrorMessage.CaloriesPerDayMin) })
  @IsNotEmpty({ message: getDtoMessageCallback(UserErrorMessage.Required) })
  @IsOptional()
  public caloriesPerDay?: number;

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.User}": Флаг готовности пользователя к приглашениям на тренировку"` })
  @IsBoolean()
  @IsNotEmpty({ message: getDtoMessageCallback(UserErrorMessage.Required) })
  @IsOptional()
  public isReadyToTraining?: boolean;

  @ApiPropertyOptional({
    name: 'certificate',
    type: 'file',
    properties: { file: { type: 'string', format: 'binary' } },
    required: false,
  })
  @IsNotEmptyObject()
  @IsOptional()
  public certificate?: Express.Multer.File;

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.Trainer}": Текст с описание заслуг тренера` })
  @MaxLength(MeritsLength.Max, { message: getDtoMessageCallback(UserErrorMessage.MeritsMaxLength) })
  @MinLength(MeritsLength.Min, { message: getDtoMessageCallback(UserErrorMessage.MeritsMinLength) })
  @IsString({ message: getDtoMessageCallback(UserErrorMessage.NotString) })
  @IsOptional()
  public merits?: string;

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.Trainer}": Флаг готовности проводить индивидуальные тренировки"`, enum: ['true', 'false'] })
  @IsBoolean()
  @IsNotEmpty({ message: getDtoMessageCallback(UserErrorMessage.Required) })
  @IsOptional()
  public isReadyToPersonal?: boolean;

  @ApiPropertyOptional({ description: `Флаг удаления аватара` })
  @IsBoolean()
  @IsOptional()
  public deleteAvatar?: boolean;

  @ApiPropertyOptional({ description: `Индекс сертификата в массиве для обновления` })
  @IsNumber({}, { message: getDtoMessageCallback(UserErrorMessage.Nan) })
  @IsOptional()
  public certificateIndex?: number;

  @ApiPropertyOptional({ description: `Флаг удаления сертификата` })
  @IsBoolean()
  @IsOptional()
  public deleteCertificate?: boolean;
}
