import { BaseEntity, MailNotification } from '@2299899-fit-friends/types';

export class MailNotificataionEntity implements MailNotification, BaseEntity<string, MailNotification> {
  public id?: string;
  public authorId: string;
  public targetId: string;
  public text: string;
  public createdAt?: Date;

  public populate(data: MailNotification): MailNotificataionEntity {
    this.id = data.id ?? undefined;
    this.authorId = data.authorId;
    this.targetId = data.targetId;
    this.text = data.text;
    this.createdAt = data.createdAt ?? undefined;

    return this;
  }

  public toPOJO(): MailNotification {
    return {
      id: this.id,
      authorId: this.authorId,
      targetId: this.targetId,
      text: this.text,
      createdAt: this.createdAt,
    };
  }

  static fromObject(data: MailNotification): MailNotificataionEntity {
    const entity = new MailNotificataionEntity();
    entity.populate(data);
    return entity;
  }
}
