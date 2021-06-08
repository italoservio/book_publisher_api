const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database/database.sqlite'
});

// Sync database:
// (async () => { await sequelize.sync() })();

module.exports = sequelize;
