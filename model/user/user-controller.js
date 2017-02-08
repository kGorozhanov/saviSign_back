'use strict';

var User = require('./user-schema');
var config = require('../../config');
var jwt = require('jsonwebtoken');

function validationError(res, statusCode) {
    statusCode = statusCode || 422;
    return function (err) {
        return res.status(statusCode).json(err);
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function (err) {
        return res.status(statusCode).send(err);
    };
}
module.exports = {

    /**
     * Get list of users
     * restriction: 'admin'
     */
    index: function (req, res) {
        return User.find({}, '-salt -password').exec()
            .then(users => {
                res.status(200).json(users);
            })
            .catch(handleError(res));
    },

    /**
     * Creates a new user
     */
    create: function (req, res) {
        var newUser = new User(req.body);
        newUser.provider = 'local';
        newUser.save()
            .then(function (user) {
                res.json(user);
            })
            .catch(validationError(res));
    },

    /**
     * Get a single user
     */
    show: function (req, res, next) {
        var userId = req.params.id;

        return User.findById(userId).exec()
            .then(user => {
                if (!user) {
                    return res.status(404).end();
                }
                res.json(user.profile);
            })
            .catch(err => next(err));
    },

    /**
     * Deletes a user
     * restriction: 'admin'
     */
    destroy: function (req, res) {
        return User.findByIdAndRemove(req.params.id).exec()
            .then(function () {
                res.status(204).end();
            })
            .catch(handleError(res));
    },

    /**
     * Change a users password
     */
    changePassword: function (req, res) {
        var userId = req.user._id;
        var oldPass = String(req.body.oldPassword);
        var newPass = String(req.body.newPassword);

        return User.findById(userId).exec()
            .then(user => {
                if (user.authenticate(oldPass)) {
                    user.password = newPass;
                    return user.save()
                        .then(() => {
                            res.status(204).end();
                        })
                        .catch(validationError(res));
                } else {
                    return res.status(403).end();
                }
            });
    },

    /**
     * Change a users password
     */

    updateUser: function (req, res) {
        return User.findById(req.params.id)
            .exec()
            .then((user => {
                for (let key in req.body) {
                    if (req.body[key]) {
                        user[key] = req.body[key];
                    }
                }
                return user.save()
                    .then((user) => {
                        res.json(user);
                    })
                    .catch(validationError(res));

            }))
    },

    /**
     * Get my info
     */
    me: function (req, res, next) {
        var userId = req.user._id;

        return User.findOne({ _id: userId }, '-salt -password').exec()
            .then(user => { // don't ever give out the password or salt
                if (!user) {
                    return res.status(401).end();
                }
                res.json(user);
            })
            .catch(err => next(err));
    },

    /**
     * Authentication callback
     */
    authCallback: function (req, res) {
        res.redirect('/');
    }

}