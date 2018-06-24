(function () {  
        var counter = 0;
        var SCRUM_MASTER_ROLE = 2;//match it with Django.
        var getProfilesFromServer = function(){
            let tempProfiles = [];
            for (let i = 0; i < team.length; i++){
                let pk = team[i]['pk'];
                let tempObject = {
                    "name":team[i]['fields']['username'],
                    //"role":team[i]['fields']['role'],
                    "img":team[i]['fields']['avatar'],
                    "pk":pk
                }
                /*Now fill role field if item is in a group of users.*/
                if (isNameOnTheList(team[i]['fields']['username'], team_scrum_master) == true){
                    tempObject.role = 2;
                }
                else if (isNameOnTheList(team[i]['fields']['username'], team_developer) == true){
                    tempObject.role = 1;
                }
                else if (isNameOnTheList(team[i]['fields']['username'], team_product_owner) == true){
                    tempObject.role = 3;
                }
                tempProfiles.push(tempObject);
                console.log(tempObject);
            }
            return tempProfiles;
        };

    var displayProfile = function(index){
        let searchedName = profiles[index]['name']
        document.querySelector('#user-name').innerHTML = profiles[index]['name'];
        document.getElementById("img_avatar").src="/media/" + profiles[index]['img'];
/*        if (isNameOnTheList(searchedName, team_scrum_master) == true){
            alert("Ten to scrum master!");
            document.getElementById("cb_scrum_master").checked=true;
        }
        if (isNameOnTheList(searchedName, team_developer) == true){
            alert("Ten to Dev!");
            document.getElementById("cb_developer").checked = true;
        }*/
        let role = profiles[index]['role'];
        console.log(role);
        switch(role) {
            case 1:
                document.getElementById("cb_developer").checked = true;
                break;
            case 2:
                document.getElementById("cb_scrum_master").checked=true;
                break;
            case 3:
                document.getElementById("cb_product_owner").checked=true;
                break;
            default:
                document.getElementById("cb_not_assigned").checked=true;
                break;
        }
        //setting radiobuttons to disabled if doesnt concerns logged used
        let loggedUser = userId;//using global userId variable here.
        //let usrRole  = userRole;
        let usrRole = profiles[userId]['role'];
        for(let i = 0; i < profiles.length; i++){
            if(profiles[i]['pk'] == userId){
                usrRole =  profiles[i]['role'];
            }
        }

        if(loggedUser == profiles[counter]['pk'] || usrRole == SCRUM_MASTER_ROLE){//Logged user or scrum master
            document.querySelector('#cb_product_owner').disabled = false;
            document.querySelector('#cb_scrum_master').disabled = false;
            document.querySelector('#cb_developer').disabled = false;
            document.getElementById("cb_not_assigned").disabled = false;
        }
        else{
            document.querySelector('#cb_product_owner').disabled = true;
            document.querySelector('#cb_scrum_master').disabled = true;
            document.querySelector('#cb_developer').disabled = true;   
            document.getElementById("cb_not_assigned").disabled = true; 
        }
    };

    var isNameOnTheList = function(x, arr){
        /*Returns boolean value if searched x item exists in an array*/
        for(let i =0; i < arr.length; i++){
            if(arr[i]['fields']['username'] == x){
                return true;
            }
        }
        return false;
    }
    var clickArrowLeft = function(){
        if(counter <= 0){
           return;
        }
        counter--;
        displayProfile(counter);
    }
    var clickArrowRight = function(){
        if(counter >= profiles.length-1){
           return;
        }
        counter++;
        displayProfile(counter);
    }

    var updateRole = function(){
        let newRole = 1; 
        if(document.getElementById("cb_developer").checked == true){
            newRole = 1;
        }
        else if(document.getElementById("cb_scrum_master").checked==true){
            newRole = 2;
        }
        else if(document.getElementById("cb_product_owner").checked==true){
            newRole = 3;
        }
        else{
            newRole = undefined;
        }
        profiles[counter]['role'] = newRole;
    }

    var submitNewRoles = function(){
        /*Sends AJlist of profiles with updated roles to the server.*/
            alert("New roles submitted");
            var tempProfileList = [];
            var updatedProfiles = new FormData();
            for(let i = 0; i < profiles.length; i++){
                name = profiles[i]['name'];
                role = profiles[i]['role'];
                let person = {'username':name,'role':role};
                console.log(person);
                tempProfileList.push(person);
            }
            updatedProfiles.append('profiles', JSON.stringify(tempProfileList));
            updatedProfiles.append('course_pk',courseId);
            var request = new XMLHttpRequest();
            var received_message;
            request.open('POST', '/course/set_roles/',true);
            request.setRequestHeader('X-CSRFToken', cookies['csrftoken'],"Content-Type", "application/x-www-form-urlencoded");  
            request.onreadystatechange = function() {
              if (request.status >= 200 && request.status < 400) {
                // Success!
              } else {
                // We reached our target server, but it returned an error
                alert("Couldn't save roless update.")
              }
            };
            request.onload = function () {
                result = request.responseText;
            };
            request.send(updatedProfiles);
    };
    
    /*      MAIN        */
    var profiles = getProfilesFromServer();
    document.querySelector('#arrow-left').onclick = clickArrowLeft;
    document.querySelector('#arrow-right').onclick = clickArrowRight;
    document.querySelector('#cb_product_owner').onclick = updateRole;
    document.querySelector('#cb_scrum_master').onclick = updateRole;
    document.querySelector('#cb_developer').onclick = updateRole;
        document.querySelector('#cb_not_assigned').onclick = updateRole;
    displayProfile(0);
    //Assingn events
     document.getElementById("command_submit").onclick = submitNewRoles;
}());