import { Account } from '@/api/common/Database/Models/account.model';
import { SessionData } from '@/utils/global';
import { Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

export class AuthZPermission {
  constructor(
    @Inject(SessionData) private sessionData: SessionData,
    @InjectModel(Account) private readonly accountModel,
  ) {}

  async hasRootPermission(token: string) {
    const session = this.sessionData.getSession(token);
    if (!session) return false;

    const user = await this.accountModel.findOne({
      where: {
        username: session.value.username,
        isRoot: true,
      },
    });
    if (!user) return false;
    return true;
  }
}
