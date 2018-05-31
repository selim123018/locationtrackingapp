var express=require('express');
var bodyparser=require('body-parser');
var socketio=require('socket.io');
var ejs=require('ejs');
var http=require('http');
var port=process.env.PORT || 5000;

var app=express();

app.use('/public',express.static('public'));
app.set('view engine','ejs');
var server=http.createServer(app);
var io=socketio(server);

var locationMap=new Map();

app.get('/',function(req,res){
	res.render('index');
});

io.on('connection',function(socket){
	socket.on('registerTracker',function(){
		locationMap.set(socket.id, { lat:null, lng:null });
	})
	
	socket.on('updateLocation',function(pos){
		locationMap.set(socket.id, pos);
	})

	socket.on('requestLocations',function(){
		socket.emit('locationsUpdate', Array.from(locationMap));
	})

	socket.on('disconnect',function(){
		if(locationMap.has(socket.id)){
			io.emit('trackerDisconnected', socket.id);
		    locationMap.delete(socket.id);
		}
	})
})

server.listen(port,function(err){
	if(err){
		throw err;
	}else{
		console.log('Server is running on port: '+port);
	}
})