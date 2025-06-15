import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();


const sequelize = new Sequelize('fresh-cart', process.env.PG_USERNAME || '', process.env.PG_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

export default sequelize;