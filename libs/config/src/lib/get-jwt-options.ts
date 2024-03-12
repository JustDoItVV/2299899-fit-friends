import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export async function getJwtOptions(
  configService: ConfigService
): Promise<JwtModuleOptions> {
  return {
    secret: configService.get<string>('app.accessTokenSecret'),
    signOptions: {
      expiresIn: configService.get<string>('app.accessTokenExpiresIn'),
      algorithm: 'HS256',
    },
  };
}
