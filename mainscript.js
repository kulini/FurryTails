//GLOBAL VARIABLES
//user input from the search fields
var breedInput;
var zipInput;
//initializing the variable for the google map
var map;

//When user presses submit button, store user input in a variable and...
$('#submitBtn').on('click', function(){
	breedInput = $('#breedInput').val().trim();
	zipInput = $('#zipInput').val().trim();

	//make an API call to youtube for a video with the breedInput as query keyword
	youtubeQuery();
	//make an API call to geocod.io with to translate the user's zip code into latitude & longitude co-ordinates
	userZipCodeQuery();
	//make an API call to rescuegroups.org with user's zip code (zipInput)
	rescueGroupsQuery();
});


//Places an ajax call to youtube API
function youtubeQuery(){
	//breedInput is user's entry in the text field
	var animalBreed = breedInput;
	var	APIkey = "AIzaSyBF2-UAzVkNHsKCPjqK91XBV4slMveK4Gs";
	var	baseURL = "https://www.googleapis.com/youtube/v3/search?";
	var queryURL = baseURL + 'part=snippet&key=' + APIkey + '&q=' + animalBreed + 'dog%20heartwarming';

	$.ajax({
		url: queryURL,
		method: "GET"
	}).done(function(response){
		//see below for desc
		displayYoutube(response);
	});
}

//Places youtube iframe vid in the HTML
function displayYoutube(data){
	$('.youtube').html('');

	//randomize selection of video
	var itemsIndex = Math.floor(Math.random()*5);
	var firstVidId = data.items[itemsIndex].id.videoId;

	// console.log(firstVidId);
	//display youtube video in HTML
	var iframeURL = 'https://youtube.com/embed/' + firstVidId;
	console.log('video url: ' + iframeURL);
	var youtubeVid = $('<iframe>');
	youtubeVid.attr('width', 420);
	youtubeVid.attr('height', 315);
	youtubeVid.attr('frameborder', 0);
	youtubeVid.attr('src', iframeURL);
	$('.youtube').append(youtubeVid);
}

function userZipCodeQuery(){
	var userZip = zipInput;
	//Geocodio API
	var APIkey = '8e4e51c5c74dfc7cf55e8e7788c7fce46c55e5d';
	var baseURL = 'https://api.geocod.io/v1/geocode?api_key=';
	var queryURL = baseURL+ APIkey + '&q=' + userZip;

	var latitude = '';
	var longitude = '';

	$.ajax({
		url: queryURL,
		method: 'GET'
	}).done(function(response){	
		latitude = response.results[0].location.lat;
		longitude = response.results[0].location.lng;
		
		//call function that initializes google map centered on user location
		initMap(latitude, longitude);
	});
}

//This function is called inside rescueGroupsQuery() in a for loop for each pet returned by query
//convert city & state of each pet into an object containg lat and long
//addMarker(), which  is called within this function
function petZipCodeQuery(petinfo){

	var animalAddress = petinfo.location;
	//Geocodio API
	var APIkey = '8e4e51c5c74dfc7cf55e8e7788c7fce46c55e5d';
	var baseURL = 'https://api.geocod.io/v1/geocode?api_key=';
	var queryURL = baseURL+ APIkey + '&q=' + animalAddress;

	var latitude = '';
	var longitude = '';

	$.ajax({
		url: queryURL,
		method: 'GET'
	}).done(function(response){	
		latitude = response.results[0].location.lat;
		longitude = response.results[0].location.lng;

		//create an object with latitude and longitude
		var latAndLng = {
			'lat': latitude,
			'lng': longitude
		}

		addMarker(latAndLng, petinfo);
	});
}

