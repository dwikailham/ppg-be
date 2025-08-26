import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';
import { Role } from './Role';
import { Permission } from './Permission';

export class RolePermission extends Model {
  declare role_id: number;
  declare permission_id: number;
}

RolePermission.init(
  {
    role_id: { type: DataTypes.INTEGER, allowNull: false },
    permission_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: 'role_permissions' }
);

RolePermission.belongsTo(Role, { foreignKey: 'role_id' });
RolePermission.belongsTo(Permission, { foreignKey: 'permission_id' });
