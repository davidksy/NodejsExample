var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.uer(express.static(__dirname+'/public'));

var mysql= require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'test1234',
  database : 'restful'
});
 
connection.connect();

var MongoClient = require('mongodb').MongoClient;
var dbObj= null;
// Connection URL 
var url = 'mongodb://localhost:27017/restful';
// Use connect method to connect to the Server 
MongoClient.connect(url, function(err, db) {

  console.log("Connected correctly to server"); 
  dbObj =db;
});

//전체 메시지 조회
app.get('/user/message', function(req, res){
	console.log(req.query.sender_id);
	var condition={};
	if(req.query.sender_id  != undefined){
		condition = {sender_id:req.query.sender_id};
	}
	var messages = dbObj.collection('messages');
	messages.find(condition).toArray(function(err, results){
		if(err){
			res.send(JSON.stringify(err));
		}else{
			res.send(JSON.stringify(results));
		}
	});
});

var ObjectID = require('mongodb').ObjectID;

app.get('/user/message/:id', function(req, res){

	var messages = dbObj.collection('messages');
	messages.findOne({_id:ObjectID.createFromHexString(req.params.id)},
		function(err, result){
			if(err){
				res.send(JSON.stringify(err));
			}else{
				res.send(JSON.stringify(result));
			}
		});
});

//특정 메시지 삭제
app.get('/user/message/:id', function(req, res){

});

//메시지 등록
app.post('/user/message',function(req,res) {
 	console.log(req.body.sender_id);
 	console.log(req.body.reciever_id);
 	console.log(req.body.message);
 	connection.query(
 		'select id,name from user where id=? or id=?',
 		[req.body.sender_id,req.body.reciever_id],
 		function(err, results, fields) {
 			if (err) {
 				res.send(JSON.stringify(err));
 			} else {
 				var sender = {};
 				var reciever = {};
 				for (var i = 0; i < results.length; i++){
 					if (results[i].id == 
 						Number(req.body.sender_id)) {
 						sender = results[i];
 					}
 					if (results[i].id ==
 						Number(req.body.reciever_id)) {
 						reciever = results[i];
 					}
 				}
 				var object = {
 					sender_id:req.body.sender_id,
					reciever_id:req.body.reciever_id,
 					sender:sender, reciever:reciever,
 					message:req.body.message,
 					created_at:new Date()
 				}
 				var messages = dbObj.collection('messages');
 				messages.save(object, function(err, result){
 					if (err) {
 						res.send(JSON.stringify(err));
 					} else {
 						res.send(JSON.stringify(result));
 					}
 			});
 			}
 		});
 });

//특정 메시지 삭제
app.delete('/user/message/:id', function(req, res){
	var messages = dbObj.collection('messages');
	messages.remove({_id:ObjectID.createFromHexString(req.params.id)},
		function(err, result){
			if(err){
				res.send(JSON.stringify(err));
			}else{
				res.send(JSON.stringify(result));
			}
		});
});

var users= [];

app.get('/user', function(req, res){
	connection.query('select * from user', function(err, results, fields){
		if(err){
			res.send(JSON.stringify(err));
		}else{
			if(results.length >0)
			{
			 results[0].city ='seoul';
			 res.send(JSON.stringify(results));	
			}
		}
	})	
	//res.send(JSON.stringify(users));
});

app.get('/user/:id', function(req, res){
	connection.query('select * from user where id=?', [req.params.id], 
		function(err, results, fields){
		//콜백 함수는 파라미터가 정해져있음
		if(err){
			res.send(JSON.stringify(err));
		}else{
			if(results.length >0){
				res.send(JSON.stringify(results[0]));
			}else{
				res.send(JSON.stringify({}));
			}
		}
	});
	/*
	var select_index = -1;
	for(var i=0; i< users.length; i++){
		var obj = users[i];
		if(obj.id == Number(req.params.id))
		{
			select_index = i;
			break;		
		}
	}
	if(select_index == -1){
		res.send(JSON.stringify({}));
	}else{
		res.send(JSON.stringify(users[select_index]));
	}
	*/

});

app.post('/user', function(req, res){
	connection.query('insert into user(name, age) values(?,?)',
		[req.body.name, req.body.age], function(err, result){
			if(err){
				res.send(JSON.stringify(err));
			}else{
				res.send(JSON.stringify(result));
			}
		})
	/*
	var name = req.body.name;
	var age = Number(req.body.age);
	var obj = {id:users.length+1, name:name, age:age};
	users.push(obj);
	res.send(JSON.stringify({result:true, api: 'add user info'}));
	*/
});

app.put('/user/:id', function(req, res){

	connection.query('update user set name=?, age=?, where id=?',
		[req.body.name, req.body.age, req.params.id],
		function(err, result){
			if(err){
				res.send(JSON.stringify(err));
			}else{
				res.send(JSON.stringify(result));
			}
		})	
/*
var select_index = -1;
	for(var i=0; i< users.length; i++){
		var obj = users[i];
		if(obj.id == Number(req.params.id))
		{
			select_index = i;
			break;		
		}
	}
	if(select_index == -1){
		res.send(JSON.stringify({result:false}));
	}else{
	
	var name = req.body.name;
	var age = Number(req.body.age);
	var obj = {id:users.length+1, name:name, age:age};
	users[select_index] = obj;
	res.send(JSON.stringify({result:true}));
	}
	*/	
});

app.delete('/user/:id', function(req, res){
	connection.query('delete from user where id=?', [req.params.id], function(err, result){
		if(err){
			res.send(JSON.stringify(err));
		}else{
			res.send(JSON.stringify(result));
		}
	});
	/*
var select_index = -1;
	for(var i=0; i< users.length; i++){
		var obj = users[i];
		if(obj.id == Number(req.params.id))
		{
			select_index = i;
			break;		
		}
	}
	if(select_index == -1){
		res.send(JSON.stringify({result:false}));
	}else{
		users.splice(select_index, 1);
		res.send(JSON.stringify({result:true}));
	}
	*/
});

app.listen(52273, function(){
	console.log('Server running');
});

