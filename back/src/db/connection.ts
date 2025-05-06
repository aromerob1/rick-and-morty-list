import { Sequelize } from 'sequelize';
import {
  DB,
  USER,
  PASSWORD,
  HOST,
  PORT,
  dialect,
  pool,
} from '../config/db.config';
import { ENV } from '../config/environments';

const sequelize = new Sequelize(DB, USER, PASSWORD, {
  host: HOST,
  port: PORT,
  dialect: dialect,
  pool: pool,
  logging: ENV.NODE_ENV === 'development' ? console.log : true,
});

export default sequelize;
