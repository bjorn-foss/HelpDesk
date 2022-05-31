var mongoose = require('mongoose');
const FAQModel = require('../models/FAQSchema');
const bodyParser = require("body-parser");
const TicketModel = require("../models/ticketSchema");

const TicketController = require("./ticketController")

exports.findall = async function () {
    return FAQModel.find({});
}

exports.pageTickets= (req, res) => {
    //prepare the categories in the FAQ + render the Ticket page with it
    FAQModel.find(function (err, cat) {
        if (err){
            res.status(500).send({message: err.message});
        }
        else if (!cat) {
            res.render('./pages/Tickets.ejs', {categories: []}, err);
        }
        else if (cat) {
            res.render('./pages/Tickets.ejs', {categories:cat}, err);
        }
    });
}

exports.getCatById = async (id) => {
    // var id = mongoose.Types.ObjectId(req.body.categoria);
    FAQModel.findById( id, function (err, cat) {
        if(err){
            return null;
        }
        if(cat){
            return cat._doc;
        }
    });
}

exports.getCategoryById = async function (id) {
    return FAQModel.findById(id);
}


exports.getQAPinned = async function (id) {
    return FAQModel.find({"_id" : id, "question_answer.pinned" : true});
};

exports.getQANotPinned = async function (id) {
    return FAQModel.find({"_id" : id, "question_answer.pinned" : false});
};

exports.getQANotPinned = async function (id) {
    return FAQModel.find({"_id" : id, "question_answer.pinned" : false});
};

exports.getAllCategories = async function () {
    return FAQModel.find({});
};

exports.faq_page = async function (req, res) {
    var faq = await this.getAllCategories();
    if(faq){
        var autenticado = false;
        var numb_Tickets_to_answer = 0;

        if(req.user !== null && req.user !== undefined){  //since this page is common to users and agents
            var autenticado = true;
            var catsOfAgent = req.user._doc.categories;  // meow


            for(let i = 0; i < catsOfAgent.length; i++ ){  // percorrer categorias
                var cat_id = catsOfAgent[i];
                var number = await TicketController.getNumberOfOpenTicketsOfCat(cat_id);
                numb_Tickets_to_answer += number;
            }
            numb_Tickets_to_answer += await TicketController.getNumberOfOpenTicketsWithoutCat();
        }
        res.render('./pages/faq_ag.ejs', {info:faq, autenticado:autenticado, num:numb_Tickets_to_answer});
    }
    else{
        res.status(500);
    }
}

exports.addQAtoCategory = async function(id, q, a){
    var categoryToUpdate = await this.getCategoryById(id);
    var new_qa = { pinned : false, question: q, answer: a };
    categoryToUpdate.question_answer.push(new_qa);
    categoryToUpdate.save();
}


exports.addToFAQ = async function (req, res) {
    await this.addQAtoCategory(req.body.category, req.body.pergunta, req.body.resposta);
    res.redirect('/agent/tickets');
}

exports.addNewCategoryToFAQ = async function (req, res) {
    let new_category = new FAQModel({
        category_name: req.body.category_name,
        question_answer : []
    });
    new_category.save();
    res.redirect('/agent/faq');
}

exports.addNewQA = async function (req, res) {
    var id = mongoose.Types.ObjectId(req.body.category_id);
    await this.addQAtoCategory(id, req.body.question, req.body.answer);
    res.redirect('/agent/faq');
}

exports.deleteCategory = async function (req, res) {
    var id = mongoose.Types.ObjectId(req.body.category_id);
    await FAQModel.deleteOne({ _id: id });
    res.redirect('/agent/faq');
}

exports.deleteQA = async function (req, res) {
    var id = mongoose.Types.ObjectId(req.body.category_id);
    var cat = await this.getCategoryById(id);
    cat._doc.question_answer.splice(req.body.qa_index, 1);
    cat.save();
    res.redirect('/agent/faq');
}

exports.pinQA = async function (req, res) {
    var id = mongoose.Types.ObjectId(req.body.category_id);
    var cat = await this.getCategoryById(id);
    var qa_index = req.body.qa_index;
    cat._doc.question_answer[qa_index].pinned = !cat._doc.question_answer[qa_index].pinned;
    cat.save();
    res.redirect('/agent/faq');
}


exports.editQA  = async function (req, res) {
    var array_cat = await this.getAllCategories();
    var cat = array_cat[req.body.category_index];
    if(req.body.new_question !== "")
        array_cat[req.body.category_index]._doc.question_answer[req.body.qa_index].question = req.body.new_question;
    if(req.body.new_answer !== "")
    array_cat[req.body.category_index]._doc.question_answer[req.body.qa_index].answer = req.body.new_answer;
    cat.save();
    res.redirect('/agent/faq');
}

exports.getSupport = async function (req,res,agents_logged) {
    FAQModel.find( function (err, faq) {
        if(err)
            res.status(500).send({message: err.message});
        if (faq) {
            res.render('./pages/support.ejs', {number_agents : agents_logged, cat : faq});
        }
    });
};

exports.extend_FAQ = async function (req, res){
    var id = mongoose.Types.ObjectId(req.body.category_id);
    await this.addQAtoCategory(id, req.body.question, req.body.answer);
    res.redirect('/agent/tickets');
}
