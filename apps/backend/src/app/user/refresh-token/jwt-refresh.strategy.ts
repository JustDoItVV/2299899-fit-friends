import { ExtractJwt, Strategy } from 'passport-jwt';

import { BackendConfig } from '@2299899-fit-friends/config';
import { TokenNotExistsException } from '@2299899-fit-friends/core';
import { RefreshTokenPayload } from '@2299899-fit-friends/types';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { UserService } from '../user.service';
import { RefreshTokenService } from './refresh-token.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh'
) {
  constructor(
    @Inject(BackendConfig.KEY)
    private readonly config: ConfigType<typeof BackendConfig>,
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.refreshTokenSecret,
    });
  }

  public async validate(payload: RefreshTokenPayload) {
    const { email, tokenId } = payload;

    if (!(await this.refreshTokenService.isExists(tokenId))) {
      throw new TokenNotExistsException(tokenId);
    }

    await this.refreshTokenService.deleteByTokenId(tokenId);
    return this.userService.getUserByEmail(email);
  }
}
