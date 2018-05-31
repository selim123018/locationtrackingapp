document.addEventListener('DOMContentLoaded',function(){
	var socket=io('/');
	socket.emit('registerTracker');

	var positionOptions={
		enableHighAccuracy:true,
		maximumAge: 0
	}

	setInterval(function(){
        console.log('tick');
        navigator.geolocation.getCurrentPosition(function(pos){
        const {latitude: lat, longitude: lng }=pos.coords;
        socket.emit('updateLocation', { lat, lng })   
	    },function(err){
		console.error(err);
	    },positionOptions)
	}, 2000)
})