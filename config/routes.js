//initialization of packages and use of vital package functions
        const express = require('express');
        const router = express.Router();
        router.use(express.static('assets'));

        const bodyParser = require("body-parser");

        //calls to the controllers
        var agentController = require('../controllers/agentController');
        var ticketController = require('../controllers/ticketController');
        var FAQController = require('../controllers/FAQController');
        var ChatController = require('../controllers/ChatController');

        //for sessions and cookies
        const passport = require('passport');
        var agents_logged = 0;

// routes
        //common user

router.get('/',(req,res)=>{
    // console.log(req.session);
    res.render( './pages/homepage.ejs');
})

router.get('/FAQ',(req,res)=>{
    FAQController.faq_page(req, res);
})

router.get('/Tickets',(req,res)=>{
    FAQController.pageTickets(req, res);
})

router.post('/Tickets', function (req, res) {
    ticketController.createTicket(req, res);
});

router.post('/agent/tickets/extendFAQ', function (req, res) {
    FAQController.extend_FAQ(req, res);
});

router.get('/Support',(req,res)=>{
    FAQController.getSupport(req,res,agents_logged);

})

router.get('/LogIn',(req,res)=>{
    res.render('./pages/login.ejs');
})

router.get('/SignUp',(req,res)=>{
    res.render('./pages/signUp.ejs');
})

router.get('/chat',(req,res)=>{
    ChatController.page_chat(req, res);
});

router.post('/chat/Tickets',(req,res)=>{
    ticketController.createTicketFromChat(req, res);
});







            //agent_side
router.get('/agent/tickets',(req,res)=>{
    if(req.user !== null)
        agentController.page_Tickets(req, res);
    else
        res.send(200);
})

router.post('/agent/tickets',(req,res)=>{
    if(req.user !== null)
        agentController.page_Tickets_Details(req, res);
    else
        res.send(200);
})

router.post('/agent/tickets/send',(req,res)=>{
    ticketController.update_ticket(req, res);
})

router.post('/agent/tickets/close',(req,res)=> {
    ticketController.close_ticket(req, res);
});

router.post('/agent/tickets/reopen',(req,res)=>{
    ticketController.reopen_ticket(req, res);
});

router.post('/agent/tickets/extendFAQ',(req,res)=>{
    FAQController.addToFAQ(req, res);
})

router.get('/agent/chat',(req,res)=>{
    if(req.user !== null)
        ChatController.page_chat(req, res);
    else
        res.send(200);
});

router.get('/agent/faq',(req,res)=>{
    if(req.user !== null)
        FAQController.faq_page(req, res);
    else
        res.send(400);
});

router.post('/agent/faq/addCategory',(req,res)=>{
        FAQController.addNewCategoryToFAQ(req, res);
});

router.post('/agent/faq/addQA',(req,res)=>{
    FAQController.addNewQA(req, res);
});

router.post('/agent/faq/deleteCategory',(req,res)=>{
    FAQController.deleteCategory(req, res);
});

router.post('/agent/faq/deleteQA',(req,res)=>{
    FAQController.deleteQA(req, res);
});

router.post('/agent/faq/pin',(req,res)=>{
    FAQController.pinQA(req, res);
});

router.post('/agent/faq/editQA',(req,res)=>{
    FAQController.editQA(req, res);
});


router.get('/agent',(req,res)=>{
    if(req.user !== null)
        res.render('./pages/ ');
    else
        res.send(400);
});

router.get('/just_logged_in',(req,res)=>{
    agents_logged += 1;
    res.redirect('/agent/tickets');
});

router.get('/agent/chat',(req,res)=>{
    if(req.user !== null)
        ChatController.page_chat(req, res);
    else
        res.send(400);
});




            //Log In
router.post( "/logIn", passport.authenticate("local", {
        successRedirect: "/just_logged_in",
        failureRedirect: "/logIn",
    })
);

router.get( "/logOut",(req, res) => {
    const socketId = req.session.socketId;
    if (socketId && io.of("/").sockets.get(socketId)) {
        io.of("/").sockets.get(socketId).disconnect(true);
    }
    req.logout();
    res.cookie("connect.sid", "", {expires: new Date()});
    res.redirect("/");
    agents_logged -= 1;
});




module.exports = router;