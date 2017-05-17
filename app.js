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

/**
 * 接收短信猫的请求
 * 保存数据到数据库
 */
app.get('/wavecom/cgi-bin/message.pl', function (req, res, next) {
    console.log("recive wavecom...." + req.query.mobile + "在" + req.query.time + "发来消息,内容是:" + req.query.content);
    var mobile = req.query.mobile;
    var time = req.query.time;
    var content = req.query.content;

    var MongoClient = require("mongodb").MongoClient;
    MongoClient.connect("mongodb://localhost:27017/wavecom", function (err, db) {
        if (!err) {
            collection("record", function (err, collection) {
                if (!err) {
                    collection.insert({"time": time, "content": content, "mobile": mobile, "create_at": new Date()})
                    db.close();
                }
            })


        }
    })
});

app.get('/wavecom/getAll.do', function (req, res, next) {
    var MongoClient = require("mongodb").MongoClient;
    MongoClient.connect("mongodb://localhost:27017/wavecom", function (err, db) {
        if(!err){
            db.collection("record", function (err, collection) {
                if(!err){
                    collection.find({}).toArray(function (err, item) {
                        if(!err){
                            res.render("index.ejs", {"records":item});
                            db.close();
                        }
                    })

                }
            })
        }
    })
})
app.listen(port);
console.log('server running with port 3000....')