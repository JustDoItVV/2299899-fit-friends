import { BasePostgresRepository } from '@2299899-fit-friends/backend-core';
import { PrismaClientService } from '@2299899-fit-friends/models';
import { MailNotification, SortDirection } from '@2299899-fit-friends/types';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { MailNotificataionEntity } from './mail-notification.entity';

@Injectable()
export class MailNotificationRepository extends BasePostgresRepository<
  MailNotificataionEntity,
  MailNotification
> {
  constructor(protected readonly clientService: PrismaClientService) {
    super(clientService, MailNotificataionEntity.fromObject);
  }

  public async save(
    entity: MailNotificataionEntity
  ): Promise<MailNotificataionEntity> {
    const pojoEntity = entity.toPOJO();
    const document = await this.clientService.mailNotification.create({
      data: pojoEntity,
    });
    entity.id = document.id;
    return entity;
  }

  public async findByCreatedAt(
    dateAfter: Date
  ): Promise<MailNotificataionEntity[]> {
    const where: Prisma.MailNotificationWhereInput = {
      createdAt: { gt: dateAfter },
    };
    const orderBy: Prisma.MailNotificationOrderByWithRelationAndSearchRelevanceInput[] =
      [{ createdAt: SortDirection.Desc }];
    const documents = await this.clientService.mailNotification.findMany({
      where,
      orderBy,
    });
    return documents.map((document) => this.createEntityFromDocument(document));
  }
}
