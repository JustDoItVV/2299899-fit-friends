import { Expose } from 'class-transformer';

import { TrainingDuration, TrainingLevel, TrainingType } from '@2299899-fit-friends/types';
import { ApiProperty } from '@nestjs/swagger';

export class TrainingRdo {
  @ApiProperty({ description: 'Идентификатор тренировки' })
  @Expose()
  public id: string;

  @ApiProperty({ description: 'Название тренировки' })
  @Expose()
  public title: string;

  @ApiProperty({ description: 'Фоновое изображение' })
  @Expose()
  public backgroundPicture: string;

  @ApiProperty({ description: 'Уровень физической подготовки пользователя, на которого рассчитана тренировка' })
  @Expose()
  public level: TrainingLevel;

  @ApiProperty({ description: 'Тип тренировки' })
  @Expose()
  public type: TrainingType;

  @ApiProperty({ description: 'Продолжительность тренировки' })
  @Expose()
  public duration: TrainingDuration;

  @ApiProperty({ description: 'Цена тренировки' })
  @Expose()
  public price: number;

  @ApiProperty({ description: 'Калории' })
  @Expose()
  public calories: number;

  @ApiProperty({ description: 'Описание тренировки' })
  @Expose()
  public description: string;

  @ApiProperty({ description: 'Пол пользователей, на которых рассчитана тренировка' })
  @Expose()
  public gender: string;

  @ApiProperty({ description: 'Видео тренировки' })
  @Expose()
  public video: string;

  @ApiProperty({ description: 'Рейтинг тренировки' })
  @Expose()
  public rating: number;

  @ApiProperty({ description: 'Идентификатор автора тренировки' })
  @Expose()
  public userId: string;

  @ApiProperty({ description: 'Флаг специального предложения' })
  @Expose()
  public isSpecialOffer: boolean;

}
