const BookAuthor = require('./bookAuthor');
const BookGenre = require('./bookGenre');
const Book = require('./book');
const Author = require('./author');
const Genre = require('./genre');

Author.hasMany(BookAuthor);

Genre.hasMany(BookGenre);

Book.hasMany(BookAuthor);
Book.hasMany(BookGenre);

BookAuthor.belongsTo(Book, { foreignKey: 'bookId' });
BookAuthor.belongsTo(Author, { foreignKey: 'authorId' });

BookGenre.belongsTo(Book, { foreignKey: 'bookId' });
BookGenre.belongsTo(Genre, { foreignKey: 'genreId' });

module.exports = { Author, Genre, Book, BookAuthor, BookGenre }
