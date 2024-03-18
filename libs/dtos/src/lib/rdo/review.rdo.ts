import { Expose } from 'class-transformer';

export class ReviewRdo {
  @Expose()
  public id: string;

  @Expose()
  public userId: string;

  @Expose()
  public trainingId: string;

  @Expose()
  public rating: number;

  @Expose()
  public text: string;
}
