const Model = require('../../lib/facade');
const productSchema  = require('./product-schema');


class ProductModel extends Model {
    paginate(query, options) {
        return this.Schema.paginate(query, options);
    }
}

module.exports = new ProductModel(productSchema);