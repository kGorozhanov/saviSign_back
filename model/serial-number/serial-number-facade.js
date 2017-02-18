const Model = require('../../lib/facade');
const serialNumberSchema = require('./serial-number-schema');


class SerialNumberModel extends Model {
    paginate(query, options) {
        return this.Schema.paginate(query, options);
    }
}

module.exports = new SerialNumberModel(serialNumberSchema);