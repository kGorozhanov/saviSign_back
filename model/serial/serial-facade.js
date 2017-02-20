const Model = require('../../lib/facade');
const serialSchema = require('./serial-schema');


class SerialModel extends Model {
    paginate(query, options) {
        return this.Schema.paginate(query, options);
    }
}

module.exports = new SerialModel(serialSchema);