// models/userDesa.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import { DesaModel, UserModel } from './index';

class UserDesa extends Model {}

UserDesa.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    desa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: DesaModel,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'user_desa',
    timestamps: false,
  }
);

export default UserDesa;
