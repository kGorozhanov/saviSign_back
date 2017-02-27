const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const autoIncrement = require("mongoose-auto-increment");
const Schema = mongoose.Schema;
const Product = require('../product/product-schema');

autoIncrement.initialize(mongoose);

const serialGroupSchema = new Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    serialPrefix: { type: String, unique : true, required: true },
    licenseCount: { type: Number, required: true },
    testPeriod: { type: Number, required: true },
    comments: { type: String, required: false },
    serialsCount: { type: Number, required: true },
    dateCreate: { type: Date, default: Date.now }
});

serialGroupSchema.plugin(mongoosePaginate);
serialGroupSchema.plugin(autoIncrement.plugin, { model: 'SerialGroup', field: 'docIndex', startAt: 1 });

module.exports = mongoose.model('SerialGroup', serialGroupSchema);