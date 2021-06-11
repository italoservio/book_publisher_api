const yup = require('yup');
const helper = require('../services/helper');
const sequelize = require('../database/database');
const {
  Book,
  BookGenre,
  BookAuthor,
  Genre,
  Author } = require('../models/associations');

const bookController = {

  all() {

  },

  one() {

  },

  new(req, res) {
    let r = {};

    const schema = yup.object().shape({
      title: yup.string().required(),
      summary: yup.string().required(),
      isbn: yup.string().required(),
      genres: yup.array().of(yup.number().positive().integer()),
      authors: yup.array().of(yup.number().positive().integer()),
    });

    schema.isValid(req.body)
    .then(async (valid) => {
      const transaction = await sequelize.transaction();
      try {
        if (valid) {

          let bookGenres = [];
          let bookAuthors = [];

          let book = await Book.create({
            title: req.body.title,
            summary: req.body.summary,
            isbn: req.body.isbn
          }, { transaction });

          // Creating bookGenres:
          for (const g of req.body.genres) {
            let genre = await Genre.findByPk(g);
            if (genre !== null) {
              await BookGenre.create({
                bookId: book.id,
                genreId: g
              }, { transaction });
              bookGenres.push(genre);
            } else throw `Invalid genre key: "${g}"`;
          }

          // Creating bookAuthors:
          for (const a of req.body.authors) {
            let author = await Author.findByPk(a);
            if (author !== null) {
              await BookAuthor.create({
                bookId: book.id,
                authorId: a
              }, { transaction });
              bookAuthors.push(author);
            } else throw `Invalid author key: "${g}"`;
          }

          await transaction.commit();
          r = {
            status: 201,
            message: 'Book created successfully',
            book: {
              id: book.id,
              title: book.title,
              summary: book.summary,
              isbn: book.isbn,
              genres: bookGenres,
              authors: bookAuthors
            }
          };

        } else throw 'Invalid object';
      } catch (e) {
        await transaction.rollback();
        r = {
          status: 422,
          message: e
        };
      }
      res.status(r.status).json(r);
    });
  },

  change() {

  },

  remove() {

  }

}

module.exports = bookController;