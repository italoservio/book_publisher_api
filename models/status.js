const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Status = sequelize.define('status', {
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  timestamps: false,
  freezeTableName: true,
});

module.exports = Status;
