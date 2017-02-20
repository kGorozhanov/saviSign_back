const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
const Product = require('../product/product-schema')

const serialGroupSchema = new Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    serialPrefix: { type: String, required: true },
    licenseCount: { type: Number, required: true },
    testPeriod: { type: Number, required: true },
    comments: { type: String, required: false },
    serialsCount: { type: Number, required: true },
    dateCreate: { type: Date, default: Date.now }
});

serialGroupSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('SerialGroup', serialGroupSchema);