export default function getCurrentUserLocation(): PlaceLocation {

	let location: PlaceLocation = {
		name: "",
		latitude: 0,
		longtitude: 0
	};

	if (navigator != null && navigator.geolocation != null) {
		navigator.geolocation.getCurrentPosition((position) => {
			location.latitude = position.coords.latitude,
			location.longtitude = position.coords.longitude
			return location;
		}, (error) => {
			console.error(error);
		});
	} else {
		console.log("Geolocation not supported");
	}

	return location;
}