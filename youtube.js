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

//When user presses submit button, stores user input in a variable and 
$('#submitBtn').on('click', function(){
	breedInput = $('#breedInput').val().trim();
	console.log(breedInput);
	youtubeQuery();

});
