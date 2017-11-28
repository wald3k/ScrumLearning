//Using IIFE construct.
(function () {

    var getShouts = function(){
        let data = new FormData();
        //data.append('course_id', JSON.stringify(courseId));
        data.append('course_id',courseId);
        data.append('course_stage',courseProgressEstimated); //Shouts will be assigned to this stage of a course. So that Sprint#1,Sprint#2 can have separate shouts.
            let destAddress = "/course/shout_list/";
            ajaxCall("POST",destAddress, data, successMsg);
    };

    var successMsg = function(data){
        if(data != ""){
            document.getElementById('shouts').innerHTML = data;
        }
    }
        var shoutAdded = function(data){
    	console.log(data);
    }

    var addNewShout = function(){
        let data = new FormData();
        let shoutText = document.getElementById('input_shout').value;
        alert(shoutText);
        data.append('shout',shoutText);
        //data.append('course_id', JSON.stringify(courseId));
        data.append('course_id',courseId);
        data.append('course_stage',courseProgressEstimated); //Shouts will be assigned to this stage of a course. So that Sprint#1,Sprint#2 can have separate shouts.
        let destAddress = "/course/shout_add/";
        ajaxCall("POST",destAddress, data, getShouts);
    };
document.getElementById('submit_shout').onclick = addNewShout;
getShouts();

}());