import Sequelize from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    // For a production environment with should use SSL, but in this case we
    // disable it because this is just part of my learning process on DevOps.
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }
);
