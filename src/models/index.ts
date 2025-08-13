import UserModel from './User';
import StudentModel from './Student';
import DesaModel from './Desa';
import KelompokModel from './Kelompok';
import UserDesaModel from './UserDesa';
import UserKelompokModel from './UserKelompok';

// Desa → Kelompok
DesaModel.hasMany(KelompokModel, { foreignKey: 'desa_id' });
KelompokModel.belongsTo(DesaModel, { foreignKey: 'desa_id' });

// Kelompok → Student
KelompokModel.hasMany(StudentModel, { foreignKey: 'kelompok_id' });
StudentModel.belongsTo(KelompokModel, { foreignKey: 'kelompok_id' });

// User ↔ Desa (Many-to-Many)
UserModel.belongsToMany(DesaModel, {
  through: UserDesaModel,
  foreignKey: 'user_id',
});
DesaModel.belongsToMany(UserModel, {
  through: UserDesaModel,
  foreignKey: 'desa_id',
});

// User ↔ Kelompok (Many-to-Many)
UserModel.belongsToMany(KelompokModel, {
  through: UserKelompokModel,
  foreignKey: 'user_id',
});
KelompokModel.belongsToMany(UserModel, {
  through: UserKelompokModel,
  foreignKey: 'kelompok_id',
});

export {
  UserModel,
  StudentModel,
  DesaModel,
  KelompokModel,
  UserDesaModel,
  UserKelompokModel,
};
