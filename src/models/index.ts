import UserModel from './User';
import StudentModel from './Student';
import DesaModel from './Desa';
import KelompokModel from './Kelompok';
import { Permission } from './Permission';
import { Role } from './Role';
import { RolePermission } from './RolePermission';
import { UserRole } from './UserRole';
import { UserScope } from './UserScope';
import { Event } from './Event';
import { EventSeries } from './EventSeries';
import { Attendance } from './Attendance';

// User <-> Role (many-to-many)
UserModel.belongsToMany(Role, {
  through: UserRole,
  foreignKey: 'user_id',
  as: 'roles',
});
Role.belongsToMany(UserModel, { through: UserRole, foreignKey: 'role_id' });

// Role <-> Permission (many-to-many)
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: 'role_id',
  as: 'permissions',
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permission_id',
});

// User <-> Scope
UserModel.hasMany(UserScope, { foreignKey: 'user_id', as: 'scopes' });
UserScope.belongsTo(UserModel, { foreignKey: 'user_id' });

// Desa <-> Kelompok
DesaModel.hasMany(KelompokModel, { foreignKey: 'desa_id', as: 'kelompoks' });
KelompokModel.belongsTo(DesaModel, { foreignKey: 'desa_id', as: 'desa' });

// Kelompok <-> Student
KelompokModel.hasMany(StudentModel, { foreignKey: 'kelompok_id' });
StudentModel.belongsTo(KelompokModel, {
  foreignKey: 'kelompok_id',
  as: 'kelompok',
});

// Event <-> EventSeries
EventSeries.hasMany(Event, { as: 'events', foreignKey: 'series_id' });
Event.belongsTo(EventSeries, { as: 'series', foreignKey: 'series_id' });

// Event <-> User
Event.belongsTo(UserModel, { as: 'creator', foreignKey: 'created_by' });
UserModel.hasMany(Event, { foreignKey: 'created_by', as: 'createdEvents' });

// Event ↔ Attendance
Event.hasMany(Attendance, { foreignKey: 'event_id', as: 'attendances' });
Attendance.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });

// Student ↔ Attendance
StudentModel.hasMany(Attendance, {
  foreignKey: 'student_id',
  as: 'attendances',
});
Attendance.belongsTo(StudentModel, { foreignKey: 'student_id', as: 'student' });

// User ↔ Attendance (petugas Attendance)
UserModel.hasMany(Attendance, {
  foreignKey: 'checked_by',
  as: 'checkedAbsensis',
});
Attendance.belongsTo(UserModel, { foreignKey: 'checked_by', as: 'checker' });

export {
  UserModel,
  StudentModel,
  DesaModel,
  KelompokModel,
  Role,
  Permission,
  RolePermission,
  UserRole,
  UserScope,
  Event,
  EventSeries,
  Attendance,
};
