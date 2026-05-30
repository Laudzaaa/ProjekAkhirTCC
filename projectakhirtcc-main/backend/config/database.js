import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const cloudSqlConnectionName = process.env.CLOUD_SQL_CONNECTION_NAME;
const socketPath = process.env.DB_SOCKET_PATH || (cloudSqlConnectionName ? `/cloudsql/${cloudSqlConnectionName}` : null);

const sequelizeOptions = {
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

if (socketPath) {
  sequelizeOptions.dialectOptions = {
    socketPath,
  };
} else {
  sequelizeOptions.host = process.env.DB_HOST;
  sequelizeOptions.port = process.env.DB_PORT || 3306;
}

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  sequelizeOptions
);

export default db;
