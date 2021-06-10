const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const BookAuthor = sequelize.define('bookAuthor', {
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false,
  freezeTableName: true,
});

module.exports = BookAuthor;
