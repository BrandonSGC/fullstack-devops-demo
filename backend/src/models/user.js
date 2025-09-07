import { sequelize } from "../db/connection.js";
import { DataTypes } from "sequelize";

export const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "Users",
  }
);
