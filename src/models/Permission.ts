import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';

export class Permission extends Model {
  declare id: number;
  declare permission_name: string;
}

Permission.init(
  {
    permission_name: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  { sequelize, tableName: 'permissions' }
);
