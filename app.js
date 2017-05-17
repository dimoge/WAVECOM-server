//引入第三方model
var express = require("express");
var path = require("path");
var bodyParser = require('body-parser');
var encoding = require("encoding");

var app = express();

app.use(bodyParser.json());//使用bod-parser中间件解析request的数据
app.use(bodyParser.urlencoded({extended: false}));
app.set("view engine", "ejs");//使用ejs作为模板引擎


var port = 3000;


app.set('view engine', 'ejs');

/**
 * 接收短信猫的请求
 * 保存数据到数据库
 */
app.get('/wavecom/cgi-bin/message.pl', function (req, res, next) {
    var mobile = req.query.mobile;
    var time = req.query.time;
    var content = encoding.convert(req.query.content, 'utf-8');

    console.log("recive wavecom...." + mobile + "在" + time + "发来消息,内容是:" + content);

    var MongoClient = require("mongodb").MongoClient;
    MongoClient.connect("mongodb://localhost:27017/wavecom", function (err, db) {
        if (!err) {
            db.collection("record", function (err, collection) {
                if (!err) {
                    collection.insert({"time": time, "content": content, "mobile": mobile}, function (err, result) {
                        db.close();
                    })
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