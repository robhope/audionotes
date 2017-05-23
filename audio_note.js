$(document).ready(function() {
	var api_endpoint = "https://api.audionot.es/"

	var note_id;
	var page_url = window.location.href;
	var hash_index = page_url.lastIndexOf("#");
	var slash_index = page_url.lastIndexOf("/");

	if (hash_index !== -1) {
		note_id = page_url.substring(hash_index+1);
	} else {
		note_id = page_url.substring(slash_index+1);
	}
		
	var api_request = new XMLHttpRequest();
	api_request.open( "GET", api_endpoint + note_id, true );
	api_request.onload = function(e) {
		
		if (api_request.status === 200) {
			var response_object = JSON.parse(api_request.responseText);
			
			if ( 	!("note" in response_object) ||
						!("url" in response_object["note"]) ||
						!("content_type" in response_object["note"]) ||
						!("expires" in response_object["note"])
			 		) {
				error_other();
				return;
			}
			
			var audio_element = $('<audio>', {src: response_object["note"]["url"], controls: "controls", autoplay: "autoplay"} );
			
			$('#audio_container').append(audio_element);
		
		
			$('#expiry').text( expiry_string_from_number( response_object["note"]["expires"] ) );
			$('#expiry').css('visibility', 'visible');
			
			$('#note_number').text( '#xxxx' ); // Temp
			$('#note_number').css('visibility', 'visible');
	
		} else if (api_request.status === 403) {
			error_expired();
		} else if (api_request.status === 404) {
			error_not_found();
		} else {
			error_other();
		}
		
	};
	api_request.onerror = function(e) {
		error_other();
	};
	api_request.send( null );
	
	
	
	var expiry_string_from_number = function(expiry_seconds) {
		var now_seconds = Math.round(+ new Date() / 1000);
		var delta_seconds = expiry_seconds - now_seconds;
						
		if (delta_seconds < 0) {
			return "Expired";
		} else {
			var delta_days = Math.ceil(delta_seconds / 86400);
			return "Expires in " + delta_days + (delta_days === 1 ? " day" : " days");
		}
	};
	
	var error_expired = function() {
			$('#expired').css('display', 'block');
	};
	var error_not_found = function() {
		$('#not_found').css('display', 'block');
	};
	
	var error_other = function() {
		$('#unexpected_error').css('display', 'block');
	};
	
	
	
	
});
