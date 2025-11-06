import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

export interface EventSeriesAttributes {
  id: number;
  series_name: string;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EventSeriesCreationAttributes
  extends Omit<EventSeriesAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class EventSeries
  extends Model<EventSeriesAttributes, EventSeriesCreationAttributes>
  implements EventSeriesAttributes
{
  public id!: number;
  public series_name!: string;
  public description!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EventSeries.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    series_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'event_series',
    timestamps: true,
  }
);
