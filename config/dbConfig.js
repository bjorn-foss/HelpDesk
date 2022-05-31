const mongoose = require('mongoose');
var mongoDB = "mongodb+srv://DBW5:5oATnySPaIqIJazL@clusterdbw.1dbjr.mongodb.net/DBW5?authSource=admin&replicaSet=atlas-bek8xj-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true";

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'MongoDB connection error:'));
conn.on('connected', function() {
    console.log('DB connected');
});

exports.mongoose = mongoose;