import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';

export class Role extends Model {
  declare id: number;
  declare role_name: string;
}

Role.init(
  {
    role_name: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  {
    sequelize,
    tableName: 'roles',
    timestamps: true, // enables auto update
    createdAt: 'created_at', // map to snake_case column
    updatedAt: 'updated_at',
  }
);
