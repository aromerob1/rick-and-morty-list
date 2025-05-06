import { Sequelize } from 'sequelize';
import { initCharacterModel } from './Character';
import sequelizeInstance from '../db/connection';

const db = {
  sequelize: sequelizeInstance,
  Sequelize,
  Character: initCharacterModel(sequelizeInstance),
};

export default db;
