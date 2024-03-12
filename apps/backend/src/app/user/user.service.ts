import { randomUUID } from 'node:crypto';

import { BackendConfig } from '@2299899-fit-friends/config';
import { UserErrorMessage } from '@2299899-fit-friends/consts';
import { LoginUserDto } from '@2299899-fit-friends/dtos';
import { createJWTPayload } from '@2299899-fit-friends/helpers';
import { Token } from '@2299899-fit-friends/types';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

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
    private readonly config: ConfigType<typeof BackendConfig>
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

  public async getUserByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(UserErrorMessage.NotFound);
    }

    return user;
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
}
