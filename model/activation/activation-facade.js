const Model = require('../../lib/facade');
const activationSchema = require('./activation-schema');


class ActivationModel extends Model {
    paginate(query, options) {
        return this.Schema.paginate(query, options);
    }
}

module.exports = new ActivationModel(activationSchema);