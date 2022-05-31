const mongoose = require('../config/dbConfig').mongoose;
const Schema = mongoose.Schema;


var Chat_Schema = new mongoose.Schema({
    chat_entries: [{
        sender: {type: String, enum: ["user", "agent"]},
        message: {
            type: String,
            required:true,
        },
        date: {
            type: Date,
            immutable:true,
            default:()=> Date.now(),
        },
    }],
    close: {
        type: Boolean,
        default:()=> false,
    }
});

module.exports  = mongoose.model('chat', Chat_Schema);
