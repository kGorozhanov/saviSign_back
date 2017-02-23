const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const autoIncrement = require("mongoose-auto-increment");
const Schema = mongoose.Schema;

autoIncrement.initialize(mongoose);

const productSchema = new Schema({
    productId: {type: String, required: true},
    name: {type: String, required: true},
    dateCreate: { type: Date, default: Date.now }
});

productSchema.plugin(mongoosePaginate);
productSchema.plugin(autoIncrement.plugin, { model: 'Product', field: 'docIndex', startAt: 1 });

module.exports = mongoose.model('Product', productSchema);