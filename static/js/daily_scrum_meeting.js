(function () {  

        var counter = 0;
        var loggedUser = "User2";
        var getProfilesFromServer = function(){
        //Mockup function pretending to get list of users from server query.
        var profiles =[
            {
                "name":"User1",   
                "img":"/static/img/jeff_sutherland.gif",
                "scrumMaster":true,
                "productOwner":true,
                "developer":false,
                "yesterday":"I've done that..",
                "tomorrow":"Tomorrow I will do..",
                "obstacles":"I've encountered obstacles such as..",
                "date":"2017-10-11"
            },
            {
                "name":"User2",   
                "img":"/static/img/user.png",
                "scrumMaster":false,
                "productOwner":true,
                "developer":false,
                "yesterday":"I've done that..",
                "tomorrow":"Tomorrow I will do..",
                "obstacles":"I've encountered obstacles such as..",
                "date":"2017-10-11"
            },
            {
                "name":"User3",   
                "img":"/static/img/img_avatar_login.png",
                "scrumMaster":false,
                "productOwner":false,
                "developer":true,
                "yesterday":"I've done that..",
                "tomorrow":"Tomorrow I will do..",
                "obstacles":"I've encountered obstacles such as..",
                "date":"2017-10-11"
            },
                        {
                "name":"User1",   
                "img":"/static/img/jeff_sutherland.gif",
                "scrumMaster":true,
                "productOwner":true,
                "developer":false,
                "yesterday":"I've done that..",
                "tomorrow":"Tomorrow I will do..",
                "obstacles":"I've encountered obstacles such as..",
                "date":"2017-10-12"
            },
            {
                "name":"User2",   
                "img":"/static/img/user.png",
                "scrumMaster":false,
                "productOwner":true,
                "developer":false,
                "yesterday":"I've done that..",
                "tomorrow":"Tomorrow I will do..",
                "obstacles":"I've encountered obstacles such as..",
                "date":"2017-10-12"
            },
            {
                "name":"User3",   
                "img":"/static/img/img_avatar_login.png",
                "scrumMaster":false,
                "productOwner":false,
                "developer":true,
                "yesterday":"I've done that..",
                "tomorrow":"Tomorrow I will do..",
                "obstacles":"I've encountered obstacles such as..",
                "date":"2017-10-12"
            }   
        ]
        return profiles;
    };
    var profiles = getProfilesFromServer();
    var getNextDate = function(){
        for (let i = counter; i<profiles.length;i++){
            if(profiles[i]['date'] != profiles[counter]['date']){//found next date
                counter = i;
                displayProfile(i);
                return;
            }
        }
    };
    var getPreviousDate = function(){
        for (let i = counter; i>=0;i--){
            if(profiles[i]['date'] != profiles[counter]['date']){//found next date
                counter = i;
                displayProfile(i);
                return;
            }
        }
    };

    var displayProfile = function(index){
        document.querySelector('#user-name').innerHTML = profiles[index]['name'];
        document.getElementById("img_avatar").src=profiles[index]['img'];
         document.getElementById("cb_product_owner").checked=profiles[index]['productOwner'];
        document.getElementById("cb_scrum_master").checked=profiles[index]['scrumMaster'];
        document.getElementById("cb_developer").checked =profiles[index]['developer'];
        
        //Locking user roles
        document.getElementById("cb_product_owner").disabled=true;
        document.getElementById("cb_scrum_master").disabled=true;
        document.getElementById("cb_developer").disabled=true;
        //Settings specific to Scrum meeting
        document.getElementById("scrum-date-selector").innerHTML = profiles[index]['date'];
        document.getElementById("content-yesterday").innerHTML = profiles[index]['yesterday'];
        document.getElementById("content-tomorrow").innerHTML = profiles[index]['tomorrow'];
        document.getElementById("content-obstacles").innerHTML = profiles[index]['obstacles'];
        checkForm();
              
    };
    var clickArrowLeft = function(){
        if(counter <= 0){
           return;
        }
        if(profiles[counter-1]['date'] != profiles[counter]['date']){//only wabnt to show profiles from this date
           return;
        }
        counter--;
        displayProfile(counter);
    }
    var clickArrowRight = function(){
        if(counter >= profiles.length-1){
           return;
        }
        if(profiles[counter+1]['date'] != profiles[counter]['date']){//only wabnt to show profiles from this date
           return;
        }
        counter++;
        displayProfile(counter);
    }
    
    var stringToDate = function(myDate){
        dateInfo = myDate.replace(/-/g,"/")
        return new Date(dateInfo);
    }
    var checkForm = function(){
        var elementsToBeChanged = ["form-cb-today","form-cb-tomorrow","form-cb-obstacles","form-cb-today","ta-scrum-meeting","btn-sm-submit"]
        if(profiles[counter]['name'] != loggedUser){
            for(let i = 0; i < elementsToBeChanged.length; i++){
                document.getElementById(elementsToBeChanged[i]).disabled = true;
            }
            document.getElementById("ta-scrum-meeting").value = "";  

        }
        else{
            for(let i = 0; i < elementsToBeChanged.length; i++){
                document.getElementById(elementsToBeChanged[i]).disabled = false;
            }
        }
    }
    var submitScrumMeetingForm = function(){
        var msg = document.getElementById("ta-scrum-meeting").value;
        var activity = document.querySelector('input[name=sm-activity]:checked').id;
        alert(msg + ": " + activity);
    }
    /*      MAIN        */
    document.querySelector('#arrow-left').onclick = clickArrowLeft;
    document.querySelector('#arrow-right').onclick = clickArrowRight;
    document.querySelector('#arrow-date-left').onclick = getPreviousDate;
    document.querySelector('#arrow-date-right').onclick = getNextDate;
    document.querySelector('#btn-sm-submit').onclick = submitScrumMeetingForm;
    displayProfile(0);
}());