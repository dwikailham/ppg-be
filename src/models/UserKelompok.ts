// models/userKelompok.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import { UserModel, KelompokModel } from './index';

class UserKelompok extends Model {}

UserKelompok.init(
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
    kelompok_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: KelompokModel,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'user_kelompok',
    timestamps: false,
  }
);

export default UserKelompok;
