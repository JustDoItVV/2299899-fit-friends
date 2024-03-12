import { UnauthorizedException } from '@nestjs/common';

export class TokenNotExistsException extends UnauthorizedException {
  constructor(tokenId: string) {
    super(`${tokenId}: token with this id doesn't exist`);
  }
}
