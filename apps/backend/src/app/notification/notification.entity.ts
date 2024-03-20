import { BaseEntity, Notification } from '@2299899-fit-friends/types';

export class NotificationEntity implements Notification, BaseEntity<string, Notification> {
  public id?: string;
  public sentDate: Date;
  public userId: string;
  public text: string;
  public createdAt?: Date;

  public populate(data: Notification): NotificationEntity {
    this.id = data.id ?? undefined;
    this.sentDate = data.sentDate;
    this.userId = data.userId;
    this.text = data.text;
    this.createdAt = data.createdAt ?? undefined;

    return this;
  }

  public toPOJO(): Notification {
    return {
      id: this.id,
      sentDate: this.sentDate,
      userId: this.userId,
      text: this.text,
      createdAt: this.createdAt,
    };
  }

  static fromObject(data: Notification): NotificationEntity {
    return new NotificationEntity().populate(data);
  }
}
