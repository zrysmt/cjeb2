var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var async = require('async');

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
app.get('/getjson/allInd',function (req,res) {
    db.all("SELECT * FROM cjeb_ind",function(err,rows){
        if(err)	res.send(err);
        res.json(rows);
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
						row1.name = params.ind;
					})
            		res.json(rows1);
            		// closeDb();
            })
        });
    });
})
//某个城市某一年某个指标 通过指标id找
//所有城市某一年的某个指标
//如：byindid/allcity/2014/102
app.get('/byindid/:city/:year/:indId',function(req,res){
    var params = req.params;
    if(!params.indId) res.send('indId not found');

    //查到指标对应的字段
    db.all("SELECT field,tabname,fieldRealname,unit FROM fieldsdef WHERE id = '"+ 
          params.indId +"' limit 1", function(err, rows) {
        
        if(err) res.send(err);

        rows.forEach(function (row) {
            var filter =  "V4= '"+ params.year+"'"; 
            if(params.city != 'allcity')
                filter += "and V2='"+params.city+"'";

            db.all("SELECT a.FID as id,a.V4 as year,"+row.field+
                " as value,b.cityName as cityName,b.cityCode as cityCode,b.cityProv as province,b.lat as lat,b.lng as lng FROM'"+
                row.tabname+"' as a LEFT JOIN t_allCitys as b ON a.V2 = b.cityName WHERE "+
                filter,function(err1,rows1){
                    
                    if(err1)    res.send(err1);
                    rows1.forEach(function(row1){
                        row1.unit = row.unit;
                        row1.name = row.fieldRealname;
                    })
                    res.json(rows1);
                    // closeDb();
            })
        });
    });
})
//某个城市某一年某几个指标
//最后按指标显示[[],[],[],[]]
//如：/byindids/上海市/2014/101,102,103,143
//所有城市某一年的某个指标
//如：byindids/allcity/2014/101,102,103,143
app.get('/byindids/inds/:city/:year/:indId',function(req,res){
    var params = req.params;
    if(!params.indId) res.send('indId not found');
    var resRow = {};
    //查到指标对应的字段
    db.all("SELECT field,tabname,fieldRealname,unit FROM fieldsdef WHERE id in ("+ 
          params.indId +")", function(err, rows) {
        if(err) res.send(err);
        
        var filter =  "V4= '"+ params.year+"'"; 
        if(params.city != 'allcity')
            filter += "and V2='"+params.city+"'";

        async.map(rows,function(row,callback){
            db.all("SELECT a.FID as id,a.V4 as year,"+row.field+
                " as value,b.cityName as cityName,b.cityCode as cityCode,b.cityProv as province,b.lat as lat,b.lng as lng FROM'"+
                row.tabname+"' as a LEFT JOIN t_allCitys as b ON a.V2 = b.cityName WHERE "+
                filter,function(err1,rows1){
                    
                    if(err1)    res.send(err1);
                    rows1.forEach(function(row1){
                        row1.unit = row.unit;
                        row1.name = row.fieldRealname;
                    })
                    callback(null,rows1);
            });
        },function(asyncErr,results){
            res.json(results);
        })

    });
});
//某个城市某一年某几个指标
//最后按城市显示[[],[],[],[],...,[]] 按照城市进行分类
//如：/byindids/citys/上海市/2014/101,102,103,143
//所有城市某一年的某个指标
//如：byindids/citys/allcity/2014/101,102,103,143
app.get('/byindids/citys/:city/:year/:indId',function(req,res){
    var params = req.params;
    if(!params.indId) res.send('indId not found');
    var resRow = {};
    //查到指标对应的字段
    db.all("SELECT field,tabname,fieldRealname,unit FROM fieldsdef WHERE id in ("+ 
          params.indId +")", function(err, rows) {
        if(err) res.send(err);
        
        var filter =  "V4= '"+ params.year+"'"; 
        if(params.city != 'allcity')
            filter += "and V2='"+params.city+"'";

        async.map(rows,function(row,callback){
            db.all("SELECT a.FID as id,a.V4 as year,"+row.field+
                " as value,b.cityName as cityName,b.cityCode as cityCode,b.cityProv as province,b.lat as lat,b.lng as lng FROM'"+
                row.tabname+"' as a LEFT JOIN t_allCitys as b ON a.V2 = b.cityName WHERE "+
                filter,function(err1,rows1){
                    
                    if(err1)    res.send(err1);
                    rows1.forEach(function(row1){
                        row1.unit = row.unit;
                        row1.name = row.fieldRealname;
                    })
                    callback(null,rows1);
            });
        },function(asyncErr,results){
            var obj = {},res1 = {};
            results.forEach(function(items,indexs){
                items.forEach(function(it,ind){
                    if(it.cityName){
                        if(obj[it.cityName]){
                            res1[it.cityName].push(it);
                        }else{
                            res1[it.cityName] = [];
                            res1[it.cityName].push(it);
                            obj[it.cityName] = true;
                        }                        
                    }
                })
            })
            res.json(res1);
        })

    });
})
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

