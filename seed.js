var User = require('./model/user/user-schema');
var async = require('async');

module.exports = {
    populateAdmin: () => {
        User.find({ role: 'admin' })
            .then(users => {
                if (!users.length) {
                    User.create({
                        name: 'Super Admin',
                        email: 'superAdmin@user.com',
                        role: 'admin',
                        password: 'superAdmin',
                        provider: 'local',
                    })
                    .catch(err => console.log('error on create admin user', err));
                }
            });
    }
};