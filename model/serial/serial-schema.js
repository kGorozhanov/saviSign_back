const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const SerialGroup = require('./../serial-group/serial-group-schema');

const serialSchema = new Schema({
    serialGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'SerialGroup' },
    key: { type: String, required: true },
    licenseCount: { type: Number, required: true },
    dateCreate: { type: Date, default: Date.now }
});

serialSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('SerialSchema', serialSchema);