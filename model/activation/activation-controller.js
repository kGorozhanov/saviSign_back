var Controller = require('../../lib/controller');
var Activation = require('./activation-facade');
var Serial = require('../serial/serial-facade');
var async = require('async');

class ActivationController extends Controller {

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
                // if (key === 'serialGroup' || key === 'docIndex') {
                //     query[key] = req.query[key];
                // } else {
                query[key] = new RegExp(req.query[key]);
                // }
            }
        }
        return this.model.paginate(query, options)
            .then(collection => {
                res.status(200).json(collection)
            })
            .catch(err => next(err));
    }

    create(req, res, next) {
        Serial.findOne({ key: req.serial })
            .then(serial => {
                if (serial.licenseCount === 31 || serial.licenseCount > serial.activationsCount) {
                    return Serial.update({ _id: serial._id }, {
                        activationsCount: serial.activationsCount + 1
                    });
                } else {
                    let err = new Error('All licenses activated');
                    err.status = 403;
                    return err;
                }
            })
            .then(() => this.model.create(req.body))
            .then(doc => res.status(201).json(doc))
            .catch(err => next(err));
    }

    // remove(req, res, next) {
    //     this.model.remove(req.params.id)
    //         .then(doc => {
    //             if (!doc) { return res.status(404).end(); }
    //             return SerialGroup.findById(doc.serialGroup)
    //         })
    //         .then(doc => {
    //             return this.model.find({serialGroup: doc._id})
    //                 .then(docs => {
    //                     return SerialGroup.update({_id: doc._id}, {serialsCount: docs.length});
    //                 });
    //         })
    //         .then(doc => res.status(204).end())
    //         .catch(err => next(err));
    // }
}

module.exports = new ActivationController(Activation);