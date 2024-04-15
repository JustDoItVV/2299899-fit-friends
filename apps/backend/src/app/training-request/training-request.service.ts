import { TrainingRequestErrorMessage } from '@2299899-fit-friends/consts';
import {
    CreateTrainingRequestDto, TrainingRequestRdo, TrainingRequestsPaginationQuery,
    UpdateTrainingRequestDto
} from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import {
    Pagination, TrainingRequestStatus, UserGender, UserRole
} from '@2299899-fit-friends/types';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

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

  public async getByQuery(query: TrainingRequestsPaginationQuery): Promise<Pagination<TrainingRequestRdo>> {
    const pagination = await this.trainingRequestRepository.find(query);
    const paginationResult = {
      ...pagination,
      entities: pagination.entities.map((entity) => fillDto(TrainingRequestRdo, entity.toPOJO())),
    };
    return paginationResult;
  }

  public async update(id: string, dto: UpdateTrainingRequestDto, userId: string) {
    const trainingRequest = await this.trainingRequestRepository.findById(id);

    if (!trainingRequest) {
      throw new NotFoundException(TrainingRequestErrorMessage.NotFound);
    }

    if (trainingRequest.targetId !== userId) {
      throw new ForbiddenException(TrainingRequestErrorMessage.UpdateForbidden);
    }

    let hasChanges = false;
    if (dto.status !== undefined && trainingRequest.status !== dto.status) {
      trainingRequest.status = dto.status;
      hasChanges = true;
    }

    if (!hasChanges) {
      return trainingRequest;
    }

    const targetUser = await this.userService.getUserById(trainingRequest.targetId);
    await this.notificationService.createNotification(trainingRequest.authorId, `${
      targetUser.name
    } ${trainingRequest.status === TrainingRequestStatus.Accepted ? 'принял' : ''}${trainingRequest.status === TrainingRequestStatus.Rejected ? 'отклонил' : ''}${
      trainingRequest.status !== TrainingRequestStatus.Consideration && targetUser.gender === UserGender.Female ? 'а' : ''
    } запрос на ${
      targetUser.role === UserRole.Trainer ? 'персональную' : 'совместную'
    } тренировку`);

    return await this.trainingRequestRepository.update(id, trainingRequest);
  }
}
