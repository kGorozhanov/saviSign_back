const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const autoIncrement = require("mongoose-auto-increment");
const Schema = mongoose.Schema;
const Product = require('../product/product-schema');

const SerialGroup = require('./../serial-group/serial-group-schema');

autoIncrement.initialize(mongoose);

const serialSchema = new Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    serialGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'SerialGroup' },
    key: { type: String, required: true },
    licenseCount: { type: Number, required: true },
    activationsCount: { type: Number, default: 0 },
    dateCreate: { type: Date, default: Date.now }
});

serialSchema.plugin(mongoosePaginate);
serialSchema.plugin(autoIncrement.plugin, { model: 'SerialSchema', field: 'docIndex', startAt: 1 });

module.exports = mongoose.model('SerialSchema', serialSchema);