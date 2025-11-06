import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';
import { UserModel, Event, StudentModel } from './index';
import { STATUS_ATTENDANCE, StatusAttendance } from '../utils/constants';

export interface AbsensiAttributes {
  id: number;
  event_id: number;
  student_id: number;
  status: StatusAttendance;
  checked_by: number;
  checked_at: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type AbsensiCreationAttributes = Optional<AbsensiAttributes, 'id'>;

export class Absensi
  extends Model<AbsensiAttributes, AbsensiCreationAttributes>
  implements AbsensiAttributes
{
  declare id: number;
  declare event_id: number;
  declare student_id: number;
  declare status: StatusAttendance;
  declare checked_by: number;
  declare checked_at: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Absensi.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    event_id: { type: DataTypes.INTEGER, allowNull: false },
    student_id: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM(
        STATUS_ATTENDANCE.HADIR,
        STATUS_ATTENDANCE.SAKIT,
        STATUS_ATTENDANCE.IZIN,
        STATUS_ATTENDANCE.ALPHA
      ),
      allowNull: false,
      defaultValue: STATUS_ATTENDANCE.ALPHA,
    },
    checked_by: { type: DataTypes.INTEGER, allowNull: false },
    checked_at: { type: DataTypes.DATE, allowNull: false },
  },
  { sequelize, tableName: 'absensi', modelName: 'Absensi' }
);

// Event ↔ Absensi
Event.hasMany(Absensi, { foreignKey: 'event_id', as: 'absensis' });
Absensi.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });

// Student ↔ Absensi
StudentModel.hasMany(Absensi, { foreignKey: 'student_id', as: 'absensis' });
Absensi.belongsTo(StudentModel, { foreignKey: 'student_id', as: 'student' });

// User ↔ Absensi (petugas absensi)
UserModel.hasMany(Absensi, { foreignKey: 'checked_by', as: 'checkedAbsensis' });
Absensi.belongsTo(UserModel, { foreignKey: 'checked_by', as: 'checker' });
