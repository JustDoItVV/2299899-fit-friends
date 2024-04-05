import { TokenPayload, UserRole } from '@2299899-fit-friends/types';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class UserRolesGuard implements CanActivate {
  private readonly roles: UserRole[];

  constructor(roles: UserRole[]) {
    this.roles = roles;
  }

  public canActivate(context: ExecutionContext): boolean {
    if (this.roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: TokenPayload = request.user;

    return this.roles.includes(user.role);
  }
}
