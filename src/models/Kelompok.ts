import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';
import { DesaModel } from './index';

export interface KelompokAttributes {
  id?: number; // optional if auto-increment
  desa_id: number;
  name: string;
  address: string;
  Desa?: { id: number; name: string };
}

interface KelompokCreationAttributes
  extends Optional<KelompokAttributes, 'id'> {}

class Kelompok
  extends Model<KelompokAttributes, KelompokCreationAttributes>
  implements KelompokAttributes
{
  public id!: number;
  public name!: string;
  public desa_id!: number;
  public address!: string;
  Desa?: { id: number; name: string } | undefined;
}

Kelompok.init(
  {
    desa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: DesaModel,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'kelompok',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Kelompok;
