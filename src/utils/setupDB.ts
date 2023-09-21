import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import { DATABASE_NAME } from './constants';

dotenv.config();

const dbName = DATABASE_NAME;

const sequelize = new Sequelize({
  database: 'postgres', // Connect to the 'postgres' database first
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  dialect: 'postgres',
  logging: false,
});

// Create the database if it doesn't exist
sequelize
  .query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`)
  .then(([results]) => {
    if (!results.length) {
      return sequelize.query(`CREATE DATABASE "${dbName}"`);
    }
  })
  .then(() => {
    console.log(`Database '${dbName}' created or already exists.`);
  })
  .catch((err) => {
    console.error('Error creating database:', err);
  })
  .finally(() => {
    sequelize.close();
  });
