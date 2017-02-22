var Controller = require('../../lib/controller');
var SerialGroup = require('./serial-group-facade');
var Serial = require('./../serial/serial-facade');
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
                if(key !== 'productId') {
                    query[key] = new RegExp(req.query[key]);
                }
            }
        }
        options.populate = 'product';
        return this.model.paginate(query, options)
            .then(collection => {
                if(req.query.productId) {
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

    create(req, res, next) {
        this.model.create(req.body)
            .then(doc => {
                let serials = [];
                let serialsCollection = [];
                const makeUniqualKey = () => {
                    let key = this.makeKey(req.body.product.productId, req.body.serialPrefix);
                    if(serials.indexOf(key) === -1) {
                        serials.push(key);
                    } else {
                        makeUniqualKey();
                    }
                }
                for (let i = doc.serialsCount; i > 0; i--) {
                    makeUniqualKey();
                }
                for (let i = doc.serialsCount -1; i >= 0; i--) {
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
                // return async.eachSeries(serials, (item, done) => {
                //     Serial.create(item)
                //         .then(() => done())
                //         .catch(err => done(null, err));
                // }, (err) => {
                //     if (err) return err;
                //     res.status(201).json(doc)
                // });
            })
            .catch(err => next(err));
    }

    remove(req, res, next) {
        this.model.remove(req.params.id)
            .then(doc => {
                if (!doc) { return res.status(404).end(); }
                return Serial
                    .removeCollection({ serialGroup: doc._id });
            })
            .then(() => res.status(204).end())
            .catch(err => next(err));
    }

    makeKey(productId, serialPrefix) {
        let sectionsCount = 3;
        let letters = 5;
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#@";
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

module.exports = new SerialGroupController(SerialGroup);