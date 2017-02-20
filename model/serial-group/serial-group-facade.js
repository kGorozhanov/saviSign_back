const Model = require('../../lib/facade');
const serialGroupSchema = require('./serial-group-schema');


class SerialGroupModel extends Model {
    paginate(query, options) {
        return this.Schema.paginate(query, options);
    }
}

module.exports = new SerialGroupModel(serialGroupSchema);