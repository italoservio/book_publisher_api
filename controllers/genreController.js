var Genre = require('../models/genre');

const genreController = {
  async getAll(req, res) {
    let genres = await Genre.findAll();
    res.status(200).json(genres);
  }
}

module.exports = genreController;