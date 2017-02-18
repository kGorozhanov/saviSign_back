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
            .then(collection => {
                if (options.sort === 'product.productId') {
                    collection.docs.sort((a, b) => {
                        if (a.product.productId < b.product.productId) return -1;
                        if (a.product.productId > b.product.productId) return 1;
                        return 0;
                    })
                }
                if (options.sort === '-product.productId') {
                    collection.docs.sort((a, b) => {
                        if (a.product.productId > b.product.productId) return -1;
                        if (a.product.productId < b.product.productId) return 1;
                        return 0;
                    })
                }
                res.status(200).json(collection)
            })
            .catch(err => next(err));
    }

    create(req, res, next) {
        req.body.serialNumber = this.makeKey(req.body.productId, req.body.serialPrefix);
        this.model.create(req.body)
            .then(doc => res.status(201).json(doc))
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

    makeKey(productId, serialPrefix) {
        sectionsCount = 3;
        letters = 5;
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var sections = [
            productId,
            serialPrefix
        ];
        for (var section = 0; section < sectionsCount; section++) {
            var text = "";
            for (var i = 0; i < letters; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            sections.push(text);
        }
        return sections.join('-');
    }
}

module.exports = new SerialNumberController(SerialNumber);