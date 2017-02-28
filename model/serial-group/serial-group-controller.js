var Controller = require('../../lib/controller');
var SerialGroup = require('./serial-group-facade');
var Serial = require('./../serial/serial-facade');
var Activation = require('./../activation/activation-facade');
var Product = require('./../product/product-facade');
const encode = require('../../lib/encode');
var async = require('async');

class SerialGroupController extends Controller {

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
                if (key !== 'productId') {
                    query[key] = new RegExp(req.query[key]);
                }
            }
        }
        options.populate = 'product';
        return this.model.paginate(query, options)
            .then(collection => {
                if (req.query.productId) {
                    collection.docs = collection.docs.filter((item) => {
                        return item.product.productId.indexOf(req.query.productId) !== -1
                    });
                }
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

    findById(req, res, next) {
        return this.model.findById(req.params.id)
            .then(doc => {
                if (!doc) { return res.status(404).end(); }
                return this.model.populate(doc, {path: 'product'});
            })
            .then((doc) => {
                res.status(200).json(doc);
            })
            .catch(err => next(err));
    }

    create(req, res, next) {
        this.model.create(req.body)
            .then(doc => {
                let serials = [];
                let serialsCollection = [];
                const makeUniqualKey = () => {
                    let key = encode.makeSerialKey(req.body.product.productId, req.body.serialPrefix, doc.testPeriod, doc.licenseCount);
                    if (serials.indexOf(key) === -1) {
                        serials.push(key);
                    } else {
                        makeUniqualKey();
                    }
                }
                for (let i = doc.serialsCount; i > 0; i--) {
                    makeUniqualKey();
                }
                for (let i = doc.serialsCount - 1; i >= 0; i--) {
                    serialsCollection.push({
                        serialGroup: doc._id,
                        product: doc.product,
                        licenseCount: doc.licenseCount,
                        key: serials[i]
                    });
                }
                console.log('generated starting save')
                return Serial.createCollection(serialsCollection)
                    .then(() => res.status(201).json(doc))
            })
            .catch(err => next(err));
    }

    remove(req, res, next) {
        this.model.remove(req.params.id)
            .then(doc => {
                if (!doc) { return res.status(404).end(); }
                async.parallel([
                    (asyncdone) => {
                        Serial.removeCollection({serialGroup: doc._id})
                            .then(() => asyncdone())
                            .catch(err => asyncdone(err));
                    },
                    (asyncdone) => {
                        Product.findById(doc.product)
                            .then(product => {
                                let search = new RegExp('^' + product.productId + '-' + doc.serialPrefix);
                                return Activation.removeCollection({serial: search});
                            })
                            .then(() => asyncdone())
                            .catch(err => asyncdone(err));
                    }
                ], (err) => {
                    if(err) return next(err);
                    return res.status(204).end();
                })
            })
            .then(() => res.status(204).end())
            .catch(err => next(err));
    }
}

module.exports = new SerialGroupController(SerialGroup);