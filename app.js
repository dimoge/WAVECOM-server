var express = require('express');
var path = require('path');
var bodyParser = require("body-parser");
var app = express();
var port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: false}));
app.set('view engine', 'ejs');
//app.set('/public', __dirname+'/public');
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/wavecom/cgi-bin/message.pl', function(req, res, next){
  console.log("recive wavecom...."+req.query.mobile+"在"+req.query.time+"发来消息,内容是:"+req.query.content);
});

app.listen(port);
console.log('server running with port 3000....')