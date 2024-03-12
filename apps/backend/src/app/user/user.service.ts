import { UserErrorMessage } from '@2299899-fit-friends/consts';
import { LoginUserDto } from '@2299899-fit-friends/dtos';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

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
}
