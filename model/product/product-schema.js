const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    productId: {type: String, required: true},
    serialPrefix: {type: String, required: true},
    dateCreate: { type: Date, default: Date.now }
});

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', productSchema);