import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();


const sequelize = new Sequelize(
  process.env.PG_DATABASE!,
  process.env.PG_USERNAME!,
  process.env.PG_PASSWORD!,
  {
    host: process.env.PG_HOST || 'freshcart-postgres',
    dialect: 'postgres',
    logging: false,
  }
);

sequelize.sync({ alter: true })
  .then(() => console.log("Database synced and Tabled Created"))
  .catch(err => console.error("Erro syncing database:", err));

export default sequelize;