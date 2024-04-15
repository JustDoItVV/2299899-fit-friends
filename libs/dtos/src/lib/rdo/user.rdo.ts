import { Expose } from 'class-transformer';

import { METRO_STATIONS, UserDescriptionLength } from '@2299899-fit-friends/consts';
import {
    TrainingDuration, TrainingLevel, TrainingType, UserGender, UserRole
} from '@2299899-fit-friends/types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserRdo {
  @ApiProperty({ description: 'Идентификатор пользователя' })
  @Expose()
  public id: string;

  @ApiProperty({ description: 'Имя, одно слово, только английские и русские буквы' })
  @Expose()
  public name: string;

  @ApiProperty({ description: 'Уникальный email' })
  @Expose()
  public email: string;

  @ApiPropertyOptional({ description: 'Локальный путь до файла аватара пользователя' })
  @Expose()
  public avatar?: string;

  @ApiProperty({ description: 'Пол', enum: UserGender })
  @Expose()
  public gender: UserGender;

  @ApiPropertyOptional({ description: 'Дата рождения, строка в формате ISO' })
  @Expose()
  public birthdate?: Date;

  @ApiProperty({ description: 'Роль пользователя в системе', enum: UserRole })
  @Expose()
  public role: UserRole;

  @ApiPropertyOptional({ description: 'Описание, текст с общей информацией о пользователе', minLength: UserDescriptionLength.Min, maxLength: UserDescriptionLength.Max })
  @Expose()
  public description?: string;

  @ApiProperty({ description: 'Локация, станция метро', enum: METRO_STATIONS })
  @Expose()
  public location: string;

  @ApiPropertyOptional({ description: 'Локальный путь до файла фонового изображения карточки пользователя' })
  @Expose()
  public pageBackground: string;

  @ApiProperty({ description: 'Уровень физической подготовки', enum: TrainingLevel })
  @Expose()
  public trainingLevel: TrainingLevel;

  @ApiProperty({ description: 'Тип тренировок', enum: TrainingType, isArray: true })
  @Expose()
  public trainingType: TrainingType[];

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.User}": Время на тренировку"`, enum: TrainingDuration })
  @Expose()
  public trainingDuration?: TrainingDuration;

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.User}": Количество калорий для сброса"` })
  @Expose()
  public caloriesTarget?: number;

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.User}": Количество калорий для траты в день"` })
  @Expose()
  public caloriesPerDay?: number;

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.User}": Флаг готовности пользователя к приглашениям на тренировку"` })
  @Expose()
  public isReadyToTraining?: boolean;

  @ApiPropertyOptional({ description: 'Локальные пути до файлов сертификатов тренера' })
  @Expose()
  public certificates?: string[];

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.Trainer}": Текст с описание заслуг тренера` })
  @Expose()
  public merits?: string;

  @ApiPropertyOptional({ description: `Только для роли "${UserRole.Trainer}": Флаг готовности проводить индивидуальные тренировки"` })
  @Expose()
  public isReadyToPersonal?: boolean;

  @ApiPropertyOptional({ description: 'Дата регистрации пользователя' })
  @Expose()
  public createdAt?: Date;

  @ApiPropertyOptional({ description: 'Друзья пользователя' })
  @Expose()
  public friends?: string[];

  @ApiPropertyOptional({ description: 'Подписки пользователя' })
  @Expose()
  public emailSubscribtions?: string[];

  @ApiPropertyOptional({ description: 'Время последней рассылки' })
  @Expose()
  public emailLastDate?: Date;
}
