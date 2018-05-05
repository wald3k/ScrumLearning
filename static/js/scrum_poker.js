(function () {  
    //var stories;
    var counter = 0;
    var users = new Array();
    var stories = new Array();
    var jsonStories;

    class Story {
        constructor(id,name,content,time) { 
            this.id = id;
            this.name = name;
            this.content = content;
            this.time = time;
        }
    }

    class Estimation {
        constructor(id,author,time) { 
            this.id = id;
            this.author = name;
            this.time = time;
        }
    }

    class User {
        constructor(id,username,avatar,estimated=0) { 
            this.avatar = avatar;
            this.id = id;
            this.username = username;
            this.estimated = estimated;
        }

        makeEstimation(newEstimation){
            var self = this;
               if(parseFloat(newEstimation) === parseInt(newEstimation)){//is numeric
                    alert('Sending new estiamtion to server: ' + newEstimation);
               }
               else{
                    alert("Not a number or not an integer!");
                    return;
               }
            console.log('creating an estimation');
            let story_id = stories[counter]['id'];
            var request = new XMLHttpRequest(); 
            var received_message;
            var parameters=new FormData();
            request.open('POST', '/course/scrum_poker_estimate/' + story_id + "/",true);
            request.setRequestHeader('X-CSRFToken', cookies['csrftoken'],"Content-Type", "application/x-www-form-urlencoded");  
            request.onreadystatechange = function() {
              if (request.status >= 200 && request.status < 400) {
                // Success!
              } else {
                // We reached our target server, but it returned an error
                alert('Error during estimation.');
              }
            };
            request.onload = function () {
                result = request.responseText;
                console.log(result);
            };
            parameters.append("userID",self.id);
            parameters.append("newEstimation",newEstimation);
            request.send(parameters);
        }
    }

    var initialize_poker_stories = function(){
        /*Retrieves a list of profiles with updated roles from the server.
        And passes them to a populate function*/
            var request = new XMLHttpRequest(); 
            var received_message;
            var parameters = new FormData();
            request.open('POST', '/course/scrum_poker_get_stories/' + courseId + "/",true);
            request.setRequestHeader('X-CSRFToken', cookies['csrftoken'],"Content-Type", "application/x-www-form-urlencoded");  
            request.onreadystatechange = function() {
              if (request.status >= 200 && request.status < 400) {
                // Success!
              } else {
                // We reached our target server, but it returned an error
                alert("Error");
              }
            };
            request.onload = function () {
                result = request.responseText;
                jsonStories = JSON.parse(result)['stories'];
                populateScrumPoker(jsonStories);
            };
            parameters.append("test","tescik");
            request.send(parameters);
    };

    var populateScrumPoker = function(jsonStories){
        /*Processes a list of stories that were received from server.*/
                console.log(jsonStories);
                let tempStory;
                for (let i = 0; i < jsonStories.length;i++){
                    tempStory = new Story(jsonStories[i]['id'],jsonStories[i]['name'],
                        jsonStories[i]['content'],
                        jsonStories[i]['time']);
                    //For users
                    let obliged_voters = new Array();
                    for (j = 0; j < jsonStories[i]['poker_game']['get_obligated_users_qs'].length; j++){
                        tempUser = new User(jsonStories[i]['poker_game']['get_obligated_users_qs'][j]['id'],
                        jsonStories[i]['poker_game']['get_obligated_users_qs'][j]['username'],
                        jsonStories[i]['poker_game']['get_obligated_users_qs'][j]['avatar']);
                        for (let k =0; k < jsonStories[i]['poker_game']['estimations'].length;k++){
                            if(tempUser.id == jsonStories[i]['poker_game']['estimations'][k]['author']['id']){
                                tempUser.estimated = jsonStories[i]['poker_game']['estimations'][k]['time']
                            }
                        }
                        obliged_voters.push(tempUser);
                        //console.log(stories[i]['name'] + ' ' + stories[i]['author']['username'] + ' '+ stories[i]['author']['avatar'] +' '+ ' '+ ' '+ ' '+ ' ');
                    }
                    tempStory.obliged_voters = obliged_voters;
                    stories.push(tempStory);
                }
                initializeCards();
                updatePage();
    }

    var initializeCards = function(){
        /*Make scrum poker card for each user that is obligated to vote*/
        for (let i = 0; i < stories[counter].obliged_voters.length;i++){
            let tempUser = stories[counter].obliged_voters[i];
            dynamicDiv(tempUser);
        }
    }
    var updatePage = function(){
        fillStory();
        fillCards()
;    }
    var fillStory = function(){
        /*Sets Story namme and content. Usually needs to be run only when user clicks arrows to change
        story.*/
        document.querySelector('#sticker-title').innerHTML = stories[counter].name;
        document.querySelector('#sticker-body').innerHTML = stories[counter].content;
        document.querySelector('#scrum-poker-status').innerHTML = 'In progress';
        document.querySelector('#scrum-poker-voters').innerHTML = jsonStories[counter]['poker_game']['estimations'].length;
        document.querySelector('#scrum-poker-avg').innerHTML = jsonStories[counter]['time'];
    }

    var fillCards = function(){
        /*Fills HTML element structure with a proper User data.*/
        for (let i = 0; i < stories[counter].obliged_voters.length; i++){
            let voter = stories[counter].obliged_voters[i];
            cardDivID = '#card' + stories[counter].obliged_voters[i].id;
            pokerCardDiv =  document.querySelector(cardDivID) 
            pokerCardDiv.childNodes[0].innerHTML = voter.username; //Avatar
            pokerCardDiv.childNodes[1].childNodes[0].src = '/' + voter.avatar;
            pokerCardDiv.childNodes[1].childNodes[0].title = voter.username;

            if(userId == voter.id){
                pokerCardDiv.childNodes[2].value = voter.estimated;//estimation
            }
        }
    }
    var dynamicDiv = function(userObject){
        /*Creates a div element structure for a poker card.*/
        var iDiv = document.createElement('div');
        iDiv.id = 'card' + userObject.id;
        iDiv.className = 'poker-card';

        // Create the inner div before appending to the body
        var innerDiv1 = document.createElement('div');
        var innerDiv2 = document.createElement('div');
        var avatarImg = document.createElement('img');
        avatarImg.className = 'avatar';
        innerDiv1.className = iDiv.className + '-author';
        innerDiv2.className = iDiv.className + '-avatar';
        innerDiv2.appendChild(avatarImg);
        // The variable iDiv is still good... Just append to it.
        iDiv.appendChild(innerDiv1);
        iDiv.appendChild(innerDiv2);

        if(userId == userObject.id ){
            var input_estimation = document.createElement("input");
            var btn_send_estimation = document.createElement("button");
            btn_send_estimation.onclick = function(){userObject.makeEstimation(input_estimation.value)};
            btn_send_estimation.innerText  = "Make estimation"
            input_estimation.className = iDiv.className + '-estimation';
            iDiv.appendChild(input_estimation);
            iDiv.appendChild(btn_send_estimation);
            if(userId != userObject.id ){
                input_estimation.className = input_estimation.className + '-invisible';
            }
        }

        else{
            var input_estimation = document.createElement("input");
            var btn_send_estimation = document.createElement("button");
            input_estimation.className = iDiv.className + '-estimation-invisible';
            input_estimation.value = "?";
            input_estimation.readOnly = true;
            iDiv.appendChild(input_estimation);
        }
        // Then append the whole thing onto the body
        document.querySelector('#cards-container').appendChild(iDiv);
    }

    /*Controls for selecting which Story is displayed for a Scrum Poker Game.*/
    var nextStory = function(){
        if(counter < stories.length - 1){
            counter = counter + 1;
            updatePage();
        }
    }

    var prevStory = function(){
        if(counter > 0){
            counter = counter - 1;
            updatePage();
        }
    }

    /*      MAIN        */
    //var profiles = getProfilesFromServer();
    initialize_poker_stories();
    document.querySelector('#arrow-left').onclick = prevStory;
    document.querySelector('#arrow-right').onclick = nextStory;
    //document.querySelector('#card1-estimation-btn').onclick = makeEstimation;

    let course = courseId;//using global variable friom generics/course_generic.html
}());