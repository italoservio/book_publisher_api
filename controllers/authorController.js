const yup = require('yup');
const helper = require('../services/helper');
const { Author } = require('../models/associations');

const authorController = {

  async all(req, res) {
    const authors = await Author.findAll();
    res.status(200).json({
      status: 200,
      authors
    });
  },

  async one(req, res) {
    let r = {};
    const author = await Author.findByPk(req.params.id);
    if (author !== null) {
      r = {
        status: 200,
        author
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
      firstName: yup.string().required(),
      familyName: yup.string().required(),
      dateOfBirth: yup.string().required(),
      dateOfDeath: yup.string(),
      name: yup.string().required(),
      lifespan: yup.number().positive().integer()
    });
    schema.isValid(req.body)
    .then(async (valid) => {
      try {
        if (valid) {
          if (
          helper.validDate(req.body.dateOfBirth) &&
          (req.body.dateOfDeath === "" ||
          helper.validDate(req.body.dateOfDeath))) {
            const author = await Author.create(req.body);
            r = {
              status: 201,
              message: 'Author created successfully',
              author
            };
          } else throw 'Invalid date format';
        } else throw 'Invalid object'
      } catch (e) {
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
      id: yup.number().positive().integer().required(),
    });
    schema.isValid(req.body)
    .then(async (valid) => {
      try {
        if (valid) {
          const id = req.body.id;
          let obj = {};
          if (!helper.empty(req.body.firstName)) obj.firstName = req.body.firstName;
          if (!helper.empty(req.body.familyName)) obj.familyName = req.body.familyName;
          if (!helper.empty(req.body.dateOfBirth)) obj.dateOfBirth = req.body.dateOfBirth;
          if (!helper.empty(req.body.dateOfDeath)) obj.dateOfDeath = req.body.dateOfDeath;
          if (!helper.empty(req.body.name)) obj.name = req.body.name;
          if (!helper.empty(req.body.lifespan)) obj.lifespan = req.body.lifespan;

          let author = await Author.findByPk(id);
          if (author !== null) {
            await Author.update(obj, { where: { id } });
            r = {
              status: 200,
              message: 'Author edited successfully',
              author
            };
          } else throw 'Nothing to edit. Invalid key'
        } else throw 'Invalid object'
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
      let author = await Author.findByPk(id);
      if (author !== null) {
        await author.destroy({ where: { id }, force: true });
        r = {
          status: 200,
          message: 'Author deleted successfully'
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

module.exports = authorController;
