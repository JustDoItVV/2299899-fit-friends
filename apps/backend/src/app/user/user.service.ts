import { randomUUID } from 'node:crypto';

import { BackendConfig } from '@2299899-fit-friends/config';
import { UserErrorMessage } from '@2299899-fit-friends/consts';
import {
    CreateUserDto, LoginUserDto, UpdateUserDto, UserPaginationQuery, UserRdo
} from '@2299899-fit-friends/dtos';
import { createJWTPayload, fillDto } from '@2299899-fit-friends/helpers';
import { Pagination, Token, TokenPayload, UserFilesPayload } from '@2299899-fit-friends/types';
import {
    ConflictException, ForbiddenException, Inject, Injectable, InternalServerErrorException,
    NotFoundException, UnauthorizedException
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

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

  public async register(dto: CreateUserDto, files: UserFilesPayload) {
    console.log(dto);
    console.log(files);
    const { email, password } = dto;
    const existedUser = await this.userRepository.findByEmail(email);

    if (existedUser) {
      throw new ConflictException(UserErrorMessage.UserExists);
    }

    const entity = UserEntity.fromDto(dto);
    await entity.setPassword(password)

    for (const key of Object.keys(files)) {
      if (files[key] && files[key].length > 0) {
        const path = await this.uploaderService.saveFile(files[key][0]);
        entity[key] = path;
      }
    }

    const pageBackgroundPath = await this.uploaderService.saveFile(files.pageBackground[0]);
    entity.pageBackground = pageBackgroundPath;

    const document = await this.userRepository.save(entity);
    return document;
  }

  public async update(payload: TokenPayload, id: string, dto: UpdateUserDto, files: UserFilesPayload) {
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

    if (!hasChanges) {
      return user;
    }

    return await this.userRepository.update(id, user);
  }

  public async getAvatar(id: string) {
    const user = await this.getUserById(id);
    return await this.uploaderService.getImageUrl(user.avatar);
  }

  public async getPageBackground(id: string) {
    const user = await this.getUserById(id);
    return await this.uploaderService.getImageUrl(user.pageBackground);
  }

  public async getCertificate(id: string) {
    const user = await this.getUserById(id);
    return await this.uploaderService.getFile(user.certificate);
  }
}
