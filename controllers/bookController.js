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

  async all(req, res) {
    const books = await Book.findAll({
      include: [
        {
          model: BookGenre,
          attributes: ['id'],
          include: [{ model: Genre }]
        },
        {
          model: BookAuthor,
          attributes: ['id'],
          include: [{ model: Author }]
        }
      ]
    });
    res.status(200).json({
      status: 200,
      books
    });
  },

  async one(req, res) {
    let r = {};
    const book = await Book.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: BookGenre,
          attributes: ['id'],
          include: [{ model: Genre }]
        },
        {
          model: BookAuthor,
          attributes: ['id'],
          include: [{ model: Author }]
        }
      ]
    });
    if (book !== null) {
      r = {
        status: 200,
        book
      }
    } else {
      r = {
        status: 422,
        message: 'Nothing to get. Invalid key'
      }
    }
    res.status(r.status).json(r);
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

  change(req, res) {

  },

  async remove(req, res) {
    let r = {};
    const transaction = await sequelize.transaction();
    try {
      const id = req.params.id;
      let book = await Book.findByPk(id);
      if (book !== null) {
        const bookGenres = await BookGenre.findAll({ where: { bookId: id } });
        const bookAuthors = await BookAuthor.findAll({ where: { bookId: id } });

        for (const bk of bookGenres) {
          await BookGenre.destroy({ where: { id: bk.id }, force: true });
        }

        for (const ba of bookAuthors) {
          await BookAuthor.destroy({ where: { id: ba.id }, force: true });
        }

        await Book.destroy({ where: { id }, force: true });
        await transaction.commit();
        r = {
          status: 200,
          message: 'Book deleted successfully'
        };
      } else throw 'Invalid key';
    } catch (e) {
      await transaction.rollback();
      r = {
        status: 422,
        message: 'Nothing to delete. ' + e
      };
    }
    res.status(r.status).json(r);
  }

}

module.exports = bookController;