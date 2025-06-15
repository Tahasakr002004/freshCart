import { DataTypes, Model } from "sequelize";
import sequelize from "../../db/sequelize";

export interface AdminAttributes {
  id?: number;
  adminName: string;
  adminPassword: string;
}

export class Admin extends Model<AdminAttributes> implements AdminAttributes {
  public id!: number;
  public adminName!: string;
  public adminPassword!: string;
}

Admin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    adminName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    adminPassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "admins",
    timestamps: false,
  }
);

export default Admin;
