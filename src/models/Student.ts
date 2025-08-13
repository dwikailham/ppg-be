// models/student.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import { KelompokModel } from './index';

class Student extends Model {}

Student.init(
  {
    kelompok_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: KelompokModel,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('L', 'P'),
      allowNull: true,
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'students',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Student;
