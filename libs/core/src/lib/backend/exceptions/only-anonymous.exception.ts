import { UserErrorMessage } from '@2299899-fit-friends/consts';
import { ForbiddenException } from '@nestjs/common';

export class OnlyAnonymousException extends ForbiddenException {
  constructor() {
    super(UserErrorMessage.OnlyAnonymous);
  }
}
