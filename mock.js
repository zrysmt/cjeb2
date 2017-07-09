var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();
app.use(bodyParser.json());
app.listen(8888);
console.log('server start');


var home = require('./mock/home/home.json');
var indview = require('./mock/indview/indview.json');

//解决跨域
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS"){
       res.send(200);/*让options请求快速返回*/
    }else{
        next();
    }
});

// get方式
app.get('/home', function (req, res) {
    res.send(home);
});
app.get('/indview/:host',function(req,res){
    res.send(display);
    /*request('http://'+req.params.host+':8888/display', {timeout: 500}, function (error, response, body) {
        if(error){
            var json = {}
            json.Error = error.code
            res.json(json)
        }else if (response.statusCode == 200) {
            res.json(body)
        }else{
            var json = {}
            json.statusCode = response.statusCode
            res.json(json)
        }
    });*/
})
