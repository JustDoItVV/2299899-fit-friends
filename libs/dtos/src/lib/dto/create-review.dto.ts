import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

import { RatingLimit, ReviewErrorMessage, ReviewTextLength } from '@2299899-fit-friends/consts';
import { getDtoMessageCallback } from '@2299899-fit-friends/helpers';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'Рейтинг тренировки', example: 4 })
  @Max(RatingLimit.Max, { message: getDtoMessageCallback(ReviewErrorMessage.RatingMax) })
  @Min(RatingLimit.Min, { message: getDtoMessageCallback(ReviewErrorMessage.RatingMin) })
  @IsNumber({}, { message: getDtoMessageCallback(ReviewErrorMessage.Nan) })
  @IsNotEmpty({ message: getDtoMessageCallback(ReviewErrorMessage.Required) })
  public rating: number;

  @ApiProperty({ description: 'Отзыв на тренировку', example: 'Описание длиной минимум 100 символов снова Описание длиной минимум 100 символов снова Описание длиной минимум 100 символов' })
  @MaxLength(ReviewTextLength.Max, { message: getDtoMessageCallback(ReviewErrorMessage.TextLengthMax) })
  @MinLength(ReviewTextLength.Min, { message: getDtoMessageCallback(ReviewErrorMessage.TextLengthMin) })
  @IsString({ message: getDtoMessageCallback(ReviewErrorMessage.NotString) })
  @IsNotEmpty({ message: getDtoMessageCallback(ReviewErrorMessage.Required) })
  public text: string;
}
