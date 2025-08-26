import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';
import UserModel from './User';
import { Role } from './Role';

export class UserRole extends Model {
  declare user_id: number;
  declare role_id: number;
}

UserRole.init(
  {
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    role_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: 'user_roles' }
);

UserRole.belongsTo(UserModel, { foreignKey: 'user_id' });
UserRole.belongsTo(Role, { foreignKey: 'role_id' });
