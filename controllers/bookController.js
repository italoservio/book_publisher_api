const yup = require('yup');
const helper = require('../services/helper');
const sequelize = require('../database/database');
const {
  Book,
  BookGenre,
  BookAuthor,
  Genre,
  Author
} = require('../models/associations');

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
          let genre = null;
          for (const g of req.body.genres) {
            genre = await Genre.findByPk(g);
            if (genre !== null) {
              await BookGenre.create({
                bookId: book.id,
                genreId: g
              }, { transaction });
              bookGenres.push(genre);
            } else throw `Invalid genre key: ${g}`;
          }

          // Creating bookAuthors:
          let author = null;
          for (const a of req.body.authors) {
            author = await Author.findByPk(a);
            if (author !== null) {
              await BookAuthor.create({
                bookId: book.id,
                authorId: a
              }, { transaction });
              bookAuthors.push(author);
            } else throw `Invalid author key: ${a}`;
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

  async change(req, res) {
    let r = {};

    const schema = yup.object().shape({
      id: yup.number().positive().integer().required()
    });

    await schema.isValid(req.body)
    .then(async (valid) => {
      const transaction = await sequelize.transaction();
      try {
        if (valid) {

          const id = req.body.id;
          let obj = {};

          if (!helper.empty(req.body.title)) obj.title = req.body.title;
          if (!helper.empty(req.body.summary)) obj.summary = req.body.summary;
          if (!helper.empty(req.body.isbn)) obj.isbn = req.body.isbn;

          let book = await Book.findByPk(id);
          if (book !== null) {

            await book.update(obj);

            // Deleting previous bookGenres and creating new bookAuthors:
            if (!helper.empty(req.body.authors)) {
              if (req.body.authors instanceof Array) {
                let firstAuthor = true;
                let author = null;
                for (const a of req.body.authors) {
                  author = Author.findByPk(a);
                  if (author === null) throw `Invalid author key: ${a}`;

                  if (firstAuthor) {
                    firstAuthor = false;
                    let actualBookAuthors = await BookAuthor.findAll({ where: { bookId: id } });
                    for (let bookAuthor of actualBookAuthors) await bookAuthor.destroy({ force: true });
                  }
                  await BookAuthor.create({
                    bookId: id,
                    authorId: a
                  }, { transaction });
                }
              } else throw 'Authors isn\'t an array';
            }

            // Deleting previous bookGenres and creating new bookGenres:
            if (!helper.empty(req.body.genres)) {
              if (req.body.genres instanceof Array) {
                let firstGenre = true;
                let genre = null;
                for (const g of req.body.genres) {
                  genre = Genre.findByPk(g);
                  if (genre === null) throw `Invalid genre key: ${g}`;

                  if (firstGenre) {
                    firstGenre = false;
                    let actualBookGenres = await BookGenre.findAll({ where: { bookId: id } });
                    for (let bookGenre of actualBookGenres) await bookGenre.destroy({ force: true });
                  }
                  await BookGenre.create({
                    bookId: id,
                    genreId: g
                  }, { transaction });
                }
              } else throw 'Genres isn\'t an array';
            }

            await transaction.commit();

            //  Getting existent book authors
            let newBookAuthors = await BookAuthor.findAll({
              where: { bookId: id },
              attributes: ['id'],
              include: [{ model: Author }]
            });

            let newBookGenres = await BookGenre.findAll({
              where: { bookId: id },
              attributes: ['id'],
              include: [{ model: Genre }]
            });

            r = {
              status: 200,
              message: 'Book updated successfully',
              book: {
                id: book.id,
                title: book.title,
                summary: book.summary,
                isbn: book.isbn,
                genres: newBookGenres,
                authors: newBookAuthors
              }
            };
          } else throw 'Nothing to edit. Invalid key';
        } else 'Invalid object'
      } catch (e) {
        await transaction.rollback();
        r = {
          status: 422,
          message: e
        };
      }
    });
    res.json(r);
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

        for (let bookGenre of bookGenres) {
          await bookGenre.destroy({ force: true });
        }

        for (let bookAuthor of bookAuthors) {
          await bookAuthor.destroy({ force: true });
        }

        await book.destroy({ force: true });
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