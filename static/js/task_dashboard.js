//Using IIFE construct.
(function () {
    'use strict';
/*    console.log(stories);
    let destAddress= "/task_dashboard/story_list" + courseId + "/";
    let data = new FormData();
    data.append("story_id", serverId);
    ajaxCall("POST",destAddress, data, gotStories);
    */

    /*Defining actions for arrow buttons that will change between stories..*/
    var  clickArrowDown = function(){
    	/*On arrow up increase a buttonCounter.*/
    	if(buttonCounter < stories.length -1 && storyLocked == false){
    		buttonCounter++;
    		console.log(buttonCounter);
    		updateStoryOnDashboard();
       	}
    }
    var clickArrowUp = function(){
    	/*On arrow up decrease a buttonCounter.*/
    	if(buttonCounter > 0 && storyLocked == false ){
    		buttonCounter--;
    		console.log(buttonCounter);
    		updateStoryOnDashboard();
    	}
    }
    var clickAccept = function(){
    	/*
			Checks storyLocked variable. If storyLocked is true then unlocks ability to choose between stories.
			If storyLocked is false then blocks ability to choose between stories and allows user to make changes
			in the code that is linked to the story. 
    	*/
    	if(storyLocked == false){
    		storyLocked = true;
    		document.getElementById("dashboard-button-accept").className = "btn btn-pagination red";
    		document.getElementById("dashboard-button-accept-text").innerHTML = "Browse other stories.";
    		document.getElementById("dashboard-lock-icon").className = "ion-locked";
    		document.getElementById("dashboard-story-container").className = "dashboard-story-container-grey";    
    		//document.getElementById("dashboard-story-content").className = "dashboard-story-content-grey";
    		document.getElementById("dashboard-story-name").className = "dashboard-story-name-grey";   
    		updateStoryOnDashboard();
    		alert("Switching between stories has been disabled. Please finish your work on your currently selected story and send results to server or abandon any changes and go to other story.")
    	}
    	else{
    		storyLocked = false;
    		document.getElementById("dashboard-button-accept").className = "btn btn-pagination";
    		document.getElementById("dashboard-button-accept-text").innerHTML = "Edit solution";
    		document.getElementById("dashboard-lock-icon").className = "ion-unlocked";
    		
			document.getElementById("dashboard-story-content").className = "";
    		document.getElementById("dashboard-story-name").className = "";    
    		document.getElementById("dashboard-story-container").className = ""; 
    		updateStoryOnDashboard();

            //Update edited story
/*            let destAddress = "/course/get_story_solutions/" + courseId + "/";
            let data = new FormData();
            data.append("sprint", 1);
            ajaxCall("POST",destAddress, data, function(data){return;});*/

    	}
    }

     var initializeTaskDashboard = function(){
     	if(stories.length > 0){
     		updateStoryOnDashboard();
     	}
     }

     var updateStoryOnDashboard = function(){
     	/*
			Changes html content of web page to show story that corresponds with buttonCounter.
			If storyLocked is true then user can edit solution of the story.
     	*/
     	if(storyLocked == true){
	 		document.getElementById("dashboard-story-name").innerHTML = stories[buttonCounter].name + " (locked)";
	 		document.getElementById("dashboard-source").disabled = false;
     	}
     	else{
	 		
	 		document.getElementById("dashboard-source").disabled = true;
	 		document.getElementById("dashboard-story-name").innerHTML = stories[buttonCounter].name;
	 		document.getElementById("dashboard-story-content").innerHTML = stories[buttonCounter].content;
     		document.getElementById("dashboard-source").value = stories[buttonCounter].solution;	
     	}
     }
     var saveStorySolution = function(){
        /*
            Launched after user clicks a button and sends changes to server.
        */
     	if(storyLocked == true){
	     	let destAddress = "/course/save_story_solution/" + courseId + "/";
	        let data = new FormData();
	        data.append("story_id", stories[buttonCounter].id);
	        data.append("story_name", stories[buttonCounter].name);
	        data.append("story_content", stories[buttonCounter].content);
	        data.append("story_solution", document.getElementById("dashboard-source").value);
	        ajaxCall("POST",destAddress, data, function(){return false;});

            //And change element in stories array to match currently made change, so that there is no need to
            //query a server again for an updated list of stories and theid solutions.
            stories[buttonCounter].solution = document.getElementById("dashboard-source").value;  
	    }
     }
     /*MAIN*/
     //stories array is declared in 3_task_dashboard.html which was returned from server.
    document.getElementById("dashboard-button-up").onclick = clickArrowUp;
    document.getElementById("dashboard-button-down").onclick = clickArrowDown;
    document.getElementById("dashboard-button-accept").onclick = clickAccept;
    document.getElementById("command_save_progress").onclick = saveStorySolution;
    var storyLocked = false;
    var buttonCounter = 0;//will indicate index of stories[i]
    initializeTaskDashboard();

})();