var Controller = require('../../lib/controller');
var Serial = require('./serial-facade');
var SerialGroup = require('./../serial-group/serial-group-facade');
var Activation = require('./../activation/activation-facade');
var async = require('async');

class SerialController extends Controller {

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
                if (key === 'serialGroup' || key === 'docIndex') {
                    query[key] = req.query[key];
                } else {
                    query[key] = new RegExp(req.query[key]);
                }
            }
        }
        return this.model.paginate(query, options)
            .then(collection => {
                res.status(200).json(collection)
            })
            .catch(err => next(err));
    }

    remove(req, res, next) {
        this.model.remove(req.params.id)
            .then(doc => {
                if (!doc) { return res.status(404).end(); }
                async.parallel([
                    (asyncdone) => {
                        let serialGroupId;
                        SerialGroup.findById(doc.serialGroup)
                            .then(serialGroup => {
                                serialGroupId = serialGroup._id;
                                return this.model.find({ serialGroup: serialGroup._id })
                            })
                            .then(docs => {
                                return SerialGroup.update({ _id: serialGroupId }, { serialsCount: docs.length });
                            })
                            .then(() => asyncdone())
                            .catch(err => asyncdone(err));
                    },
                    (asyncdone) => {
                        Activation.removeCollection({ serial: doc.key })
                            .then(() => asyncdone())
                            .catch(err => asyncdone(err));
                    }
                ], (err) => {
                    if (err) return next(err);
                    return res.status(204).end();
                })
            })
            .catch(err => next(err));
    }
}

module.exports = new SerialController(Serial);