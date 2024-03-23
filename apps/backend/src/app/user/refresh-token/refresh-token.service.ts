import dayjs from 'dayjs';

import { BackendConfig } from '@2299899-fit-friends/config';
import { parseTime } from '@2299899-fit-friends/helpers';
import { RefreshTokenPayload } from '@2299899-fit-friends/types';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { RefreshTokenEntity } from './refresh-token.entity';
import { RefreshTokenRepository } from './refresh-token.repository';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    @Inject(BackendConfig.KEY)
    private readonly config: ConfigType<typeof BackendConfig>
  ) {}

  public async create(payload: RefreshTokenPayload) {
    const timeValue = parseTime(this.config.refreshTokenExpiresIn);
    const refreshToken = new RefreshTokenEntity({
      tokenId: payload.tokenId,
      userId: payload.userId,
      expiresIn: dayjs().add(timeValue.value, timeValue.unit).toDate(),
    });
    return this.refreshTokenRepository.save(refreshToken);
  }

  public async isExists(tokenId: string): Promise<boolean> {
    const refreshToken = await this.refreshTokenRepository.findByTokenId(tokenId);
    return refreshToken !== null;
  }

  public async deleteByTokenId(tokenId: string) {
    await this.refreshTokenRepository.deleteExpired();
    return this.refreshTokenRepository.deleteByTokenId(tokenId);
  }
}
