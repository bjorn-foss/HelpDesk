const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const AgentModel = require('../models/AgentSchema');


passport.use(new LocalStrategy(
    function(username, password, done) {
        AgentModel.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {return done(null, false); }
            if (!user.verifyPassword(password)) { return done(null, false); }
            return done(null, user);
        });
    }
));

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    AgentModel.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});
