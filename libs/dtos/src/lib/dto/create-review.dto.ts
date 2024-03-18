import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

import { RatingLimit, ReviewTextLength } from '@2299899-fit-friends/consts';

export class CreateReviewDto {
  @Max(RatingLimit.Max)
  @Min(RatingLimit.Min)
  @IsNumber()
  @IsNotEmpty()
  public rating: number;

  @MaxLength(ReviewTextLength.Max)
  @MinLength(ReviewTextLength.Min)
  @IsString()
  @IsNotEmpty()
  public text: string;
}
