//Using IIFE construct.
(function () {

    var getShouts = function(){
        /*
            Sends query to the server and asks for all the shouts for a given course_id with specified course_stage.
            Parameters are passed as a POST request.
        */
        let data = new FormData();
        //data.append('course_id', JSON.stringify(courseId));
        data.append('course_id',courseId);
        data.append('course_stage',courseProgressEstimated); //Shouts will be assigned to this stage of a course. So that Sprint#1,Sprint#2 can have separate shouts.
        let destAddress = "/course/shout_list/";
        ajaxCall("POST",destAddress, data, successMsg);
    };

    var successMsg = function(data){
        /*
            Function run after received response to getShouts function from server.
            Replaces html in 'shouts' div with proper shouts with avatar etc.
        */
        if(data != ""){
            document.getElementById('shouts').innerHTML = data;
        }
    }
        var shoutAdded = function(data){
    	console.log(data);
    }

    var addNewShout = function(){
        /*
            Sends a POST query to the server and adds a new Shout object for a given course_id & course_stage. 
        */
        let data = new FormData();
        let shoutText = document.getElementById('input_shout').value;
        data.append('shout',shoutText);
        //data.append('course_id', JSON.stringify(courseId));
        data.append('course_id',courseId);
        data.append('course_stage',courseProgressEstimated); //Shouts will be assigned to this stage of a course. So that Sprint#1,Sprint#2 can have separate shouts.
        let destAddress = "/course/shout_add/";
        ajaxCall("POST",destAddress, data, getShouts);
    };
document.getElementById('submit_shout').onclick = addNewShout;
getShouts()//run for the first time when this script is loaded.
//run getShouts function every 5000ms. In case someone posted new shout. No need to refresh whole page.
setInterval(getShouts, 5000); 

}());