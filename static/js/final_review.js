//Using IIFE construct.
(function () {
    'use strict';

    var counter = 0;
    function showReview(){
        /*Populates html review section based on global counter variable.*/
        console.log(reviews[counter].author.username + " rated you on: " + reviews[counter].mark + " his opinion: " + reviews[counter].review);
        document.getElementById("review-content").value = reviews[counter].review; 
        //document.getElementById("review-author").innerHTML = "Annonymous user #" + (counter+1); 
        document.getElementById("review-author").innerHTML = reviews[counter].target.username 
        document.getElementById("review-content").readOnly = false;
        document.getElementById("review-mark").value = reviews[counter].mark;

    }

    var sendReview = function(){
        /*Sends AJlist of profiles with updated roles to the server.*/
            alert("New reviews submitted");
            let r = [];
            r = {"author":reviews[counter].author.username, 
                "target":reviews[counter].target.username,
                "review":document.getElementById("review-content").value,
                "course":courseId,"mark":document.getElementById("review-mark").value};
            var dataToSend = new FormData();
            console.log(r);
            dataToSend.append('new_review', JSON.stringify(r));
            dataToSend.append('course_pk',courseId);
            var request = new XMLHttpRequest();
            var received_message;
            request.open('POST', '/course/final_review/1/write/',true);
            request.setRequestHeader('X-CSRFToken', cookies['csrftoken'],"Content-Type", "application/x-www-form-urlencoded");  
            request.onreadystatechange = function() {
              if (request.status >= 200 && request.status < 400) {
                // Success!
              } else {
                // We reached our target server, but it returned an error
                alert("Couldn't save review.")
              }
            };
            request.onload = function () {
                result = request.responseText;
            };
            request.send(dataToSend);
    };



    var clickArrowLeft = function(){
        if(counter <= 0){
           return;
        }
        counter--;
        showReview()
    }
    var clickArrowRight = function(){
        if(counter >= reviews.length-1){
           return;
        }
        counter++;
        showReview();
    }

    function printReviews(){
        for(let i = 0; i < reviews.length; i++){
            console.log(reviews[i].author.username + " rated you on: " + reviews[i].mark + " his opinion: " + reviews[i].review);
        }
    }

    function sendReview(){
        alert("Review sent!");
    }

    /*      MAIN        */
    document.querySelector('#arrow-left').onclick = clickArrowLeft;
    document.querySelector('#arrow-right').onclick = clickArrowRight;
    showReview();
    try {
        document.getElementById('btn_write').onclick = sendReview;
    }
    catch(err) {
        console.log("Btn not found. Running in 'Read mode'.")
    }
})();