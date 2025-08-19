import UserModel from './User';
import StudentModel from './Student';
import DesaModel from './Desa';
import KelompokModel from './Kelompok';
import { Permission } from './Permission';
import { Role } from './Role';
import { RolePermission } from './RolePermission';
import { UserRole } from './UserRole';
import { UserScope } from './UserScope';

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
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permission_id',
});

// User <-> Scope (one-to-many)
UserModel.hasMany(UserScope, { foreignKey: 'user_id', as: 'scopes' });
UserScope.belongsTo(UserModel, { foreignKey: 'user_id' });

// Desa → Kelompok
DesaModel.hasMany(KelompokModel, { foreignKey: 'desa_id' });
KelompokModel.belongsTo(DesaModel, { foreignKey: 'desa_id' });

// Kelompok → Student
KelompokModel.hasMany(StudentModel, { foreignKey: 'kelompok_id' });
StudentModel.belongsTo(KelompokModel, { foreignKey: 'kelompok_id' });

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
};
