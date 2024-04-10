import { MailConfig } from '@2299899-fit-friends/config';
import {
    BALANCE_AVAILABLE_MIN, EmailSubject, EmailTemplate, TrainingErrorMessage
} from '@2299899-fit-friends/consts';
import {
    BalancePaginationQuery, BalanceRdo, PaginationQuery, UpdateBalanceDto, UserRdo
} from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { OrderType, Pagination } from '@2299899-fit-friends/types';
import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { OrderEntity } from '../account-trainer/order/order.entity';
import { OrderRepository } from '../account-trainer/order/order.repository';
import { MailNotificationRepository } from '../mail-notification/mail-notification.repository';
import { TrainingRepository } from '../training/training.repository';
import { UserRepository } from '../user/user.repository';
import { BalanceEntity } from './balance/balance.entity';
import { BalanceRepository } from './balance/balance.repository';

@Injectable()
export class AccountUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly trainingRepository: TrainingRepository,
    private readonly balanceRepository: BalanceRepository,
    private readonly orderRepository: OrderRepository,
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

  public async getBalance(query: BalancePaginationQuery, userId: string): Promise<Pagination<BalanceRdo>> {
    const pagination = await this.balanceRepository.find(query, userId);
    const paginationResult = {
      ...pagination,
      entities: pagination.entities.map((entity) => fillDto(BalanceRdo, entity.toPOJO())),
    };
    return paginationResult;
  }

  public async updateBalanceRecord(dto: UpdateBalanceDto, userId: string): Promise<BalanceEntity> {
    const training = await this.trainingRepository.findById(dto.trainingId);
    if (!training) {
      throw new NotFoundException(TrainingErrorMessage.NotFound);
    }

    let balanceRecord = await this.balanceRepository.findByTrainingId(dto.trainingId);

    if (!balanceRecord) {
      const entity = new BalanceEntity();
      entity.populate({
        userId,
        trainingId: dto.trainingId,
        available: BALANCE_AVAILABLE_MIN,
      });
      balanceRecord = await this.balanceRepository.save(entity);
    }

    let hasChanges = false;
    if (dto.available !== undefined && balanceRecord.available !== dto.available) {
      balanceRecord.available = dto.available;
      hasChanges = true;
    }

    if (!hasChanges) {
      return balanceRecord;
    }

    await this.orderRepository.save(new OrderEntity().populate({
      type: OrderType.Subscription,
      trainingId: training.id,
      price: training.price,
      amount: dto.available,
      paymentMethod: dto.paymentMethod,
      orderSum: training.price * dto.available,
      training,
    }));
    return await this.balanceRepository.update(balanceRecord.id, balanceRecord);
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
