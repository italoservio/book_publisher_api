const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Genre = sequelize.define('genre', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  timestamps: false,
  freezeTableName: true,
});

module.exports = Genre;
