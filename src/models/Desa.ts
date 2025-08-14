// models/desa.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

export interface DesaAttributes {
  id?: number; // optional if auto-increment
  name: string;
  address: string;
}

class Desa extends Model {}

Desa.init(
  {
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
    tableName: 'desa',
    timestamps: true,
    createdAt: 'created_at', // map to snake_case column
    updatedAt: 'updated_at',
  }
);

export default Desa;
