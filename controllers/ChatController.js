const ChatModel = require('../models/ChatSchema');

const FAQController = require("./FAQController");

exports.page_chat = async function (req, res) {
    var arr_cats_of_agent = [];
    var faq = await FAQController.findall();

    if(req.user){
        var user_obj = req.user._doc;
        var arr_cats_of_agent = [];
        for (let index in user_obj.categories) {// user._doc.categories) {  //for each category of the agent
            var faq_extra = await FAQController.getCategoryById(user_obj.categories[index]);
            arr_cats_of_agent.push(faq_extra);
        }
        res.render('./pages/chat.ejs',{ cats_of_agent :arr_cats_of_agent , faq: faq ,autorized : true});
    }
    else{
        res.render('./pages/chat.ejs',{ cats_of_agent :arr_cats_of_agent , faq: faq  ,autorized : false });
    }
}
