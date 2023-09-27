import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript';

import { Database } from './database.model';

@Table
export class Role extends Model {
  @Column
  declare name: string;

  @ForeignKey(() => Permission)
  @Column
  declare permissionId: number;

  @ForeignKey(() => Database)
  @Column
  declare databaseId: number;

  @BelongsTo(() => Permission)
  declare permission: Permission[];

  @BelongsTo(() => Database)
  declare database: Database;
}

@Table({ timestamps: false })
export class Permission extends Model {
  @Column
  declare name: string;

  @Column
  declare description: string;

  @Column
  declare alias: string;
}
