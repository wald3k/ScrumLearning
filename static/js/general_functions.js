//This file can hold functions that can be used by different functions from different files i.e. Ajax calls
var getUserId = function(userId){
    alert("User id is: " + userId);
};

// Find the CSRF Token cookie value
function parse_cookies() {
    var cookies = {};
    if (document.cookie && document.cookie !== '') {
        document.cookie.split(';').forEach(function (c) {
            var m = c.trim().match(/(\w+)=(.*)/);
            if(m !== undefined) {
                cookies[m[1]] = decodeURIComponent(m[2]);
            }
        });
    }
    return cookies;
}
var cookies = parse_cookies();

var helper = function(){
	var request = new XMLHttpRequest();
	var received_message;
	request.open('POST', '/course/helper/',true);
	request.setRequestHeader('X-CSRFToken', cookies['csrftoken'],"Content-Type", "application/x-www-form-urlencoded");  
	request.onreadystatechange = function() {
	  if (request.status >= 200 && request.status < 400) {
	    // Success!
      	if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      		received_message = request.responseText;
			//console.log(request.myString); // This server reply won't be printed to console properly.
			received_message = JSON.parse(request.responseText);
			let helpInfo = received_message['myString'];

			// Get the modal
			var modal = document.getElementById('modal-helper');
			// Get the <span> element that closes the modal
			document.getElementById("modal-helper-close").onclick=helper;

			if(modal.style.display == "block"){
				modal.style.display = "none";
			}else{
				modal.style.display = "block";
				document.getElementById("helper-message").innerHTML = helpInfo;
			}
			// When the user clicks anywhere outside of the modal, close it
			window.onclick = function(event) {
			    if (event.target == modal) {
			        modal.style.display = "none";
			    }
			} 
		}
	  } else {
	    // We reached our target server, but it returned an error
	  }
	};
	request.onload = function () {
		result = request.responseText;
	}

	request.onerror = function() {
	  // There was a connection error of some sort
		console.log("here2");
	};
	var data = new FormData();
	data.append('course_stage', courseProgressEstimated);
	request.send(data);
};
/****************************************************************************************/
/*AJAX GENERIC QUERY METHOD that can be used from different files for multiple purposes.*/
/****************************************************************************************/
var ajaxCall = function(type, destAddress, data, successFunction){
	/*
	type i.e. POST, GET
	destAddress i.e /course/get_stickers/3/
	data some FormData that is passed to the view.
	successFunction is a reference to a function that will be called if request was successfull.
	*/
	var request = new XMLHttpRequest();
	var received_message;
	request.open(type, destAddress, true);
	request.setRequestHeader('X-CSRFToken', cookies['csrftoken'],"Content-Type", "application/x-www-form-urlencoded");  
	request.onreadystatechange = function() {
	  if (request.status >= 200 && request.status < 400) {
	    // Success!
      	if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      		//Call success function with response text.
      		successFunction(request.responseText);
		}
	  } else {
	    // We reached our target server, but it returned an error
	  }
	};
	request.onload = function () {
		//Not used
	}
	request.onerror = function() {
	  // There was a connection error of some sort
		console.log("Connection error occured.");
	};
	request.send(data);
};

//Ajax test
var result;
var ajax_test = function(){
	var request = new XMLHttpRequest();
	var received_data
	request.open('POST', '/dupa/',true);
	request.setRequestHeader('X-CSRFToken', cookies['csrftoken'],"Content-Type", "application/x-www-form-urlencoded");  
	request.onreadystatechange = function() {
	  if (request.status >= 200 && request.status < 400) {
	    // Success!
      	if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
			console.log(request.responseText);
		}
	  } else {
	    // We reached our target server, but it returned an error
	  }
	};
	request.onload = function () {
		result = request.responseText;
	}

	request.onerror = function() {
	  // There was a connection error of some sort
		console.log("here2");
	};
	var data = new FormData();
	data.append('test', 'person');
	data.append('test2',{'test3':'some value here'});
	request.send(data);

};

var myFunc = function(){
	    alert(result);
	    console.log(result);
}

var dzienDobry = function(){
	alert("Dzien dobry!");
};


var isCourseStageUnlocked = function(progress_estimated, progress_current){
	//Returns a boolean value if given course stage is unlocked by the scrum master.
	if(progress_estimated <= progress_current){
		return true
	}
	else{
		return false;
	}
};

var set_course_progress = function(){
	//Sets a progress for a selected course
	alert("Changing progess");
	if(isCourseStageUnlocked === true){
		console.log("Stage is already unlocked!");
		return;
	}
	var request = new XMLHttpRequest();
	request.open('POST', '/course/' + courseId + '/set_progress/',true);
	request.setRequestHeader('X-CSRFToken', cookies['csrftoken'],"Content-Type", "application/x-www-form-urlencoded");  
	request.onreadystatechange = function() {
	  if (request.status >= 200 && request.status < 400) {
	    // Success!
      	if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
			console.log(request.responseText);
		}
	  } else {
	    // We reached our target server, but it returned an error
	  }
	};
	request.onload = function () {
		result = request.responseText;
		location.reload();
	}
	request.onerror = function() {
		console.log("There was a connection error of some sort");
	};
	var data = new FormData();
	data.append('new_progress', courseProgressEstimated);
	request.send(data);
};
