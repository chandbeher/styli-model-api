const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Model = new Schema({
    name: String,
    gender: String,
    waist: Number,
    height: Number,
    bust: Number,
    highHip: Number,
    lowHip: Number
});

module.exports = mongoose.model('Model', Model);