function rescueGroupsQuery(){
	//User input for zipcode
	zipInput = $('#zipInput').val().trim();
	breedInput = $('#breedInput').val().trim();

	var searchObj = {
		"apikey":"2mV1s2Z2",
		"objectType":"animals",
		"objectAction":"publicSearch",
		"search":
			{
				"calcFoundRows":"Yes",
				"resultStart":0,
				"resultLimit":10,
				//Info that is available about a pet
				"fields":
					[	"animalName", 
						"animalSpecies", 
						"animalPictures",
						"animalLocationPublic",
						"animalSizeCurrent",
						"animalLocationCitystate",
						"animalStatus",
						"animalLocationZipcode",
						"animalBreed",
						"animalSex",
						"animalHousetrained",
						"animalGeneralAge",
						"animalDescription",
						"animalNotes",
						"animalObedienceTraining",
						"animalOKWithAdults", 
						"animalAdoptionPending", 
						"animalPrimaryBreed", 
						"animalSizeCurrent", 
						"animalSummary",  
						"ownerAddress",
						"locationAddress", 
						"locationAnimals", 
						"contactCompany", 
						"locationPhone", 
						"locationName", 
						"animalColor" ],

				// SEARCH PARAMETERS for query
				"filters":
					[
						{"fieldName":"animalSpecies",
						"operation":"equals",
						"criteria":"dog"},

						{"fieldName":"animalBreed",
						"operation":"contains",
						"criteria": breedInput},
	// {"fieldName":"animalBreed","operation":"equals","criteria": breedInput},
						{"fieldName":"animalLocationDistance",
						"operation":"radius",
						"criteria":"100"},

						{"fieldName":"animalLocation",
						"operation":"equals",
						"criteria": zipInput},

						{"fieldName":"animalStatus",
						"operation":"equals",
						"criteria":"Available"},

						// {"fieldName": "locationAddress", 
						// "operation": "notblank", 
						// "criteria": "true"},

						// {"fieldName": "locationPhone", 
						// "operation": "notblank", 
						// "criteria": "true"},

						// {"fieldName": "animalHousetrained", 
						// "operation": "notblank", 
						// "criteria": "true"}
					]//END filters array
			}//END 'search' object 
	}; //END 'searchObj' object
	var encoded = JSON.stringify(searchObj);

	// console.log("https://api.rescuegroups.org/http/json/?data=" + encoded)
	 
	$.ajax({
	  url: "https://api.rescuegroups.org/http/json/?data=" + encoded, 
	  dataType: "jsonp",
	  success: function(response) {
	        if (response.foundRows) {
	        	document.getElementById('adoptedPetsCount').innerHTML = 'Pets available for adoption: ' + response.foundRows;
	        }

	        // USE LO DASH " _. " TO TRANSFORM AN OBJECT TO AN ARRAY
	        var animalName = _.toArray(response.data);
	 		// console.log(animalName);
	 		var location; 
			
			for(var i=0; i<animalName.length; i++) {
				//fetch the City and State of each pet from the API call
				location = animalName[i].animalLocationCitystate;
				//convert location data to string
				location = location.toString();

				//fetch info about each pet
				var petphoto = animalName[i].animalPictures[0].urlInsecureThumbnail;
				var petname = animalName[i].animalName;
				var petphone = animalName[i].locationPhone;
				var petlocation = animalName[i].animalLocationCitystate;
				var petnotes = animalName[i].animalNotes;
				var petbreed = animalName[i].animalPrimaryBreed;
				var petsex = animalName[i].animalSex;
				var age = animalName[i].animalGeneralAge;
				
				//object containing pet info is passed onto petZipCodeQuery() below
				var petinfo = {
					location: location,
					name: petname,
					petphoto: petphoto,
					petphone: petphone,
					petlocation: petlocation,
					petbreed: petbreed,
					petsex: petsex,
					age: age
				};
				//if there are notes on the pet, the info is appended to petinfo{} object
				if (petnotes) petinfo['petnotes'] = petnotes;
				//this function converts pet's location to lat & lang, and passes on petinfo{} obj to addMarker()
				petZipCodeQuery(petinfo);	
			}

	  },
	  error: function(xhr, status, error) {
	    console.log('error');
	  }
	}); 
} //END rescueGroupsQuery()


///////////////////////////////
////GOOGLE MAPS CODE BELOW/////
///////////////////////////////

//This function is called by zipCodeQuery(), which supplies the parameters here.
//Center the map with user's zipcode. 
function initMap(latitude, longitude) {
	var myLatLng = {lat: latitude, lng: longitude};

	var googleMapOptions = {
	zoom: 9,
	center: myLatLng,
	draggable: true
	};
	
	//create new map on HTML in div#map
	map = new google.maps.Map(document.getElementById("map"), googleMapOptions);

	//place a marker with user's location
	var marker = new google.maps.Marker({
        position: myLatLng,
        map: map
	});

	//create a pop-up info window for the map marker
	var infowindow = new google.maps.InfoWindow({
		content: 'This is your location!'
	});

	//create an event listener for the infowindow
	marker.addListener('mouseover', function() {
      infowindow.open(map, this);
      //infowindow closes automatically after 2 secs
      setTimeout(function () { infowindow.close(); }, 2000);
    });
}


//Called by petZipCodeQuery(), which in turn is called in a for loop in rescueGroupsQuery()
//used to populate a marker for each pet
function addMarker(location, petinfo) {

	var myLatLng = {lat: location.lat, lng: location.lng};
	// console.log('location: ' + location.lat + ' ' +location.lng);	

	//content of popup infowindow for each marker on the map
	var contentString = '<img width="150px" src = "' + 
		petinfo.petphoto+ '">' + 
		'<p>'+ petinfo.name + '</p>' + 
		'<p>' + petinfo.petphone + '</p>' +
		'<p>' + petinfo.petlocation + '</p>' +
		'<p>' + petinfo.petbreed + '</p>' +
		'<p>' + petinfo.petsex + '</p>' + 
		'<p>' + petinfo.age + '</p>'
		;

	//if a pet comes with additional notes, the info is appended to the infowindow
	if (petinfo.petnotes) contentString = contentString + '<p>' + petinfo.petnotes + '</p>';

	//create new infowindow. its contents are in contentString
	var infowindow = new google.maps.InfoWindow({
		content: contentString
	});

	//create new marker
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: pawIcon,
        // title: "pet info",
        animation: google.maps.Animation.DROP,
        draggable: true
    });

    //crate event listener for each marker
    marker.addListener('mouseover', function() {
      infowindow.open(map, marker);
      marker.addListener('mouseout', function(){
      	infowindow.close();
      });
    });
}

