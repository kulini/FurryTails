//When user presses submit button, stores user input in a variable and 
$('#submitBtn').on('click', function(){
	breedInput = $('#breedInput').val().trim();
	zipInput = $('#zipInput').val().trim();

	console.log(breedInput);
	console.log(zipInput);
	youtubeQuery();
	//makes an API call to geocod.io with to translate the user's zip code into latitude & longitude co-ordinates
	zipCodeQuery();

});


//Places an ajax call to youtube API
function youtubeQuery(){
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

	console.log(firstVidId);

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
