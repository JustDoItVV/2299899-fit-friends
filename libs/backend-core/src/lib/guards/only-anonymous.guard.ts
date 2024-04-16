import { BackendConfig } from '@2299899-fit-friends/config';
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { OnlyAnonymousException } from '../exceptions/only-anonymous.exception';

@Injectable()
export class OnlyAnonymousGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(BackendConfig.KEY)
    private readonly config: ConfigType<typeof BackendConfig>
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.config.accessTokenSecret,
      });
    } catch {
      return true;
    }

    throw new OnlyAnonymousException(`${type} ${token}`);
  }
}
