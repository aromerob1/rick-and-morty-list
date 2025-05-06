// src/models/Comment.model.ts
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import Character from './Character';

interface CommentAttributes {
  id: number;
  characterId: number;
  commentText: string;
}

interface CommentCreationAttributes extends Optional<CommentAttributes, 'id'> {}

class Comment
  extends Model<CommentAttributes, CommentCreationAttributes>
  implements CommentAttributes
{
  public id!: number;
  public characterId!: number;
  public commentText!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    Comment.belongsTo(models.Character, {
      foreignKey: 'characterId',
      as: 'character',
      onDelete: 'CASCADE',
    });
  }
}

export const initCommentModel = (sequelize: Sequelize): typeof Comment => {
  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      characterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Characters',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      commentText: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'Comments',
      sequelize,
      timestamps: true,
    }
  );
  return Comment;
};

export default Comment;
