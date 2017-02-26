const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const autoIncrement = require("mongoose-auto-increment");
const Schema = mongoose.Schema;

autoIncrement.initialize(mongoose);

const activationSchema = new Schema({
    serial:         { type: String, required: true },
    machineId:      { type: String, required: true },
    firstName:      { type: String, required: true },
    lastName:       { type: String, required: true },
    email:          { type: String, required: true },
    company:        { type: String, required: true },
    country:        { type: String, required: true },
    city:           { type: String, required: true },
    address:        { type: String, required: true },
    phone:          { type: String, required: true },
    ipAddress:      { type: String, required: true },
    activationCode: { type: String, required: true },
    reason:         { type: String, required: false },
    status:         { type: Boolean, required: true },
    activationKey:  { type: String },
    dateCreate:     { type: Date, default: Date.now }
});

activationSchema.plugin(mongoosePaginate);
activationSchema.plugin(autoIncrement.plugin, { model: 'Activation', field: 'docIndex', startAt: 1 });

module.exports = mongoose.model('Activation', activationSchema);