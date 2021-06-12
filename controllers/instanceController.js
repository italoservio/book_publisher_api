const yup = require('yup');
const helper = require('../services/helper');
const { Instance, Status, Book } = require('../models/associations');

const instanceController = {

  async all(req, res) {
    const instances = await Instance.findAll({
      include: [
        { model: Book },
        { model: Status }
      ]
    });
    res.status(200).json({
      status: 200,
      instances
    });
  },

  async one(req, res) {
    let r = {};
    const instance = await Instance.findOne({
      where: { id: req.params.id },
      include: [
        { model: Book },
        { model: Status }
      ]
    });
    if (instance !== null) {
      r = {
        status: 200,
        instance
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
      dueDate: yup.string().required(),
      imprint: yup.string().required(),
      statusId: yup.number().positive().integer(),
      bookId: yup.number().positive().integer()
    });
    schema.isValid(req.body)
    .then(async (valid) => {
      try {
        if (valid) {
          if (helper.validDate(req.body.dueDate)) {
            // Status exists?
            let status = await Status.findByPk(req.body.statusId);
            if (status === null) throw `Invalid status key: ${req.body.statusId}`;

            // Book exists?
            let book = await Book.findByPk(req.body.bookId);
            if (book === null) throw `Invalid book key: ${req.body.bookId}`;

            const instance = await Instance.create(req.body);
            r = {
              status: 201,
              message: 'Instace created successfully',
              instance
            };
          } else throw 'Invalid date format';
        } else 'Invalid object'
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
      id: yup.number().positive().integer().required()
    });

    await schema.isValid(req.body)
    .then(async (valid) => {
      try {
        if (valid) {
          const id = req.body.id;
          let obj = {};
          if (!helper.empty(req.body.statusId)) obj.statusId = req.body.statusId;
          if (!helper.empty(req.body.dueDate)) obj.dueDate = req.body.dueDate;
          if (!helper.empty(req.body.imprint)) obj.imprint = req.body.imprint;

          // Valid DueDate?
          if (
            !helper.empty(req.body.dueDate) &&
            !helper.validDate(req.body.dueDate)
          ) throw 'Invalid date format';

          // Status exists?
          if (!helper.empty(req.body.statusId)) {
            let status = await Status.findByPk(req.body.statusId);
            if (status === null) throw `Invalid status key: ${req.body.statusId}`;
          }

          let instance = await Instance.findByPk(id);
          if (instance !== null) {
            await instance.update(obj);
            r = {
              status: 201,
              message: 'Instace updated successfully',
              instance
            };
          } else throw 'Nothing to edit. Invalid key';
        } else 'Invalid object';
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
      let instance = await Instance.findByPk(id);
      if (instance !== null) {
        await instance.destroy({ force: true });
        r = {
          status: 200,
          message: 'Instance deleted successfully'
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

module.exports = instanceController;
