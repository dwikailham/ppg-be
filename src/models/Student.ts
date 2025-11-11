// models/student.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';
import { KelompokModel } from './index';
export interface StudentAttributes {
  id?: number; // optional if auto-increment
  kelompok_id: number;
  name: string;
  address: string;
  gender: string;
  birth_date: string;
  phone: string;
  Kelompok?: { id: number; name: string; Desa: { id: number; name: string } };
}

interface StudentCreationAttributes extends Optional<StudentAttributes, 'id'> {}

class Student
  extends Model<StudentAttributes, StudentCreationAttributes>
  implements StudentAttributes
{
  public id!: number;
  public name!: string;
  public kelompok_id!: number;
  public address!: string;
  public gender!: string;
  public birth_date!: string;
  public phone!: string;
  public Kelompok?:
    | { id: number; name: string; Desa: { id: number; name: string } }
    | undefined;
}

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
