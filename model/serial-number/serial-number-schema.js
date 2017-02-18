const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
const Product = require('../product/product-schema')

const serialNumberSchema = new Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    serialPrefix: { type: String, required: true },
    licenseCount: { type: Number, required: true },
    testPeriod: { type: Number, required: true },
    comments: { type: String, required: false },
    dateCreate: { type: Date, default: Date.now }
});

serialNumberSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('SerialNumber', serialNumberSchema);