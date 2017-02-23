var Controller = require('../../lib/controller');
var Product = require('./product-facade');
var Serial = require('./../serial/serial-facade');
var SerialGroup = require('./../serial-group/serial-group-facade');
var async = require('async');

class ProductController extends Controller {

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
        return this.model.paginate(query, options)
            .then(collection => res.status(200).json(collection))
            .catch(err => next(err));
    }

    remove(req, res, next) {
        this.model.remove(req.params.id)
            .then(doc => {
                if (!doc) return res.status(404).end(); 
                async.parallel([
                    (asyncdone) => {
                        Serial.removeCollection({product: doc._id})
                            .then(() => asyncdone())
                            .catch(err => asyncdone(err));
                    },
                    (asyncdone) => {
                        SerialGroup.removeCollection({product: doc._id})
                            .then(() => asyncdone())
                            .catch(err => asyncdone(err));
                    }
                ], (err) => {
                    if(err) return next(err);
                    return res.status(204).end();
                })
            })
            .catch(err => next(err));
    }
}

module.exports = new ProductController(Product);