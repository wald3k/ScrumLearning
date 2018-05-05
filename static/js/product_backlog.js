//Using IIFE construct.
(function () {
    'use strict';
    //Declaring global variables
    var dragged_element,
        on_drag_start,
        on_drag,
        on_drag_end,
        on_mouse_over,
        grabPointX,
        grabPointY,
        createSticker,
        zIndexCounter = 1;//for holding zIndex of sticker elements.
    function MyPoint(x,y){
        //Simple point object used when comparing if rectangle contains another rectangle.
        this.x = x;
        this.y = y;
    }
    
    on_drag_start = function (ev) {
        /*
            Takes coordinates in which spot user clicked Sticker Header.
            This will be handy to maintain this ratio during drag.
        */
        var boundingClientRect;
        if (ev.target.className.indexOf('sticker-header') === -1) {
            //if sticker header was not dragged then return.
            return;
        }
        //this will reference sticker element.
        dragged_element = this;
        dragged_element.style.zIndex = zIndexCounter++; //before releasing,update zIndex of a Sticker element.
        boundingClientRect = dragged_element.getBoundingClientRect();//Checking position of mouse
        //Takes coordinates of where mouse click occured
        grabPointX = boundingClientRect.left - ev.clientX;
        grabPointY = boundingClientRect.top - ev.clientY;
    };
    
    on_drag = function (ev) {
        /*
            Updates coordinates of a drag element according to mouse position.
        */
        if (!dragged_element) {
            //Return if no longer dragging anything.
            return;
        }
        //Local variable declaration
        var posX = ev.clientX + grabPointX;
        var posY = ev.clientY  + grabPointY;
        //Dimension/Position restrictions check
        if(posX < 0) {
            posX = 0;
        }
        if(posY < 0){
            posY = 0;
        }
        dragged_element.style.transform = "translateX(" + posX + "px) translateY(" + posY + "px)";
        //Updating position of a sticker object in a list with given id.
        var elInArray = dragged_element.id;
        stickers[elInArray].posX = posX;
        stickers[elInArray].posY = posY;
    };
    
    on_drag_end = function(ev){
        /*
            When mouse button is released variables are unassigned.
            Also checks if dragged element fits inside backlog boxes.
        */
        dragged_element = null;
        grabPointX = null;
        grabPointY = null;
        if (ev.target.className.indexOf('sticker-header') === -1) {
            //if sticker header was not dragged then return.
            //This helps to avoid issues with screen resize. Otehrwise all stickers wold be treated
            //in the else part.
            return;
        }

        /*
            On drag end specify to which area sticker should be assigned.
            using updateBacklog function with integer parameters.
        */
        for (var i = 0; i < stickers.length; i++){
            //Sticker Header bouding box
            var bb = stickers[i].barEl.getBoundingClientRect();
           if(checkBoundingBoxes(bb,productBacklogRect) == true){
               stickers[i].updateBacklog(0);
              }
           else if (checkBoundingBoxes(bb,otherBacklogRect) == true){
              stickers[i].updateBacklog(1);
           }
           else{
               stickers[i].updateBacklog(-1);
           }
           stickers[i].drawSticker();
        }
    }
    
    on_mouse_over = function(ev){
        /*
          Checks if mouse is at .sticker element and returns boolean value.
          This can be used i.e. to set z-index and move some elements forward.
        */
        if(!ev.target.classList.contains('.sticker')){
            return;
        }
    }
        
    function Sticker(id=0,backlog=0,sprint=0,state=0, posX=0, posY=0,title = "Header",text = "Body") {
        /*
            Defining class representing a Sticker Object
        */
        this.id = id;
        this.posX = posX;
        this.posY = posY;
        this.title = title;
        this.text=text;
        this.stickerEl = document.createElement('div');
        this.barEl = document.createElement('div');
        this.textareaEl = document.createElement('textarea');
        this.stickerClassName;
        this.backlog=backlog;
        this.backlogPrev = null;
        this.sprint=sprint;
        this.sprintState = state;
        this.sprintStatePrev = null;
        this.backlogPrev = null;
        this.severId;
        this.time = null;
        //Declaring functions
        this.updateBacklog = function(newBacklog){
            /*
                Sets sprintState of a Story and adjusts HTML code,
                removes unnecessary classes and adds new ones.
                This function should be called when moving stories over a screen.
            */
            ////////////////////////
            this.backlogPrev = this.backlog;
            this.backlog = newBacklog;
                switch(this.backlogPrev){
                case 0:
                    this.stickerClassName = "sticker-header-blue";
                    break;
                case 1:
                    this.stickerClassName = "sticker-header-green";
                    break;
                default:
                    this.stickerClassName = "sticker-header-orange"
                    break;
            }
            this.barEl.classList.remove(this.stickerClassName);
            switch(this.backlog){
                case 0:
                    this.stickerClassName = "sticker-header-blue";
                    break;
                case 1:
                    this.stickerClassName = "sticker-header-green";
                    break;
                default:
                    this.stickerClassName = "sticker-header-orange"
                    break;
            }            
            this.barEl.classList.add(this.stickerClassName);
            //If story is unassigned then switch it to default 0 value. Don't want to send invalid data to server.
        }
        this.drawSticker = function(){
            /*
                Checks sprintState and sets proper class names in HTML code
                    i.e. color, mouse events, title, content etc.
            */
            console.log("Drawing " + this.backlog);
            this.textareaEl.setAttribute('readonly', 'readonly');
            switch(this.backlog){
                case 0:
                    this.stickerClassName = "sticker-header-blue";
                    break;
                case 1:
                    this.stickerClassName = "sticker-header-green";                    
                    break;
                default:
                    this.stickerClassName = "sticker-header-orange"
                    break;
            }
            this.barEl.classList.add(this.stickerClassName);  
            this.stickerEl.classList.add('sticker');
            this.stickerEl.appendChild(this.barEl);
            this.stickerEl.appendChild(this.textareaEl);
            this.stickerEl.addEventListener('mouseover', on_mouse_over, false);
            this.stickerEl.addEventListener('mousedown', on_drag_start, false);
            this.barEl.oncontextmenu = rightClickContext;//For right click options.
            this.stickerEl.style.transform = "translateX(" + this.posX + "px) translateY(" + this.posY + "px)";
            this.barEl.innerHTML= this.title + '<span style="float: right;padding-right:0px;"> (' +this.time + ")</span>";
            this.textareaEl.innerHTML = this.text;
            this.stickerEl.setAttribute("id", this.id); //setting unique id
            document.body.appendChild(this.stickerEl);
        }
    };
        var rightClickContext = function(ev){
            /*
                Allows user to right-click on sticker element and remove it.
                Then it sends an information to the server.
            */
            let id = ev.target.parentNode.id;
            let serverId = 0;
            if (confirm('Are you sure you want to delete this story (' + id + ') from this course?')) {
                for(let i = 0; i < stickers.length; i++){//Looking for a server id of the story.
                    if(i == id){
                        serverId = stickers[i].serverId;
                        break;
                    }
                }
                deleteSelectedSticker(id);
                //Preparing POST query to the server to delete Story from the database with a given
                //serverId number.
                let destAddress= "/course/delete_story/" + courseId + "/";
                let data = new FormData();
                data.append("story_id", serverId);
                ajaxCall("POST",destAddress, data, function(){return false;});
            }
            return false;
        }
    
    var checkBoundingBoxes = function(innerBox, outerBox){
        /*
            Checks if two diagonal points of one rectangle fit inside some other rectangle.
            Can be used to check to which backlog story should be linked.
        */
        var p1 = new MyPoint(innerBox.left, innerBox.top);
        var p2 = new MyPoint(innerBox.left + innerBox.width, innerBox.top + innerBox.height);

        if(p1.x >= outerBox.left && p1.x <= outerBox.left + outerBox.width &&
            p1.y >= outerBox.top && p1.y <= outerBox.top + outerBox.height &&
            p2.x >= outerBox.left && p2.x <= outerBox.left + outerBox.width &&
            p2.y >= outerBox.top && p2.y <= outerBox.top + outerBox.height
          ){
            return true;
           }
        else{
            return false;
        }
    };
    /*Functions for Command buttons START*/
    var c_see_details = function(){
        alert("Position stickers to apprioprate backlog sections. When ready send changes to the server and preceed with your project.");
    };
    
    var c_save_progress = function(){
        console.log (stickers);
        alert("Product backlog will be send to server! So that you don't loose your progress.");
        let data = new FormData();
        let StickerList = [];
        for (var i = 0; i < stickers.length; i++){
            //draw Stickers according to data from Server

            /*
            //Commented. Let server decide what to do.
            if(stickers[i].backlog == -1){
               stickers[i].backlog = stickers[i].backlogPrev;
            }
            */
            console.log("Sprawdzam: " + stickers[i].serverId + " "+stickers[i].title+ " "+stickers[i].text+ " "+ stickers[i].backlog+ " "+ stickers[i].sprint ,+ " "+ stickers[i].sprintState);
            StickerList.push({id: stickers[i].serverId,name:stickers[i].title, content:stickers[i].text, backlog: stickers[i].backlog, sprint:stickers[i].sprint ,sprint_state: parseInt(stickers[i].sprintState)}); 
        }
            //Preparing to call an Ajax Call
            console.log(StickerList);
            data.append('stickerList', JSON.stringify(StickerList));
            let destAddress = "/course/2_product_backlog/" + courseId + "/";
            ajaxCall("POST",destAddress, data, function(){return false;});
    };

    
    /*Functions for Command buttons END*/
    window.onresize = function(event) {
        /*
            On resize Event
            alert("Someone resized window. Stickers might not be in place!!")
        */
        productBacklogRect = document.querySelector('#product_backlog').getBoundingClientRect();
        otherBacklogRect = document.querySelector('#other_backlog').getBoundingClientRect();
        let margin = 5;//in pixels
        for (var i = 0; i < stickers.length; i++){
            //draw Stickers according to data from Server
            switch(stickers[i].backlog){
                case 0:
                    stickers[i].posX = productBacklogRect.left + margin;
                    break;
                case 1:
                    stickers[i].posX = otherBacklogRect.left + margin;
                    break;
                default:
                    stickers[i].posX = otherBacklogRect.left + otherBacklogRect.width + margin;
                    this.stickerClassName = "sticker-header-orange"
                    break;
            }
            stickers[i].drawSticker();
        }  
    };

//    var send_new_story = function(){
//       /*
//            Directie for the server to create a new story.
///          Server should respond with an updated list of stories. 
///         Currently unsed. After 'Add new sticker' button displayNewSticker should be invoked.
///         And new sticker should be passed within a list when save_changes is clicked and then saved on server.
///     */
///     let name =     document.querySelector('#new_story_name').value;
//     let content  =     document.querySelector('#new_story_content').innerHTML;
//      let data = new FormData();
//      data.append("name", name);
//      data.append("content",content);
//      data.append("backlog",0);//Default backlog set to 0.
//      data.append("sprint",0);//Default sprint set to 0.
//      data.append("sprint_state",0);//Default sprint_state set to 0.
//      let destAddress= "/course/create_new_story/" + courseId + "/";
//        ajaxCall("POST",destAddress, data,displayNewSticker); //Don't send it right now. It will only be saved after save_progress button.
//    }

    var deleteStickers = function(){
        /*
            Removes all stickes from the webpage.
            Doesn't send any information from the server.
        */
        for(let i = 0; i < stickers.length; i++){
            stickers[i].stickerEl.remove();
            stickers[i].barEl.remove();
            stickers[i].textareaEl.remove();
        }
        stickers = [];
    }

    var deleteSelectedSticker = function(stickerId){
        /*
            Deletes sticer with id = stickerId and re-creates stickers array.
        */
        let tempStickers = [];
        if(stickers.length == 0){
            return;
        }
        for(let i = 0; i < stickers.length; i++){
            if(stickers[i].id != stickerId){
                tempStickers.push(stickers[i]);
            }
            stickers[stickerId].stickerEl.remove();
            stickers[stickerId].barEl.remove();
            stickers[stickerId].textareaEl.remove();
        }
        //Recreating stickers.
        stickers = tempStickers;
        for(let i = 0; i < stickers.length; i++){
            stickers[i].drawSticker();
        }
        //console.log("Sticker: " + stickerId + " deleted.");
        return;
    }

    var displayNewSticker = function(data){
            /*Displays new sticker on the screen*/
            let area = document.querySelector('#new_story_content').getBoundingClientRect();
            let title = document.querySelector('#new_story_name').value;
            let text = document.querySelector('#new_story_content').value;
            // Sticker(id=0,backlog=0,sprint=0,state=0, posX=0, posY=0,title = "Header",text = "Body") 
            let s = new Sticker(stickers.length,-1,0,-1,area.left + area.width,area.top + scrollPos,title,text);
            stickers.push(s);
            s.drawSticker();
    }

    var populateStickers = function(data){
        /*
        Recives a JSON list of Stickers(Stories) from server.
        */
        data = JSON.parse(data);
        let id=0;
        let name = "";
        let content = "";
        data=JSON.parse(data['stickers']);
        //For printing stickers one by one
        let productBacklogTempHeight = productBacklogRect.top + scrollPos;
        let otherBacklogTempHeight = otherBacklogRect.top + scrollPos;
        let unassignedBacklogTempHeight = otherBacklogRect.top + scrollPos;
        let step = 80; //Distance between next stickers.
        deleteStickers();//reset array with stickers.
        for (var i = 0; i < data.length; i++){
            //Populating Stickers
            //Creating sticker object and giving him starting position.
            let temp_sticker = new Sticker(i);//giving only id, rest is filled by default constructor.
            let backlog = data[i]['fields']['backlog'];
            if(backlog == 0){
                temp_sticker.posX = productBacklogRect.left;
                temp_sticker.posY = productBacklogTempHeight;
                if(productBacklogTempHeight+step < productBacklogRect.top+productBacklogRect.height){
                    productBacklogTempHeight += step;
                }
            }
            else if(backlog == 1){
                temp_sticker.posX = otherBacklogRect.left;
                temp_sticker.posY = otherBacklogTempHeight;
                if(otherBacklogTempHeight+step < otherBacklogRect.top + otherBacklogRect.height){
                    otherBacklogTempHeight += step;
                }
            }
            else if(backlog == -1){
                temp_sticker.posX = otherBacklogRect.left +  otherBacklogRect.width + step;
                temp_sticker.posY = unassignedBacklogTempHeight;
                if(unassignedBacklogTempHeight+step < otherBacklogRect.top + otherBacklogRect.height){
                    unassignedBacklogTempHeight += step;
                }
            }
            temp_sticker.title = data[i]['fields']['name'];   
            temp_sticker.text = data[i]['fields']['content'];
            temp_sticker.serverId = data[i]['pk'];
            temp_sticker.backlog = data[i]['fields']['backlog'];
            temp_sticker.sprint =  data[i]['fields']['sprint'];
            temp_sticker.sprint_state = data[i]['fields']['sprint_state'];  
            temp_sticker.time =  data[i]['fields']['time'];
            stickers.push(temp_sticker);
            console.log("Creating sticker: " +"id= " + temp_sticker.id + " name = " + temp_sticker.name + " text = " + temp_sticker.content + " backlog: "+ temp_sticker.backlog + " sprint_state: " + temp_sticker.sprint_state);
        }
        for (let i = 0; i < stickers.length; i++){
            //draw Stickers according to data from Server
            stickers[i].drawSticker();
        }
    }

    var clear_field_value = function(ev){
        ev.target.value = "";
    }

    var myOnScroll = function(ev){
        console.log("Updated scroll");
        scrollPos = window.scrollY || window.scollTop || document.getElementsByTagName("html")[0].scrollTop;
    }

    /*******************    MAIN START  *******************/
    window.onscroll = myOnScroll;
    document.addEventListener('mousemove', on_drag, false);
    document.addEventListener('mouseup', on_drag_end, false);
    //Asume I get all Stickers from server i.e. as an array.
    //Getting coordinates of boundingClientRects displayed in browswer.
    var scrollPos = 0;
    var productBacklogRect = document.querySelector('#product_backlog').getBoundingClientRect();
    var otherBacklogRect = document.querySelector('#other_backlog').getBoundingClientRect();
    //Assign behaviour to the command buttons.
    document.querySelector('#command_see_details').onclick = c_see_details;
    document.querySelector('#command_save_progress').onclick = c_save_progress;
    document.querySelector('#new_story_submit').onclick  = displayNewSticker;// 'send_new_story' wa used previously;
    document.querySelector('#new_story_name').onclick  = clear_field_value;
    document.querySelector('#new_story_content').onclick  = clear_field_value;
    //Populating stickers array with stickers from server.
    var stickers = []
    ajaxCall("GET", "/course/get_course_stickers/" + courseId + "/", {}, populateStickers);//First need to download stickers from server
    //ajaxCall("GET", window.location.href + courseId + "/", {}, populateStickers);//First need to download stickers from server
     
    /*******************    MAIN END  *******************/
    
})();