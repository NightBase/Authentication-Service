import {
  Column,
  Model,
  Table,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Account } from './account.model';

@Table
export class RefreshToken extends Model {
  @Column
  declare token: string;

  @Column
  declare refreshToken: string;

  @ForeignKey(() => Account)
  @Column
  declare accountId: number;

  @BelongsTo(() => Account)
  declare account: Account;
}
