import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';
import { STATUS_ATTENDANCE, StatusAttendance } from '../utils/constants';

export interface AttendanceAttributes {
  id: number;
  event_id: number;
  student_id: number;
  status: StatusAttendance;
  notes?: string | null;
  checked_by: number;
  checked_at?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type AbsensiCreationAttributes = Optional<
  AttendanceAttributes,
  'id' | 'notes' | 'checked_at'
>;

export class Attendance
  extends Model<AttendanceAttributes, AbsensiCreationAttributes>
  implements AttendanceAttributes
{
  declare id: number;
  declare event_id: number;
  declare student_id: number;
  declare status: StatusAttendance;
  declare notes: string | null;
  declare checked_by: number;
  declare checked_at: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Attendance.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: 'events',
        key: 'id',
      },
    },
    student_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'students',
        key: 'id',
      },
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
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
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    checked_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    checked_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: 'attendances',
    modelName: 'Attendance',
    underscored: true,
    timestamps: true,
  }
);
