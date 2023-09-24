import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Account extends Model {
  @Column
  declare username: string;

  @Column
  declare password: string;

  @Column
  declare email: string;

  @Column
  declare isRoot: boolean;
}
