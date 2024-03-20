import { NotificationErrorMessage, NOTIFICATIONS_LIMIT } from '@2299899-fit-friends/consts';
import { NotificationRdo, PaginationQuery } from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async getUsersNotifications(userId: string): Promise<NotificationRdo[]> {
    const query = new PaginationQuery();
    query.limit = NOTIFICATIONS_LIMIT;
    const pagination = await this.notificationRepository.find(query, userId);
    return pagination.entities.map((entity) => fillDto(NotificationRdo, entity.toPOJO()));
  }

  public async delete(id: string, userId: string): Promise<void> {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new NotFoundException(NotificationErrorMessage.NotFound);
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException(NotificationErrorMessage.Forbidden);
    }

    await this.notificationRepository.deleteById(id);
  }
}
