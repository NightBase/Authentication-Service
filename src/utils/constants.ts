import dotenv from 'dotenv';
dotenv.config();

export const DATABASE_NAME = 'NightBase-Pawn';

export const ACCOUNT_SERVICE_NAME = 'ACCOUNT_SERVICE';
export const ACCOUNT_QUEUE_NAME = 'NightBase:Account';

export const AUTHENTICATION_SERVICE_NAME = 'AUTHENTICATION_SERVICE';
export const AUTHENTICATION_QUEUE_NAME = 'NightBase:Authentication';

export const BROKERS = [
  `amqp://${process.env.BROKER_HOST}:${process.env.BROKER_PORT}`,
];
