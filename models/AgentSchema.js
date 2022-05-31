const mongoose = require('../config/dbConfig').mongoose;
const Schema = mongoose.Schema;


var Agent_Schema = new mongoose.Schema({
    username: String,
    password: String,

    categories:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'faq'
    }],

    chats_open : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chat'
    }],
    chats_close : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chat'
    }],

});

Agent_Schema.methods.verifyPassword = function (password) {
    return password === this.password;
}


//model named 'agent'
const Agent = mongoose.model('agent', Agent_Schema);
module.exports = Agent;

