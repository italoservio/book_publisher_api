const yup = require('yup');
const { Genre } = require('../models/associations');

const genreController = {

  async all(req, res) {
    const genres = await Genre.findAll();
    res.status(200).json({
      status: 200,
      genres
    });
  },

  async one(req, res) {
    let r = {};
    const genre = await Genre.findByPk(req.params.id);
    if (genre !== null) {
      r = {
        status: 200,
        genre
      }
    } else {
      r = {
        status: 422,
        message: 'Nothing to get. Invalid key'
      }
    }
    res.status(r.status).json(r);
  },

  async new(req, res) {
    let r = {};
    const schema = yup.object().shape({
      name: yup.string().required()
    });
    schema.isValid(req.body)
    .then(async (valid) => {
      if (valid) {
        const name = req.body.name;
        const genre = await Genre.create({ name });
        r = {
          status: 201,
          message: 'Genre created successfully',
          genre
        };
      } else {
        r = {
          status: 422,
          message: 'Invalid object'
        };
      }
      res.status(r.status).json(r);
    });
  },

  async change(req, res) {
    let r = {};
    let schema = yup.object().shape({
      id: yup.number().required().positive().integer(),
      name: yup.string().required()
    });
    schema.isValid(req.body)
    .then(async (valid) => {
      try {
        if (valid) {
          const id = req.body.id;
          let genre = await Genre.findByPk(id);
          if (genre !== null) {
            await genre.update({ name: req.body.name });
            r = {
              status: 201,
              message: 'Genre updated successfully',
              genre
            };
          } else throw 'Nothing to edit. Invalid key';
        } else throw 'Invalid object';
      } catch (e) {
        r = {
          status: 422,
          message: e
        };
      }
      res.status(r.status).json(r);
    });
  },

  async remove(req, res) {
    let r = {};
    try {
      const id = req.params.id;
      let genre = await Genre.findByPk(id);
      if (genre !== null) {
        await genre.destroy({ force: true });
        r = {
          status: 200,
          message: 'Genre deleted successfully'
        };
      } else throw 'Invalid key';
    } catch (e) {
      r = {
        status: 422,
        message: 'Nothing to delete. ' + e
      };
    }
    res.status(r.status).json(r);
  }

}

module.exports = genreController;
