//When user presses submit button, stores user input in a variable and 
$('#submitBtn').on('click', function(){
	breedInput = $('#breedInput').val().trim();
	zipInput = $('#zipInput').val().trim();

	console.log(breedInput);
	console.log(zipInput);
	//make an API call to youtube for a video with the breedInput as query keyword
	youtubeQuery();
	//make an API call to geocod.io with to translate the user's zip code into latitude & longitude co-ordinates
	zipCodeQuery();
	//make an API call to rescuegroups.org with user's zip code (zipInput)
	rescueGroupsQuery();
});


//Places an ajax call to youtube API
function youtubeQuery(){
	//breedInput is user's entry in the text field
	var animalBreed = breedInput;
	var	APIkey = "AIzaSyBF2-UAzVkNHsKCPjqK91XBV4slMveK4Gs";
	var	baseURL = "https://www.googleapis.com/youtube/v3/search?";
	var queryURL = baseURL + 'part=snippet&key=' + APIkey + '&q=' + animalBreed + '%20heartwarming';

	$.ajax({
		url: queryURL,
		method: "GET"
	}).done(function(response){
		//see below for desc
		parseYoutube(response);
	});
}

//Places youtube iframe vid in the HTML
function parseYoutube(data){
	$('.youtube').html('');
	var itemsIndex = Math.floor(Math.random()*5);
	var firstVidId = data.items[itemsIndex].id.videoId;

	// console.log(firstVidId);

	var iframeURL = 'https://youtube.com/embed/' + firstVidId;
	console.log(iframeURL);
	var youtubeVid = $('<iframe>');
	youtubeVid.attr('width', 420);
	youtubeVid.attr('height', 315);
	youtubeVid.attr('frameborder', 0);
	youtubeVid.attr('src', iframeURL);
	$('.youtube').append(youtubeVid);
}

function zipCodeQuery(){

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
		//testing
		console.log(response.results[0].location.lat);		
		console.log(response.results[0].location.lng);	

		//calls function that displays google map
		initMap(latitude, longitude);
	});
}


function rescueGroupsQuery(){
	//User input for zipcode
	zipInput = $('#zipInput').val().trim();
	breedInput = $('#breedInput').val().trim();

	var thing = {"apikey":"2mV1s2Z2","objectType":"animals","objectAction":"publicSearch","search":{"calcFoundRows":"Yes","resultStart":0,"resultLimit":10,

	// THIS IS WHAT INFORMATION WILL SHOW IN THE DATA
	"fields":["animalName", "animalSpecies", "animalPictures","animalLocationPublic","animalSizeCurrent","animalLocationCitystate","animalStatus","animalLocationZipcode","animalBreed","animalSex","animalHousetrained","animalGeneralAge","animalDescription","animalNotes","animalObedienceTraining","animalOKWithAdults", "animalAdoptionPending", "animalPrimaryBreed", "animalSizeCurrent", "animalSummary",  "ownerAddress","locationAddress", "locationAnimals", "contactCompany", "locationPhone", "locationName", "animalColor" ],

	// THESE ARE THE SEARCH PARAMETERS TO SPECIFICALLY FIND WHAT ANIMAL
	"filters":[
	{"fieldName":"animalSpecies","operation":"equals","criteria":"dog"},
	// {"fieldName":"animalBreed","operation":"equals","criteria": breedInput},
	{"fieldName":"animalLocationDistance","operation":"radius","criteria":"90"},
	{"fieldName":"animalLocation","operation":"equals","criteria":zipInput},
	{"fieldName":"animalStatus","operation":"equals","criteria":"Available"},
	{"fieldName": "locationAddress", "operation": "notblank", "criteria": "true"},
	{"fieldName": "locationPhone", "operation": "notblank", "criteria": "true"},
	{"fieldName": "animalHousetrained", "operation": "notblank", "criteria": "true"}

	]//END filters array
	}//END inner object 
	}; //END 'thing' object
	var encoded = $.toJSON(thing)

	// console.log("https://api.rescuegroups.org/http/json/?data=" + encoded)
	 
	$.ajax({
	  url: "https://api.rescuegroups.org/http/json/?data=" + encoded, 
	  dataType: "jsonp",
	  success: function(data) {
	        if (data.foundRows) {
	        	document.getElementById('adoptedPetsCount').innerHTML = 'Pets available for adoption: ' + data.foundRows;
	        }
	        console.log(data);
	        // USE LO DASH " _. " TO TRANSFORM AN OBJECT TO AN ARRAY
	        var animalName = _.toArray(data.data);
	 		console.log(animalName);

			for(var i=0; i<animalName.length; i++) {
				console.log(animalName[i].animalName);
				console.log(animalName[i].animalBreed);
				console.log(animalName[i].animalSex);
				console.log(animalName[i].animalColor);
				console.log(animalName[i].animalPictures[0].urlSecureFullsize)
				console.log(animalName[i].animalObedienceTraining)
				console.log(animalName[i].animalHousetrained);
				console.log(animalName[i].animalGeneralAge);
				console.log(animalName[i].locationName);
				console.log(animalName[i].locationAddress);
				console.log(animalName[i].animalLocationCitystate);
				console.log(animalName[i].locationPhone);
				console.log("========================================")
			}
	  },
	  error: function(xhr, status, error) {
	    console.log('error');
	  }
	}); 
}
