const yup = require('yup');
const { Status } = require('../models/associations');

const statusController = {

  async all(req, res) {
    const statuses = await Status.findAll();
    res.status(200).json({
      status: 200,
      statuses
    });
  },

  async one(req, res) {
    let r = {};
    const status = await status.findByPk(req.params.id);
    if (status !== null) {
      r = {
        status: 200,
        data: status
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
      description: yup.string().required()
    });
    schema.isValid(req.body)
    .then(async (valid) => {
      if (valid) {
        const description = req.body.description;
        const status = await Status.create({ description });
        r = {
          status: 201,
          message: 'Status created successfully',
          data: status
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
      description: yup.string().required()
    });
    schema.isValid(req.body)
    .then(async (valid) => {
      if (valid) {
        await Status.update(
          { description: req.body.description },
          { where: { id: req.body.id }
        });
        r = {
          status: 201,
          message: 'Status updated successfully'
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

  async remove(req, res) {
    let r = {};
    try {
      const id = req.params.id;
      const status = await Status.findByPk(id);
      if (status !== null) {
        await Status.destroy({ where: { id }, force: true });
        r = {
          status: 200,
          message: 'Status deleted successfully'
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

module.exports = statusController;
