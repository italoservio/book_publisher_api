const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Author = sequelize.define('author', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  familyName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dateOfBirth: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dateOfDeath: {
    type: DataTypes.STRING,
    allowNull: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lifespan: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
}, {
  timestamps: false,
  freezeTableName: true,
});

module.exports = Author;
