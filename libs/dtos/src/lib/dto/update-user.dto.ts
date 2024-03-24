import {
    ArrayMaxSize, IsArray, IsBoolean, IsDate, IsEmpty, IsEnum, IsIn, IsNotEmpty, IsNotEmptyObject,
    IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength, Validate, ValidateIf
} from 'class-validator';

import {
    CaloriesPerDayLimit, CaloriesTargetLimit, MeritsLength, METRO_STATIONS, NameLength,
    TRAINING_TYPE_LIMIT, UserDescriptionLength, UserErrorMessage
} from '@2299899-fit-friends/consts';
import { ArrayMinLengthByUserRole } from '@2299899-fit-friends/core';
import {
    TrainingDuration, TrainingLevel, TrainingType, UserGender, UserRole
} from '@2299899-fit-friends/types';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { TransformToArray } from '../decorators/transform-to-array.decorator';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Имя, одно слово, только английские и русские буквы' })
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

  @ApiPropertyOptional({ name: 'avatar', type: 'file', properties: { file: { type: 'string', format: 'binary' } }, required: false })
  @IsNotEmptyObject()
  @IsOptional()
  public avatar: Express.Multer.File;

  @ApiPropertyOptional({ description: 'Пол', enum: UserGender })
  @IsEnum(UserGender)
  @IsString({ message: UserErrorMessage.NotString })
  @IsOptional()
  public gender: UserGender;

  @ApiPropertyOptional({ description: 'Дата рождения, строка в формате ISO' })
  @IsDate({ message: UserErrorMessage.BirthdateNotValid })
  @IsOptional()
  public birthdate?: Date;

  @ApiPropertyOptional({ description: 'Описание, текст с общей информацией о пользователе' })
  @MaxLength(UserDescriptionLength.Max, { message: UserErrorMessage.DescriptionMaxLength })
  @MinLength(UserDescriptionLength.Min, { message: UserErrorMessage.DescriptionMinLength })
  @IsString({ message: UserErrorMessage.NotString })
  @IsOptional()
  public description?: string;

  @ApiPropertyOptional({ description: 'Локация, станция метро', enum: METRO_STATIONS })
  @IsIn(METRO_STATIONS)
  @IsOptional()
  public location?: string;

  @ApiPropertyOptional({ name: 'pageBackground', type: 'file', properties: { file: { type: 'string', format: 'binary' } }, required: false })
  @IsNotEmptyObject()
  @IsOptional()
  public pageBackground?: Express.Multer.File;

  @ApiPropertyOptional({ description: 'Уровень физической подготовки', enum: TrainingLevel })
  @IsEnum(TrainingLevel)
  @IsOptional()
  public trainingLevel?: TrainingLevel;

  @ApiPropertyOptional({ description: 'Тип тренировок', enum: TrainingType, isArray: true })
  @Validate(ArrayMinLengthByUserRole)
  @IsEnum(TrainingType, { each: true })
  @ArrayMaxSize(TRAINING_TYPE_LIMIT, { message: UserErrorMessage.TrainingTypeMaxSize })
  @IsArray({ message: UserErrorMessage.TariningTypeMustBeArray })
  @TransformToArray()
  @IsOptional()
  public trainingType?: TrainingType[];

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.User}": Время на тренировку"`, enum: TrainingDuration })
  @IsEnum(TrainingDuration)
  @IsString({ message: UserErrorMessage.NotString })
  @IsNotEmpty({ message: UserErrorMessage.TrainingDurationRequired })
  @ValidateIf((object) => object.role === UserRole.User)
  @IsOptional()
  public trainingDuration?: TrainingDuration;

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.User}": Количество калорий для сброса"` })
  @Max(CaloriesTargetLimit.Max, { message: UserErrorMessage.CaloriesTargetMax })
  @Min(CaloriesTargetLimit.Min, { message: UserErrorMessage.CaloriesTargetMin })
  @IsNotEmpty({ message: UserErrorMessage.CaloriesTargetRequired })
  @ValidateIf((object) => object.role === UserRole.User)
  @IsOptional()
  public caloriesTarget?: number;

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.User}": Количество калорий для траты в день"` })
  @Max(CaloriesPerDayLimit.Max, { message: UserErrorMessage.CaloriesPerDayMax })
  @Min(CaloriesPerDayLimit.Min, { message: UserErrorMessage.CaloriesPerDayMin })
  @IsNotEmpty({ message: UserErrorMessage.CaloriesPerDayRequired })
  @ValidateIf((object) => object.role === UserRole.User)
  @IsOptional()
  public caloriesPerDay?: number;

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.User}": Флаг готовности пользователя к приглашениям на тренировку"` })
  @IsBoolean()
  @IsNotEmpty({ message: UserErrorMessage.IsReadyToTrainingRequired })
  @ValidateIf((object) => object.role === UserRole.User)
  @IsOptional()
  public isReadyToTraining?: boolean;

  @ApiPropertyOptional({ name: 'certificate', type: 'file', properties: { file: { type: 'string', format: 'binary' } }, required: false })
  @IsNotEmptyObject()
  @IsOptional()
  @ValidateIf((object) => object.role === UserRole.Trainer)
  public certificate?: Express.Multer.File;

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.Trainer}": Текст с описание заслуг тренера` })
  @MaxLength(MeritsLength.Max, { message: UserErrorMessage.MeritsMaxLength })
  @MinLength(MeritsLength.Min, { message: UserErrorMessage.MeritsMinLength })
  @IsString({ message: UserErrorMessage.NotString })
  @IsOptional()
  @ValidateIf((object) => object.role === UserRole.Trainer)
  public merits?: string;

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.Trainer}": Флаг готовности проводить индивидуальные тренировки"`, enum: ['true', 'false'] })
  @IsBoolean()
  @IsNotEmpty({ message: UserErrorMessage.IsReadyToPersonalRequired })
  @ValidateIf((object) => object.role === UserRole.Trainer)
  @IsOptional()
  public isReadyToPersonal?: boolean;
}
