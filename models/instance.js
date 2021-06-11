const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Instance = sequelize.define('instance', {
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  statusId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  imprint: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dueDate: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: false,
  freezeTableName: true,
});

module.exports = Instance;
