//Using IIFE construct.
(function () {
    'use strict';
    var storyCounter = 0;
    var stories;
    var ptsMin = 999;
    var ptsMax = -999;
var getStoriesFromServer = function(){
    //Function makes an AJAX call and gets list of Dictinaries with Stories
    //that were chosen to the release backlog.
    let stories = [
        {
            'storyHeader':'Story #1',
            'storyBody':'Story #1 body content',
            'estimations':{
                'user1':4,
                'user2':2,
                'user3':3,
                'user4':2,
                'user5':5
            }
        },
        {
            'storyHeader':'Story #2',
            'storyBody':'Story #2 Some other content here...',               'estimations':{
                'user1':1,
                'user2':2,
                'user3':5,
                'user4':3,
                'user5':4
            }
        },
        {
            'storyHeader':'Story #3',
            'storyBody':'Story #3 yet another story.',
            'estimations':{
                'user1':2,
                'user2':2,
                'user3':3,
                'user4':1,
                'user5':5
            }
        },
        {
            'storyHeader':'Story #4',
            'storyBody':'Story #4 yet another story.',
            'estimations':{
                'user1':2,
                'user2':2,
                'user3':2,
                'user4':5,
                'user5':4
            }
        },
        {
            'storyHeader':'Story #5',
            'storyBody':'Wypełniacz w przemyśle poligraficznym. Został po raz pierwszy użyty w XV w. przez nieznanego drukarza do wypełnienia tekstem próbnej książki. Pięć wieków później zaczął być używany przemyśle elektronicznym, pozostają',
            'estimations':{
                'user1':4,
                'user2':2,
                'user3':5,
                'user4':5,
                'user5':5
            }
        }
    ]
    return stories;
}
    
    
var incrementCounter = function(){
    //Increments counter and displays it onto webpage.
    let limit = document.getElementById("story-total").innerHTML
    if(storyCounter<limit-1){
        storyCounter++;
        updateHtml();
    }
    
};
var decrementCounter = function(){
    if(storyCounter > 0){
        storyCounter--;   
        updateHtml();
    }
};
var displayNewCounter = function(newValue){
    //Display storyCounter + 1, because it starts from 0.
    document.getElementById("story-curr").innerHTML = storyCounter+1;
}
var displayStory = function(){
    //Gets story based of storyCounter and modifies web HTML content.
     document.getElementById("story-header").innerHTML = stories[storyCounter]['storyHeader'];
     document.getElementById("story-body").innerHTML = stories[storyCounter]['storyBody'];
}
var displayEstimations = function(){
    let userId;
    for(let i = 0; i < 5; i++){
        userId=i+1;
        document.querySelector("#user"+ userId + " .pp-user-card-points").innerHTML="Points: " + stories[storyCounter]['estimations']['user'+userId];
    }
}
var calculateDiscrapency = function(){
    let pts;
    let userId;
    let discrapency = 0;
    //reset min & max values
    ptsMin = 999;
    ptsMax = -999;
    for(let i = 0; i < 5; i++){
        userId=i+1;
        pts = stories[storyCounter]['estimations']['user'+userId];
        if(pts < ptsMin){ptsMin = pts};
        if(pts > ptsMax){ptsMax = pts};

    }
    discrapency = ptsMax-ptsMin;
    document.getElementById("discrapency").innerHTML = "Discrapency = " + discrapency;
    if(discrapency > 3){
       document.getElementById("discrapency").style.color="red";
    }
    else{
        document.getElementById("discrapency").style.color="#555";
    }
    return {'min':ptsMin,'max':ptsMax};
}

var lockTypicalUsers = function(){
    //Lock users apart from min & max users so that they can replay.
    let userId;
    for(let i = 0; i < 5; i++){
        userId=i+1;
        if(stories[storyCounter]['estimations']['user'+userId] != ptsMin && stories[storyCounter]['estimations']['user'+userId] != ptsMax){
             document.querySelector("#user"+ userId).classList.add("inactive");
        }else{
            document.querySelector("#user"+ userId).classList.remove("inactive");
            //creating new textarea div
            var explainForm = document.createElement("div");
            var input = document.createElement("textarea");
            var button = document.createElement("button");
            button.id="btn-user-" + userId;
            button.type='submit';
            button.innerHTML = "Explain";
            button.classList.add("btn-explain");
            button.onclick = function(){alert("blabla")};
            input.name = "comment-user-"+userId;
            input.maxLength = "500";
            input.cols = "10";
            input.rows = "10";
            explainForm.appendChild(input); //appendChild
            explainForm.appendChild(button);
            document.querySelector("#user"+ userId).appendChild(explainForm);
        }
    }
}

var addSelectOptions = function(){
     let userId;
    for(let i = 0; i < 5; i++){
        userId=i+1;
        var ratingSelector = document.createElement("div");
        var sel =document.createElement("select");
        sel.id = "select-user-" + userId;
        var options = document.createElement("optgroup");
        var choices = ["",1,3,5,8,13];
        var button = document.createElement("button");
        button.id="btn-rate-" + userId;
        button.type='submit';
        button.innerHTML = "Make estimation";
        button.classList.add("btn-rate");
        for(let j = 0; j < choices.length; j++){
            var choice = document.createElement("option");
            if(j==0){
                choice.optSelected=choices[j];
            }
            choice.innerHTML = choices[j];
            options.appendChild(choice);
        }
        
        options.label = "Choose duration";
        ratingSelector.appendChild(sel);
        sel.appendChild(options);
        ratingSelector.appendChild(button);
        document.querySelector("#user"+ userId).appendChild(ratingSelector);
    }
}

var updateHtml = function(){
    displayNewCounter();
    displayStory();
    displayEstimations();
    calculateDiscrapency()
    lockTypicalUsers();
    addSelectOptions();
}
/*MAIN PROCEDURE/*/
//Assigning onclick events to the page components
document.getElementById("arrow-left").onclick = decrementCounter;
document.getElementById("arrow-right").onclick = incrementCounter;
//Initialization
stories = getStoriesFromServer();
//Preparing initial webpage.
updateHtml();
})();