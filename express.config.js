var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();

var app = express();
var db = new sqlite3.Database('../db/CJEB.db');

app.use(bodyParser.json());
app.listen(8000);
console.log('express server start listening 8000');

//解决跨域
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS"){
       res.send(200);//让options请求快速返回
    }else{
        next();
    }
});

app.get('/demo/:ind',function(req,res){
	var params = req.params;

	db.all("SELECT field,tabname,unit FROM fieldsdef WHERE fieldRealname = '"+ 
		  params.ind +"' limit 1", function(err, rows) {

		if(err)	console.warn(err);		
		res.json(rows);
        /*rows.forEach(function (row) {
            console.log(row);
        });*/

        // closeDb();
    });
});
//某个城市某一年某个指标
//如：/getjson/上海市/2014/GDP增长率
//所有城市某一年的某个指标
//如：getjson/allcity/2014/GDP
app.get('/getjson/:city/:year/:ind',function(req,res){
	var params = req.params;
	if(!params.ind) res.send('ind not found');

	//查到指标对应的字段
	db.all("SELECT field,tabname,unit FROM fieldsdef WHERE fieldRealname = '"+ 
		  params.ind +"' limit 1", function(err, rows) {
		
		if(err)	res.send(err);

        rows.forEach(function (row) {
			var filter =  "V4= '"+ params.year+"'"; 
			if(params.city != 'allcity')
				filter += "and V2='"+params.city+"'";

            db.all("SELECT a.FID as id,a.V4 as year,"+row.field+
            	" as value,b.cityName as cityName,b.cityCode as cityCode,b.cityProv as province,b.lat as lat,b.lng as lng FROM'"+
            	row.tabname+"' as a LEFT JOIN t_allCitys as b ON a.V2 = b.cityName WHERE "+
            	filter,function(err1,rows1){
					
					if(err1)	res.send(err1);
					rows1.forEach(function(row1){
						row1.unit = row.unit;
					})
            		res.json(rows1);
            		// closeDb();
            })
        });
    });
})
//某个城市某一年某几个指标
//如：/getjson/上海市/2014/GDP增长率,GDP
// TODO

//插入数据库的例子，带回调
function insertRows() {
    console.log("insertRows Ipsum i");
    var stmt = db.prepare("INSERT INTO lorem VALUES (?)");

    for (var i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
    }

    stmt.finalize(readAllRows);
}

//关闭数据库
function closeDb() {
    console.log("closeDb");
    db.close();
}

