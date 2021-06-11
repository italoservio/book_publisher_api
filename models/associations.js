const BookAuthor = require('./bookAuthor');
const BookGenre = require('./bookGenre');
const Book = require('./book');
const Author = require('./author');
const Genre = require('./genre');
const Status = require('./status');
const Instance = require('./instance');

Author.hasMany(BookAuthor);

Genre.hasMany(BookGenre);

Book.hasMany(BookAuthor);
Book.hasMany(BookGenre);

Status.hasMany(Instance);

BookAuthor.belongsTo(Book, { foreignKey: 'bookId' });
BookAuthor.belongsTo(Author, { foreignKey: 'authorId' });

BookGenre.belongsTo(Book, { foreignKey: 'bookId' });
BookGenre.belongsTo(Genre, { foreignKey: 'genreId' });

Instance.belongsTo(Status, { foreignKey: 'statusId' });
Instance.belongsTo(Book, { foreignKey: 'bookId' });

module.exports = {
  Author,
  Genre,
  Book,
  BookAuthor,
  BookGenre,
  Status,
  Instance
}
