import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Account/User')
@Controller('account/user')
export class AccountUserController {}
