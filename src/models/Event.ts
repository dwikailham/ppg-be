import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';
import { KelompokModel, DesaModel, UserModel } from './index';
import { ScopeType, SCOPE_TYPE } from '../utils/constants';

export interface EventAttributes {
  id: number;
  series_id: number;
  event_date: Date;
  location?: string | null;
  scope_type: ScopeType;
  scope_id: number;
  created_by: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EventCreationAttributes
  extends Omit<EventAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Event
  extends Model<EventAttributes, EventCreationAttributes>
  implements EventAttributes
{
  public id!: number;
  public series_id!: number;
  public event_date!: Date;
  public location!: string | null;
  public scope_type!: ScopeType;
  public scope_id!: number;
  public created_by!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    series_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'event_series', key: 'id' },
    },
    event_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    scope_type: {
      type: DataTypes.ENUM(SCOPE_TYPE.DESA, SCOPE_TYPE.KELOMPOK),
      allowNull: false,
    },
    scope_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_by: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    tableName: 'events',
    timestamps: true,
  }
);

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
