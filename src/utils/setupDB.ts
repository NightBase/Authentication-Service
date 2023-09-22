import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import { DATABASE_NAME } from './constants';

import { Permission } from '../api/v1/Database/Models/role.model';

dotenv.config();

const dbName = DATABASE_NAME;

async function createDatabase() {
  const sequelize = new Sequelize({
    database: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    dialect: 'postgres',
    logging: false,
  });
  const isDbExists = await sequelize.query(
    `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`,
  );
  if (!isDbExists[0].length) {
    await sequelize.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Database '${dbName}' created.`);
  } else {
    console.log(`Database '${dbName}' already exists.`);
  }
  await sequelize.close();
}

async function insertPreData() {
  const sequelize = new Sequelize({
    database: dbName,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    dialect: 'postgres',
    logging: false,
  });
  sequelize.addModels([Permission]);
  await sequelize.sync({ alter: true });
  await Permission.destroy({ truncate: true });
  await Permission.bulkCreate([
    {
      name: 'Read',
      description: 'To read data from the database',
      alias: 'READ',
    },
    {
      name: 'Write',
      description: 'To write data to the database',
      alias: 'WRITE',
    },
    {
      name: 'Update',
      description: 'To update data in the database',
      alias: 'UPDATE',
    },
    {
      name: 'Delete Data',
      description: 'To delete data from the database',
      alias: 'DELETE',
    },
    {
      name: 'Create Table',
      description: 'To create a new table in the database',
      alias: 'CREATE_TABLE',
    },
    {
      name: 'Drop Table',
      description: 'To drop a table from the database',
      alias: 'DROP_TABLE',
    },
  ]);
  console.log('Predefined data inserted.');
  await sequelize.close();
}

async function setupDB() {
  await createDatabase();
  await insertPreData();
}

setupDB();
