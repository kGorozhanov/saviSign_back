var Controller = require('../../lib/controller');
var SerialNumber = require('./serial-number-facade');
var async = require('async');

class SerialNumberController extends Controller {

    find(req, res, next) {
        let options = {};
        if (req.query.sort) {
            options.sort = req.query.sort;
            delete req.query.sort;
        }
        if (req.query.page) {
            options.page = +req.query.page;
            delete req.query.page;
        }
        if (req.query.limit) {
            options.limit = +req.query.limit;
            delete req.query.limit;
        }
        let query = {};
        if (req.query) {
            for (let key in req.query) {
                query[key] = new RegExp('^' + req.query[key]);
            }
        }
        options.populate = 'product';
        return this.model.paginate(query, options)
            // .then(collection => this.model.populate(collection, { path: 'product' }))
            .then(collection => res.status(200).json(collection))
            .catch(err => next(err));
    }

    remove(req, res, next) {
        this.model.remove(req.params.id)
            .then(doc => {
                if (!doc) return res.status(404).end(); 

                return res.status(204).end();
            })
            .catch(err => next(err));
    }
}

module.exports = new SerialNumberController(SerialNumber);