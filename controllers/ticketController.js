const {mongoose} = require("../config/dbConfig");
const bodyParser = require("body-parser");

const AgentModel = require('../models/AgentSchema');
const TicketModel = require('../models/ticketSchema');
const FAQModel = require("../models/FAQSchema");
const {toJSON} = require("express-session/session/cookie");

exports.getTicket = async function (id) {
    return TicketModel.findById(id);
}

exports.getNumberOfOpenTicketsWithoutCat = async function (id) {
    return TicketModel.find({category: null, closed : false}).count();
};

exports.getNumberOfOpenTicketsOfCat = async function (id) {
    return TicketModel.find({category: id, closed : false}).count();
};

exports.getNumberTicketsToSolve = async function (id, new_status) {
    return TicketModel.findOneAndUpdate({_id : id}, {closed : new_status});
}


exports.addToTicket = async function (id, message) {
    var ticketToUpdate = await this.getTicket(id);
    var new_entry = { sender : 'agent', body: message };
    ticketToUpdate.entries.push(new_entry);
    ticketToUpdate.save();
}

exports.changeTicketStatus = async function (id, new_status) {
    return TicketModel.findOneAndUpdate({_id : id}, {closed : new_status});
}



exports.create_ticket = async function (req, res) {
    if(req.body.categoria!== "0")
        var cat = FAQModel.findById(req.body.categoria, function (err, cat) {
            if(err){
                res.status(500).send({mesage: err.message});
            }
            else if(cat){
                let new_ticket = new TicketModel({
                    category: cat._id,
                    email_guest : req.body.email,
                    subject: req.body.assunto,
                    closed: false,
                    entries: [{
                        sender: "user",
                        body  : req.body.mensagem
                    }]
                });
                new_ticket.save();
            }
        });
    else{
        let new_ticket = new TicketModel({
            category: null,
            email_guest : req.body.email,
            subject: req.body.assunto,
            closed: false,
            entries: [{
                sender: "user",
                body  : req.body.mensagem
            }]
        });
        new_ticket.save();
    }
}

exports.createTicket = async function (req, res){
    await this.create_ticket(req, res);
    res.redirect('/Tickets');
}

exports.createTicketFromChat = async function (req, res){
    await this.create_ticket(req, res);
    res.redirect('/chat');
}

exports.close_ticket = async function (req, res) {
    if(req.user){
        var ticket_id = req.body.ticket_id;
        ticket = await this.changeTicketStatus(ticket_id, true);
        res.redirect('/agent/tickets')
    }
    else{
        res.send(500).send("Error");
    }
}

exports.reopen_ticket = (req, res) =>{
    var ticket_id = req.body.ticket_id;
    ticket = this.changeTicketStatus(ticket_id, false);
    res.redirect('/agent/tickets');
}



exports.update_ticket = async function (req, res) {
        var ticket_id = req.body.ticket_id;
        var ticketToUpdate = await this.getTicket(ticket_id);
        var message = req.body.reply;
        var new_entry = { sender: "agent", body : message};
        ticketToUpdate.entries.push(new_entry);
        ticketToUpdate.save();
        res.redirect('/agent/tickets');
}

