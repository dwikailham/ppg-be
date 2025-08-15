import { Sequelize } from 'sequelize';

const db = new Sequelize('ppg', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  timezone: '+07:00', // WIB,
});

export default db;
