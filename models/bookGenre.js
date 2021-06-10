const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const BookGenre = sequelize.define('bookGenre', {
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  genreId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false,
  freezeTableName: true,
});

module.exports = BookGenre;
