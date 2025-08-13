// models/kelompok.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import { DesaModel } from './index';

class Kelompok extends Model {}

Kelompok.init(
  {
    desa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: DesaModel,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'kelompok',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Kelompok;
