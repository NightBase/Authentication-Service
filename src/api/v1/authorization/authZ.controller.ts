import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AuthZPermission } from './permission/permission.service';

@Controller('v1/user')
export class AuthZController {
  constructor(private readonly permissionService: AuthZPermission) {}

  @MessagePattern('NB-Auth:HasRootPermission')
  async createAccountHandler(token: string) {
    return await this.permissionService.hasRootPermission(token);
  }
}
