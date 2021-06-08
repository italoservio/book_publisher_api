const Genre = require('../models/genre');

const genreController = {
  async all(req, res) {
    let genres = await Genre.findAll();
    res.status(200).json(genres);
  },
  async new(req, res) {
    let name = req.body.name;
    let genre = await Genre.create({ name });
    res.status(200).json(genre);
  }
}

module.exports = genreController;
