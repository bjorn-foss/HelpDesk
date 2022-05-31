const mongoose = require('../config/dbConfig').mongoose;
const Schema = mongoose.Schema;

//Parents.find({}).populate(children).exec();


var Ticket_Schema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'faq'
    },
    email_guest : String,
    subject: String,
    closed: Boolean,
    entries: [{
        sender: {type: String, enum: ["user", "agent"]},
        body  : String,
        date: {
            type: Date,
            immutable:true,
            default:()=> Date.now(),
        }
    }]
});

const Ticket = mongoose.model('ticket', Ticket_Schema);
module.exports = Ticket;
