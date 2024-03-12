import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenPayload } from '@2299899-fit-friends/types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('app.accessTokenSecret'),
    });
  }

  public async validate(payload: TokenPayload) {
    return payload;
  }
}
