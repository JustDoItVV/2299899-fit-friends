import { Balance, BaseEntity } from '@2299899-fit-friends/types';

export class BalanceEntity implements Balance, BaseEntity<string, Balance> {
  public id?: string;
  public userId: string;
  public trainingId: string;
  public available: number;
  public createdAt?: Date;

  public populate(data: Balance): BalanceEntity {
    this.id = data.id ?? undefined;
    this.userId = data.userId;
    this.trainingId = data.trainingId;
    this.available = data.available;
    this.createdAt = data.createdAt ?? undefined;

    return this;
  }

  public toPOJO(): Balance {
    return {
      id: this.id,
      userId: this.userId,
      trainingId: this.trainingId,
      available: this.available,
      createdAt: this.createdAt,
    };
  }

  static fromObject(data: Balance): BalanceEntity {
    const entity = new BalanceEntity();
    entity.populate(data);
    return entity;
  }
}
