import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';
import { DesaModel, KelompokModel } from './index';

export class UserScope extends Model {
  declare user_id: number;
  declare scoped_entity_type: 'DESA' | 'KELOMPOK';
  declare scoped_entity_id: number;
}

UserScope.init(
  {
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    scoped_entity_type: {
      type: DataTypes.ENUM('DESA', 'KELOMPOK'),
      allowNull: false,
    },
    scoped_entity_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: 'user_scopes' }
);

UserScope.belongsTo(DesaModel, {
  foreignKey: 'scoped_entity_id',
  constraints: false,
  as: 'desa',
});

UserScope.belongsTo(KelompokModel, {
  foreignKey: 'scoped_entity_id',
  constraints: false,
  as: 'kelompok',
});
