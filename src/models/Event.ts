import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';
import { KelompokModel, DesaModel, UserModel } from './index';
import { ScopeType, SCOPE_TYPE } from '../utils/constants';

export interface EventAttributes {
  id: number;
  name: string;
  date: Date;
  location?: string;
  scope_type: ScopeType;
  scope_id: number;
  created_by: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type EventCreationAttributes = Optional<EventAttributes, 'id'>;

export class Event
  extends Model<EventAttributes, EventCreationAttributes>
  implements EventAttributes
{
  declare id: number;
  declare name: string;
  declare date: Date;
  declare location?: string;
  declare scope_type: ScopeType;
  declare scope_id: number;
  declare created_by: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Event.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    location: { type: DataTypes.STRING },
    scope_type: {
      type: DataTypes.ENUM(SCOPE_TYPE.DESA, SCOPE_TYPE.KELOMPOK),
      allowNull: false,
    },
    scope_id: { type: DataTypes.INTEGER, allowNull: false },
    created_by: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: 'events', modelName: 'Event' }
);

// 🔗 Relasi ke User (pembuat event)
Event.belongsTo(UserModel, { foreignKey: 'created_by', as: 'creator' });
UserModel.hasMany(Event, { foreignKey: 'created_by', as: 'createdEvents' });

// 🔗 Scope fleksibel
Event.belongsTo(DesaModel, {
  foreignKey: 'scope_id',
  constraints: false,
  as: 'desa',
  scope: { scope_type: SCOPE_TYPE.DESA },
});

Event.belongsTo(KelompokModel, {
  foreignKey: 'scope_id',
  constraints: false,
  as: 'kelompok',
  scope: { scope_type: SCOPE_TYPE.KELOMPOK },
});
