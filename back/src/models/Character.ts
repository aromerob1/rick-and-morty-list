import { Model, DataTypes, Sequelize } from 'sequelize';

interface CharacterAttributes {
  id: number;
  name: string;
  status: string;
  species: string;
  type?: string;
  gender: string;
  originName?: string;
  locationName?: string;
  image: string;
  occupation?: string;
  starred: boolean;
}

class Character
  extends Model<CharacterAttributes>
  implements CharacterAttributes
{
  public id!: number;
  public name!: string;
  public status!: string;
  public species!: string;
  public type!: string;
  public gender!: string;
  public originName!: string;
  public locationName!: string;
  public image!: string;
  public occupation!: string;
  public starred!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initCharacterModel = (sequelize: Sequelize): typeof Character => {
  Character.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
      },
      species: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING,
      },
      originName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'origin_name',
      },
      locationName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'location_name',
      },
      image: {
        type: DataTypes.STRING,
      },
      starred: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'Characters',
      sequelize,
      timestamps: true,
    }
  );
  return Character;
};

export default Character;
