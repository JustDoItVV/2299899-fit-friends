import {
    CreateTrainingRequestDto, PaginationQuery, TrainingRequestRdo
} from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { Pagination, UserGender, UserRole } from '@2299899-fit-friends/types';
import { Injectable } from '@nestjs/common';

import { NotificationService } from '../notification/notification.service';
import { UserService } from '../user/user.service';
import { TrainingRequestEntity } from './training-request.entity';
import { TrainingRequestRepository } from './training-request.repository';

@Injectable()
export class TrainingRequestService {
  constructor(
    private readonly trainingRequestRepository: TrainingRequestRepository,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  public async create(dto: CreateTrainingRequestDto, userId: string): Promise<TrainingRequestEntity> {
    const author = await this.userService.getUserById(userId);
    const targetUser = await this.userService.getUserById(dto.targetId);
    const entity = TrainingRequestEntity.fromDto(dto, userId);
    const document = await this.trainingRequestRepository.save(entity);
    entity.id = document.id;

    await this.notificationService.createNotification(dto.targetId, `${
      author.name
    } создал${
      author.gender === UserGender.Female ? 'а' : ''
    } запрос на ${
      targetUser.role === UserRole.Trainer ? 'персональную' : 'совместную'
    } тренировку`);

    return entity;
  }

  public async getByQuery(query: PaginationQuery, userId: string): Promise<Pagination<TrainingRequestRdo>> {
    const pagination = await this.trainingRequestRepository.find(query, userId);
    const paginationResult = {
      ...pagination,
      entities: pagination.entities.map((entity) => fillDto(TrainingRequestRdo, entity.toPOJO())),
    };
    return paginationResult;
  }
}
