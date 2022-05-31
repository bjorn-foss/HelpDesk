const mongoose = require('../config/dbConfig').mongoose;
const Schema = mongoose.Schema;

var FAQ_Schema = new mongoose.Schema({
    category_name: String,
    question_answer :[{
        pinned: Boolean,
        question: String,
        answer: String
    }]
});

module.exports = mongoose.model('faq', FAQ_Schema);

