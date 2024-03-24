import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

import { RatingLimit, ReviewTextLength } from '@2299899-fit-friends/consts';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'Рейтинг тренировки', example: 4 })
  @Max(RatingLimit.Max)
  @Min(RatingLimit.Min)
  @IsNumber()
  @IsNotEmpty()
  public rating: number;

  @ApiProperty({
    description: 'Отзыв на тренировку',
    example: 'Описание длиной минимум 100 символов снова Описание длиной минимум 100 символов снова Описание длиной минимум 100 символов',
    minLength: ReviewTextLength.Min,
    maxLength: ReviewTextLength.Max,
  })
  @MaxLength(ReviewTextLength.Max)
  @MinLength(ReviewTextLength.Min)
  @IsString()
  @IsNotEmpty()
  public text: string;
}
