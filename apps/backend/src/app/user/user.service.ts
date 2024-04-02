import { randomUUID } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

import { BackendConfig } from '@2299899-fit-friends/config';
import {
    MockTrainingBackgroundPicture, TRAINING_TYPE_LIMIT, UserErrorMessage
} from '@2299899-fit-friends/consts';
import { FilesPayload } from '@2299899-fit-friends/core';
import {
    CreateUserDto, LoginUserDto, PaginationQuery, UpdateUserDto, UserPaginationQuery, UserRdo
} from '@2299899-fit-friends/dtos';
import { createJWTPayload, fillDto } from '@2299899-fit-friends/helpers';
import { Pagination, Token, TokenPayload, UserGender, UserRole } from '@2299899-fit-friends/types';
import {
    BadRequestException, ConflictException, ForbiddenException, Inject, Injectable,
    InternalServerErrorException, NotFoundException, StreamableFile, UnauthorizedException
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { NotificationService } from '../notification/notification.service';
import { UploaderService } from '../uploader/uploader.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly jwtService: JwtService,
    @Inject(BackendConfig.KEY)
    private readonly config: ConfigType<typeof BackendConfig>,
    private readonly uploaderService: UploaderService,
    private readonly notificationService: NotificationService,
  ) {}

  public async createUserToken(user: UserEntity): Promise<Token> {
    const accessTokenPayload = createJWTPayload(user.toPOJO());
    const refreshTokenPayload = {
      ...accessTokenPayload,
      tokenId: randomUUID(),
    };
    await this.refreshTokenService.create(refreshTokenPayload);
    try {
      const accessToken = await this.jwtService.signAsync(accessTokenPayload);
      const refreshToken = await this.jwtService.signAsync(
        refreshTokenPayload,
        {
          secret: this.config.refreshTokenSecret,
          expiresIn: this.config.refreshTokenExpiresIn,
        }
      );
      return { accessToken, refreshToken };
    } catch {
      throw new InternalServerErrorException(
        UserErrorMessage.TokenCreationError
      );
    }
  }

  public async getUserById(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(UserErrorMessage.NotFound);
    }

    return user;
  }

  public async getUserByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(UserErrorMessage.NotFound);
    }

    return user;
  }

  public async getUsersByQuery(query: UserPaginationQuery): Promise<Pagination<UserRdo>> {
    const pagination = await this.userRepository.find(query);
    const paginationResult = {
      ...pagination,
      entities: pagination.entities.map((entity) => fillDto(UserRdo, entity.toPOJO())),
    };
    return paginationResult;
  }

  public async verifyUser(dto: LoginUserDto) {
    const { email, password } = dto;
    const document = await this.userRepository.findByEmail(email);

    if (!document) {
      throw new NotFoundException(UserErrorMessage.NotFound);
    }

    if (!(await document.comparePassword(password))) {
      throw new UnauthorizedException(UserErrorMessage.PasswordWrong);
    }

    return document;
  }

  public async deleteRefreshToken(token: string) {
    const tokenData = await this.jwtService.decode(token);
    await this.refreshTokenService.deleteByTokenId(tokenData.tokenId);
  }

  public async register(dto: CreateUserDto, files: FilesPayload) {
    const { email, password } = dto;
    const existedUser = await this.userRepository.findByEmail(email);

    if (existedUser) {
      throw new ConflictException(UserErrorMessage.UserExists);
    }

    const entity = UserEntity.fromDto(dto);
    await entity.setPassword(password);

    if (!files.pageBackground) {
      const uploadPath = join(this.uploaderService.getUploadDirectory(), this.uploaderService.getSubDirectoryUpload());
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      const pictureNumber = Math.floor(Math.random() * (MockTrainingBackgroundPicture.Count - 1)) + 1;
      const mockPageBackgroundeName = `${MockTrainingBackgroundPicture.Prefix}${pictureNumber}${MockTrainingBackgroundPicture.Suffix}`
      const pageBackgroundName = `${randomUUID()}-${mockPageBackgroundeName}`;
      copyFileSync(join(MockTrainingBackgroundPicture.Directory, mockPageBackgroundeName), join(uploadPath, pageBackgroundName));
      const pageBackground = join(this.uploaderService.getSubDirectoryUpload(), pageBackgroundName);
      entity.pageBackground = pageBackground;
    }

    for (const key of Object.keys(files)) {
      if (files[key] && files[key].length > 0) {
        const path = await this.uploaderService.saveFile(files[key][0]);
        entity[key] = path;
      }
    }

    const document = await this.userRepository.save(entity);
    return document;
  }

  public async update(payload: TokenPayload, id: string, dto: UpdateUserDto, files: FilesPayload) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(UserErrorMessage.NotFound);
    }

    if (user.id !== payload.userId) {
      throw new ForbiddenException(UserErrorMessage.UserUpdateForbidden);
    }

    let hasChanges = false;

    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined && user[key] !== value) {
        user[key] = value;
        hasChanges = true;
      }

      if (files) {
        if (files.avatar && files.avatar.length > 0) {
          if (user.avatar) {
            await this.uploaderService.deleteFile(user.avatar);
          }
          const avatarPath = await this.uploaderService.saveFile(files.avatar[0]);
          user.avatar = avatarPath;
        }

        if (files.pageBackground && files.pageBackground.length > 0) {
          if (user.pageBackground) {
            await this.uploaderService.deleteFile(user.pageBackground);
          }
          const pageBackgroundPath = await this.uploaderService.saveFile(files.pageBackground[0]);
          user.pageBackground = pageBackgroundPath;
        }
      }
    }

    if (user.role === UserRole.Trainer) {
      user.isQuestionnaireFilled = user.trainingLevel &&
        user.trainingType.length === TRAINING_TYPE_LIMIT;
    } else if (user.role === UserRole.User) {
      user.isQuestionnaireFilled = user.trainingLevel &&
        user.trainingType.length <= TRAINING_TYPE_LIMIT &&
        !!user.trainingDuration &&
        !!user.caloriesTarget &&
        !!user.caloriesPerDay;
    }

    if (!hasChanges) {
      return user;
    }

    return await this.userRepository.update(id, user);
  }

  public async getAvatar(id: string): Promise<string> {
    const user = await this.getUserById(id);

    if (!user.avatar) {
      throw new NotFoundException(UserErrorMessage.NoFileUploaded);
    }

    return await this.uploaderService.getImageUrl(user.avatar);
  }

  public async getPageBackground(id: string): Promise<string> {
    const user = await this.getUserById(id);
    return await this.uploaderService.getImageUrl(user.pageBackground);
  }

  public async getCertificate(id: string): Promise<StreamableFile> {
    const user = await this.getUserById(id);

    if (!user.certificate) {
      throw new NotFoundException(UserErrorMessage.NoFileUploaded);
    }

    return await this.uploaderService.getFile(user.certificate);
  }

  public async addToFriends(userId: string, friendId: string): Promise<Pagination<UserRdo>> {
    if (userId === friendId) {
      throw new BadRequestException(UserErrorMessage.UserSelfFriend);
    }

    const friend = await this.getUserById(friendId);
    if (!friend) {
      throw new NotFoundException(UserErrorMessage.NotFound);
    }

    const user = await this.getUserById(userId);
    if (user.friends.includes(friendId)) {
      throw new ConflictException(UserErrorMessage.InFriendsAlready);
    }

    user.friends.push(friendId);
    friend.friends.push(userId);
    await this.userRepository.update(userId, user);
    await this.userRepository.update(friendId, friend);

    await this.notificationService.createNotification(friendId, `${user.name} добавил${user.gender === UserGender.Female ? 'а' : ''} Вас в друзья`);

    const query = new PaginationQuery();
    const pagination = await this.userRepository.findFriends(query, userId);
    const paginationResult = {
      ...pagination,
      entities: pagination.entities.map((entity) => fillDto(UserRdo, entity.toPOJO())),
    };
    return paginationResult;
  }

  public async removeFromFriends(userId: string, friendId: string): Promise<Pagination<UserRdo>> {
    if (userId === friendId) {
      throw new BadRequestException(UserErrorMessage.UserSelfFriend);
    }

    const friend = await this.getUserById(friendId);
    if (!friend) {
      throw new NotFoundException(UserErrorMessage.NotFound);
    }

    const user = await this.getUserById(userId);
    if (!user.friends.includes(friendId)) {
      throw new ConflictException(UserErrorMessage.NotInFriends);
    }

    user.friends.splice(user.friends.indexOf(friendId), 1);
    friend.friends.splice(friend.friends.indexOf(userId), 1);
    await this.userRepository.update(userId, user);
    await this.userRepository.update(friendId, friend);

    const query = new PaginationQuery();
    const pagination = await this.userRepository.findFriends(query, userId);
    const paginationResult = {
      ...pagination,
      entities: pagination.entities.map((entity) => fillDto(UserRdo, entity.toPOJO())),
    };
    return paginationResult;
  }

  public async subscribe(userId: string, targetId: string): Promise<void> {
    if (userId === targetId) {
      throw new BadRequestException(UserErrorMessage.UserSelfSubscriber);
    }

    const targetUser = await this.getUserById(targetId);
    if (!targetUser) {
      throw new NotFoundException(UserErrorMessage.NotFound);
    }

    if (targetUser.role !== UserRole.Trainer) {
      throw new ForbiddenException(UserErrorMessage.SubscribeForbidden)
    }

    const user = await this.getUserById(userId);
    if (user.emailSubscribtions.includes(targetId)) {
      throw new ConflictException(UserErrorMessage.InSubscribtionsAlready);
    }

    user.emailSubscribtions.push(targetId);
    user.emailLastDate = new Date();
    targetUser.subscribers.push(userId);
    await this.userRepository.update(userId, user);
    await this.userRepository.update(targetId, targetUser);
  }

  public async unsubscribe(userId: string, targetId: string): Promise<void> {
    if (userId === targetId) {
      throw new BadRequestException(UserErrorMessage.UserSelfUnsubscriber);
    }

    const targetUser = await this.getUserById(targetId);
    if (!targetUser) {
      throw new NotFoundException(UserErrorMessage.NotFound);
    }

    if (targetUser.role !== UserRole.Trainer) {
      throw new ForbiddenException(UserErrorMessage.SubscribeForbidden)
    }

    const user = await this.getUserById(userId);
    if (!user.emailSubscribtions.includes(targetId)) {
      throw new ConflictException(UserErrorMessage.NotInSubscribtions);
    }

    user.emailSubscribtions.splice(user.emailSubscribtions.indexOf(targetId), 1);
    targetUser.subscribers.splice(targetUser.subscribers.indexOf(userId), 1);
    await this.userRepository.update(userId, user);
    await this.userRepository.update(targetId, targetUser);
  }
}
