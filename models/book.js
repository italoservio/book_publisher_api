const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Book = sequelize.define('book', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  summary: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  timestamps: false,
  freezeTableName: true,
});

module.exports = Book;
