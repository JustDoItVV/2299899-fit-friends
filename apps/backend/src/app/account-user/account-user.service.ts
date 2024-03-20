import { MailConfig } from '@2299899-fit-friends/config';
import { EmailSubject, EmailTemplate } from '@2299899-fit-friends/consts';
import { PaginationQuery, UserRdo } from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { Pagination } from '@2299899-fit-friends/types';
import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { MailNotificationRepository } from '../mail-notification/mail-notification.repository';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AccountUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailNotificationRepository: MailNotificationRepository,
    private readonly mailerService: MailerService,
    @Inject(MailConfig.KEY) private readonly mailConfig: ConfigType<typeof MailConfig>,
  ) {}

  public async getUserFriends(query: PaginationQuery, userId: string): Promise<Pagination<UserRdo>> {
    const pagination = await this.userRepository.findFriends(query, userId);
    const paginationResult = {
      ...pagination,
      entities: pagination.entities.map((entity) => fillDto(UserRdo, entity.toPOJO())),
    };
    return paginationResult;
  }

  public async sendNewTrainingsMailNotifications(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    const newNotifications = await this.mailNotificationRepository.findByCreatedAt(user.emailLastDate);

    for (const trainerId of user.emailSubscribtions) {
      const trainer = await this.userRepository.findById(trainerId);
      const notifications = newNotifications.filter((notification) => notification.authorId === trainerId);

      if (notifications.length) {
        await this.mailerService.sendMail({
          from: this.mailConfig.mail.from,
          to: user.email,
          subject: EmailSubject.NewTrainings,
          template: EmailTemplate.NewTrainings,
          context: {
            userName: user.name,
            trainerName: trainer.name,
            notifications,
          },
        });
      }
    }

    user.emailLastDate = new Date();
    await this.userRepository.update(userId, user);
  }
}
