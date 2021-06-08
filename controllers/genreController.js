const yup = require('yup');
const Genre = require('../models/genre');

const genreController = {

  async all(req, res) {
    const genres = await Genre.findAll();
    res.status(200).json(genres);
  },

  async one(req, res) {
    const genre = await Genre.findByPk(req.params.id);
    res.status(200).json(genre);
  },

  async new(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required()
    });
    schema.isValid(req.body)
    .then(async (valid) => {
      if (valid) {
        const name = req.body.name;
        genre = await Genre.create({ name });
        res.status(201).json({
          status: 201,
          message: 'Genre created successfully',
          genre
        });
      } else {
        res.status(422).json({
          status: 422,
          message: 'Invalid object'
        });
      }
    });
  },

  async change(req, res) {
    let schema = yup.object().shape({
      id: yup.number().required().positive().integer(),
      name: yup.string().required()
    });
    schema.isValid(req.body)
    .then(async (valid) => {
      if (valid) {
        await Genre.update({
          name: req.body.name
        }, {
          where: { id: req.body.id }
        });
        res.status(201).json({
          status: 201,
          message: 'Genre updated successfully'
        });
      } else {
        res.status(422).json({
          status: 422,
          message: 'Invalid object'
        });
      }
    });
  },

  async remove(req, res) {
    const id = req.params.id;
    await Genre.destroy({ where: { id }, force: true });
    res.status(200).json({
      status: 200,
      message: 'Genre deleted successfully'
    });
  }

}

module.exports = genreController;
