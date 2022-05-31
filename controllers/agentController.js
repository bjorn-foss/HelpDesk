const bodyParser = require("body-parser");

const AgentModel = require('../models/AgentSchema');
const TicketModel = require('../models/ticketSchema');
const FAQModel = require("../models/FAQSchema");



    const TicketController= require('../controllers/ticketController');
    const FAQController= require('../controllers/FAQController');


exports.getTicketByCategory = async function (catId) {
    return TicketModel.find({ category:catId})
};

exports.getTicketWithoutCategory = async function () {
    return TicketModel.find({ category: null})
};

exports.page_Tickets = async function (req, res) {
    if(req.user){
        var user_obj = req.user._doc;
        var arr_tickets = [];

        for (let index in user_obj.categories) {// user._doc.categories) {  //for each category of the agent
            var tickets = await this.getTicketByCategory(user_obj.categories[index]);
            arr_tickets.push(tickets);
        }
        var uncategorizedTickets = await this.getTicketWithoutCategory();
        arr_tickets.push(uncategorizedTickets);

        res.render('./pages/open_close_tickets.ejs', {tickets: arr_tickets});
    }
    else{
        res.send(500).send("Error");
    }

}

exports.page_Tickets_Details = async function (req, res) {
    var ticket_id = req.body.ticket_id;
    var ticket = await TicketController.getTicket(ticket_id);
    var cat = await FAQController.getCategoryById(ticket._doc.category);
    if (cat === null){
        var category_name = "No category";
    }
    else{
        var category_name = cat._doc.category_name;
    }
    var cats = await FAQController.getAllCategories();
    res.render('./pages/historial_tickets.ejs', {ticket: ticket._doc, cat : category_name, allcats_names : cats});
}

