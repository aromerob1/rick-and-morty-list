import { Sequelize } from 'sequelize';
import { initCharacterModel } from './Character';
import { initCommentModel } from './Comment';
import sequelizeInstance from '../db/connection';

const db = {
  sequelize: sequelizeInstance,
  Sequelize,
  Character: initCharacterModel(sequelizeInstance),
  Comment: initCommentModel(sequelizeInstance),
};

Object.values(db).forEach((model: any) => {
  if (model.associate) {
    model.associate(db);
  }
});

export default db;
