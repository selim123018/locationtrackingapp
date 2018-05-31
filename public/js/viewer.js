var map;
var markers=new Map();

document.addEventListener('DOMContentLoaded',function(){
	var socket=io('/');

	socket.on('trackerDisconnected',function(id){
		if(markers.has(id)){
			var marker=markers.get(id);
			marker.setMap(null);
			markers.delete(id);
		}
	})

	socket.on('locationsUpdate',function(locations){
		
		locations.forEach(function([id, position]){
		  if(position.lat && position.lng){
			if(markers.has(id)){
			    var marker=markers.get(id);
				marker.setPosition(position);
			} else{
				var marker=new google.maps.Marker({
				position,
				map,
				title:id
			   })
				markers.set(id,marker);
               }
			} else{
				if(markers.has(id)){
				    var marker=markers.get(id);
				    marker.setMap(null);
				    markers.delete(id);
			    }
			}
	
		})
	})

	setInterval(function(){
		socket.emit('requestLocations');
	}, 2000)
});	


function initMap() {
	navigator.geolocation.getCurrentPosition(function(pos){
        const {latitude: lat, longitude: lng }=pos.coords;
        map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
       });
    },function(err){
	console.error(err);
   })
}
