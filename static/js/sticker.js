/*This file contains stickers/backlog etc. functionality*/
//Using IIFE construct.
(function () {
    'use strict';
    var NEW_STICKER_V_OFFSET = 0; //It is used by newly created Stickers, to shift them below each other.
    /********************************
	*								*
	* Stickers/moving/draging etc.	*	
	*								*
    *********************************/
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
           if(checkBoundingBoxes(bb,log_1) == true){
               stickers[i].updateBacklog(0);
              }
           else if (checkBoundingBoxes(bb,log_2) == true){
              stickers[i].updateBacklog(1);
           }
          else if (checkBoundingBoxes(bb,log_3) == true){
              stickers[i].updateBacklog(2);
           }
          else if (checkBoundingBoxes(bb,log_4) == true){
              stickers[i].updateBacklog(3);
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
        
  	/********************************
	*								*
	* Sticker object & main Logic	*	
	*								*
    *********************************/  
    function Sticker(id=0,backlog=0,sprint=0,state=0, posX=0, posY=0,title = "Header",text = "Body") {
        /*
            Defining class representing a Sticker Object.
            It should roughly reflect Sticker object on a server side.
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
        this.backlog = backlog;
        this.backlogPrev = null;
        this.sprint = sprint;
        this.sprintState = state;
        this.sprintStatePrev = null;
        this.backlogPrev = null;
        this.severId;
        this.time = null;
        this.isPokerFinished = false;
        //Declaring sticker functions
        this.updateBacklog = function(newBacklog){
            /*
                Sets sprintState of a Story and adjusts HTML code,`
                removes unnecessary classes and adds new ones.
                This function should be called when moving stories over a screen.
                It reflects changes of state of a sticker.
                Sticker can be in 1 of 2 Backlog states. (product backlog)
                Sticker can be in 1 of 2 BacklogSprint states.	(sprint backlog)
                Sticker can be in 1 of 2 Sprint states.	(sprint board backlog)
                Arguments:
                whichBacklog = 'backlog','sprintBacklog','sprintBoardBacklog'

            */
            ////////////////////////
            if(WHICH_BACKLOG == 'backlog'){
	            this.backlogPrev = this.backlog;
	            this.backlog = newBacklog;
                switch(this.backlogPrev){
	                case 0:
	                    this.stickerClassName = "sticker-header-blue";
	                    break;
	                case -1:
                        this.stickerClassName = "sticker-header-orange"
	                    break;
	                default:
                        this.stickerClassName = "sticker-header-green";
	                    break;
	            }
	            this.barEl.classList.remove(this.stickerClassName);
	            switch(this.backlog){
	                case 0:
	                    this.stickerClassName = "sticker-header-blue";
	                    break;
	                case -1:
                        this.stickerClassName = "sticker-header-orange"
	                    break;
	                default:
                        this.stickerClassName = "sticker-header-green";
	                    break;
	            }
	            this.barEl.classList.add(this.stickerClassName);
            }
            else if(WHICH_BACKLOG == 'sprintBacklog'){
            	//copied from sprint_backlog.js
	            this.sprintPrev = this.sprint;
	            this.sprint = newBacklog;
                this.sprintState = 0;
                switch(this.sprintPrev){
                    case 0:
                        this.stickerClassName = "sticker-header-blue";
                        break;
                    case -1:
                        this.stickerClassName = "sticker-header-orange"
                        break;
                    default:
                        this.stickerClassName = "sticker-header-green";
                        break;
                }
                this.barEl.classList.remove(this.stickerClassName);
                switch(this.sprint){
                    case 0:
                        this.stickerClassName = "sticker-header-blue";
                        break;
                    case -1:
                        this.stickerClassName = "sticker-header-orange"
                        break;
                    default:
                        this.stickerClassName = "sticker-header-green";
                        this.sprint = SPRINT_NUMBER;
                        break;
                }
                this.barEl.classList.add(this.stickerClassName);
            }

            else if(WHICH_BACKLOG == 'sprintBoardBacklog'){
            	//copied from sprint_board.js
	            this.sprintStatePrev = this.sprintState;
	            this.sprintState = newBacklog;
	            switch(this.sprintStatePrev){
	                case 0:
	                    this.stickerClassName = "sticker-header-blue";
	                    break;
	                case 1:
	                    this.stickerClassName = "sticker-header-green";                    
	                    break;
	                case 2:
	                    this.stickerClassName = "sticker-header-purple";                    
	                    break;
	                case 3:
	                    this.stickerClassName = "sticker-header-cyan";                    
	                    break;
	                default:
	                    this.stickerClassName = "sticker-header-orange"
	                    break;
	            }
	            this.barEl.classList.remove(this.stickerClassName);
	            switch(this.sprintState){
	                case 0:
	                    this.stickerClassName = "sticker-header-blue";
	                    break;
	                case 1:
	                    this.stickerClassName = "sticker-header-green";                    
	                    break;
	                case 2:
	                    this.stickerClassName = "sticker-header-purple";                    
	                    break;
	                case 3:
	                    this.stickerClassName = "sticker-header-cyan";                    
	                    break;
	                default:
	                    this.stickerClassName = "sticker-header-orange"
	                    break;
	            }
	            this.barEl.classList.add(this.stickerClassName);

            }
            console.log("Nowy log: " + this.backlog + " " + this.sprint + " " + this.sprintState);
            //If story is unassigned then switch it to default 0 value. Don't want to send invalid data to server.
        }
        this.drawSticker = function(){
            /*
                Checks sprintState and sets proper class names in HTML code
                    i.e. color, mouse events, title, content etc.
            */
            let which = 0;
            let MAX_STORY_TIME_LIMIT = 50;
           //Using global WHICH_BACKLOG variable to determine type of backlog. 
            this.textareaEl.setAttribute('readonly', 'readonly');

            if(WHICH_BACKLOG == 'backlog'){
            	which = this.backlog;
                switch(which){
                    case 0:
                        this.stickerClassName = "sticker-header-blue";
                        break;
                    case -1:
                        this.stickerClassName = "sticker-header-orange"
                        break;
                    default:
                        this.stickerClassName = "sticker-header-green";                    
                        break;
                }
                 console.log("drawSticker: " + this.backlog);
            }
            else if(WHICH_BACKLOG == 'sprintBacklog'){
            	which = this.sprint;
                switch(which){
                    case 0:
                        this.stickerClassName = "sticker-header-blue";
                        break;
                    case -1:
                        this.stickerClassName = "sticker-header-orange"
                        break;
                    default:
                        this.stickerClassName = "sticker-header-green";                    
                        break;
                }
            }
            else if(WHICH_BACKLOG == 'sprintBoardBacklog'){
            	which = this.sprintState;
                switch(which){
                    case 0:
                        this.stickerClassName = "sticker-header-blue";
                        break;
                    case 1:
                        this.stickerClassName = "sticker-header-green";                    
                        break;
                    case 2:
                        this.stickerClassName = "sticker-header-purple";                    
                        break;
                    case 3:
                        this.stickerClassName = "sticker-header-cyan";                    
                        break;
                    default:
                        this.stickerClassName = "sticker-header-orange"
                        break;
                }
            }
            if(this.isPokerFinished == false || this.time == null){
                /*If time of sticker was not estimated or a  Scrum Poker Game
                has not been finished yet, then show it greyed-out, without possibility to move.
                */
                this.stickerClassName = "sticker-locked";
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
 

  	/****************************************
	*										*
	* Functions for Command buttons START	*	
	*										*
    *****************************************/  
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
            StickerList.push({id: stickers[i].serverId,name:stickers[i].title, content:stickers[i].text, backlog: stickers[i].backlog, sprint:stickers[i].sprint ,sprint_state: stickers[i].sprintState}); 
        }
            //Preparing to call an Ajax Call
            console.log(StickerList);
            data.append('stickerList', JSON.stringify(StickerList));
            //let destAddress = "/course/2_product_backlog/" + courseId + "/";
            //ajaxCall("POST",destAddress, data, function(){return false;});

            let destAddress = "";
            //Added new part of the code
            if(WHICH_BACKLOG == 'backlog'){
               destAddress = "/course/2_product_backlog/" + courseId + "/";
            }
            if(WHICH_BACKLOG == 'sprintBacklog'){
                destAddress = "/course/3_sprint_backlog/" + courseId + "/" + SPRINT_NUMBER + "/";
            }
            if(WHICH_BACKLOG == 'sprintBoardBacklog'){
                destAddress = "/course/3_sprint_board/" + courseId + "/" + SPRINT_NUMBER + "/";
            }   
            ajaxCall("POST",destAddress, data, function(){return false;});

    };

    
    /*Functions for Command buttons END*/
    window.onresize = function(event) {
        /*
            On resize Event
            alert("Someone resized window. Stickers might not be in place!!")
        */
        let margin = 5;//in pixels
        initializeBacklogBoxes();

        for (var i = 0; i < stickers.length; i++){
            //draw Stickers according to data from Server.
            //Color order is the same for each backlog
            let which = 0;
            if(WHICH_BACKLOG == 'backlog'){
            	which  = stickers[i].backlog;
            }
            else if(WHICH_BACKLOG == 'sprintBacklog'){
            	which  = stickers[i].sprint;
            }
            else if(WHICH_BACKLOG == 'sprintBoardBacklog'){
	            which  = stickers[i].sprintState;
            }

            switch(which){
                case 0:
                    stickers[i].posX = log_1.left + margin;
                    break;
                case 1:
                    stickers[i].posX = log_2.left + margin;
                    break;
                case 2:
                    stickers[i].posX = log_3.left + margin;
                    break;
                case 3:
                    stickers[i].posX = log_4.left + margin;
                    break;
                default:
                	stickers[i].posX = log_4.left + log_4.width + margin;
                    this.stickerClassName = "sticker-header-orange"
                    break;
            }
            stickers[i].drawSticker();
        }  
    };

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
            //let area = document.querySelector('#new_story_content').getBoundingClientRect();
            let area = document.querySelector('#product_backlog').getBoundingClientRect();
            NEW_STICKER_V_OFFSET = NEW_STICKER_V_OFFSET +10;
            let NEW_STICKER_H_OFFSET = 10; 
            let title = document.querySelector('#new_story_name').value;
            let text = document.querySelector('#new_story_content').value;
            // Sticker(id=0,backlog=0,sprint=0,state=0, posX=0, posY=0,title = "Header",text = "Body") 
            let s;
            if(WHICH_BACKLOG == 'backlog'){
				s = new Sticker(stickers.length,-1,-1,-1,area.left + NEW_STICKER_H_OFFSET,area.top + scrollPos + NEW_STICKER_V_OFFSET,title,text);
            }
            else if(WHICH_BACKLOG == 'sprintBacklog'){
				s = new Sticker(stickers.length,1,SPRINT_NUMBER,-1,area.left + NEW_STICKER_H_OFFSET,area.top + scrollPos + NEW_STICKER_V_OFFSET,title,text);
            }
            else if(WHICH_BACKLOG == 'sprintBoardBacklog'){
				s = new Sticker(stickers.length,1,SPRINT_NUMBER,-1,area.left + NEW_STICKER_H_OFFSET,area.top + scrollPos + NEW_STICKER_V_OFFSET,title,text);
                alert("Created:  " + s.sprint + " "  + s.sprintState );
            }
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
        let step = 30; //Distance between next stickers.
        deleteStickers();//reset array with stickers.
        let story_stage;

        //initializeBacklogBoxes();
        for (var i = 0; i < data.length; i++){
            //Populating Stickers
            //Creating sticker object and giving him starting position.
            let temp_sticker = new Sticker(i);//giving only id, rest is filled by default constructor.
            //First check what kind of backlog we are working on.
            if(WHICH_BACKLOG == 'backlog'){
            	story_stage = data[i]['fields']['backlog'];
                if(story_stage == 0  || story_stage == -1){
                    temp_sticker.posX = log_1.left;
                    temp_sticker.posY = log_1_tempHeight;
                    if(log_1_tempHeight + step < log_1.top + log_1.height){
                        log_1_tempHeight += step;
                    }
                }
                else if(story_stage == 1){
                    temp_sticker.posX = log_2.left;
                    temp_sticker.posY = log_2_tempHeight;
                    if(log_2_tempHeight + step < log_2.top + log_2.height){              
                        log_2_tempHeight += step
                    }
                }
            }
            else if(WHICH_BACKLOG == 'sprintBacklog'){
            	story_stage = data[i]['fields']['sprint'];
                if(story_stage == 0){
                    temp_sticker.posX = log_1.left;
                    temp_sticker.posY = log_1_tempHeight;
                    if(log_1_tempHeight + step < log_1.top + log_1.height){
                        log_1_tempHeight += step;
                    }
                }
                else if(story_stage > 0){
                    temp_sticker.posX = log_2.left;
                    temp_sticker.posY = log_2_tempHeight;
                    if(log_2_tempHeight + step < log_2.top + log_2.height){              
                        log_2_tempHeight += step
                    }
                }
            }
            else if(WHICH_BACKLOG == 'sprintBoardBacklog'){
            	story_stage = data[i]['fields']['sprint_state'];
                if(story_stage == 0){
                    temp_sticker.posX = log_1.left;
                    temp_sticker.posY = log_1_tempHeight;
                    if(log_1_tempHeight + step < log_1.top + log_1.height){
                        log_1_tempHeight += step;
                    }
                }
                else if(story_stage == 1){
                    temp_sticker.posX = log_2.left;
                    temp_sticker.posY = log_2_tempHeight;
                    if(log_2_tempHeight + step < log_2.top + log_2.height){              
                        log_2_tempHeight += step
                    }
                }
                else if(story_stage == 2){
                    temp_sticker.posX = log_3.left;
                    temp_sticker.posY = log_3_tempHeight;
                    if(log_3_tempHeight + step < log_3.top + log_3.height){
                        log_3_tempHeight += step;
                    }
                }
                else if(story_stage == 3){
                    temp_sticker.posX = log_4.left;
                    temp_sticker.posY = log_4_tempHeight;
                    if(log_4_tempHeight + step < log_4.top + log_4.height){
                        log_4_tempHeight += step;
                    }
                }
                else if(story_stage == -1){
                    temp_sticker.posX = log_2.left +  log_2.width + step;
                    temp_sticker.posY = log_unassigned_tempHeight;
                    if(log_unassigned_tempHeight + step < log_2.top + log_2.height){
                        log_unassigned_tempHeight += step;
                    }
                }
            }
            //Depending on which stage was set on current backlog type.
            
            temp_sticker.title = data[i]['fields']['name'];   
            temp_sticker.text = data[i]['fields']['content'];
            temp_sticker.serverId = data[i]['pk'];
            temp_sticker.backlog = data[i]['fields']['backlog'];
            temp_sticker.sprint =  data[i]['fields']['sprint'];
            temp_sticker.sprintState = data[i]['fields']['sprint_state'];  
            temp_sticker.time =  data[i]['fields']['time'];
            temp_sticker.isPokerFinished = data[i]['fields']['is_poker_finished'];
            stickers.push(temp_sticker);
            console.log("Creating sticker: poxS " + temp_sticker.posX + " posY: " + temp_sticker.posY  +"id= " + temp_sticker.id + " name = " + temp_sticker.name + " text = " + temp_sticker.content + " backlog: "+ temp_sticker.backlog + " sprint: " + temp_sticker.sprint + " sprint_state: " + temp_sticker.sprintState);
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

    var initializeBacklogBoxes = function(){
    	console.log(WHICH_BACKLOG);
        if(WHICH_BACKLOG == 'backlog'){
	        log_1 = document.querySelector('#product_backlog').getBoundingClientRect();
	        log_2 = document.querySelector('#other_backlog').getBoundingClientRect();
        }
        else if(WHICH_BACKLOG == 'sprintBacklog'){
    		//If they are null it is probably sprintBacklog
        	log_1 = document.querySelector('#product_backlog').getBoundingClientRect();
       	 	log_2 = document.querySelector('#other_backlog').getBoundingClientRect();

        }
        else if(WHICH_BACKLOG == 'sprintBoardBacklog'){
        	//If they are null it is probably sprintBoardBacklog.
	        log_1 = document.querySelector('#sprint_not_started').getBoundingClientRect();
		    log_2 = document.querySelector('#sprint_wip').getBoundingClientRect();
		    log_3 = document.querySelector('#sprint_review').getBoundingClientRect();
		    log_4 = document.querySelector('#sprint_completed').getBoundingClientRect();
    	    log_3_tempHeight = parseFloat(log_3.top + scrollPos);
	     	log_4_tempHeight = parseFloat(log_4.top + scrollPos);
        }
        log_1_tempHeight = parseInt(log_1.top + scrollPos);
		log_2_tempHeight = parseInt(log_2.top + scrollPos);
	    log_unassigned_tempHeight = log_2.top + scrollPos;;
    }

    /*******************    MAIN START  *******************/
    window.onscroll = myOnScroll;
    document.addEventListener('mousemove', on_drag, false);
    document.addEventListener('mouseup', on_drag_end, false);
    //Asume I get all Stickers from server i.e. as an array.
	//Essential variables from server that help identify whichBacklog etc. 
    //Getting coordinates of boundingClientRects displayed in browswer.
    var scrollPos = 0;
    var log_1 = 0;
    var log_2 = 0;
    var log_3 = 0;
    var log_4 = 0;
    var log_unassigned = 0;
    var log_1_tempHeight = 0;
    var log_2_tempHeight = 0;
    var log_3_tempHeight = 0;
    var log_4_tempHeight = 0;
    var log_unassigned_tempHeight = 0;

	initializeBacklogBoxes();


    //Assign behaviour to the command buttons.
    document.querySelector('#command_see_details').onclick = c_see_details;
    document.querySelector('#command_save_progress').onclick = c_save_progress;
    document.querySelector('#new_story_submit').onclick  = displayNewSticker;// 'send_new_story' wa used previously;
    document.querySelector('#new_story_name').onclick  = clear_field_value;
    document.querySelector('#new_story_content').onclick  = clear_field_value;
    /*Populating stickers array with stickers from server, depending on which backlog was chosen.
    So far these are available types of ,,backlog''.
        - backlog
        - sprint backlog
        - sprint board backlog
    */
    var stickers = []
    if(WHICH_BACKLOG == 'backlog'){
        ajaxCall("GET", "/course/get_course_stickers/" + courseId + "/", {}, populateStickers);//First need to download stickers from server
    }
    if(WHICH_BACKLOG == 'sprintBacklog'){
	    let temp_data = new FormData();
	    temp_data.append("course_id", courseId);
	    temp_data.append("sprint", SPRINT_NUMBER);
	    ajaxCall("POST", "/course/get_course_sprint_backlog_stickers/" , temp_data, populateStickers);//First need to download stickers from server    
    }
    if(WHICH_BACKLOG == 'sprintBoardBacklog'){
	    let temp_data = new FormData();
	    temp_data.append("course_id", courseId);
	    temp_data.append("sprint", SPRINT_NUMBER);
	    ajaxCall("POST", "/course/get_course_sprint_stickers/" , temp_data, populateStickers);//First need to download stickers from server
    }     
    /*******************    MAIN END  *******************/
    
})();