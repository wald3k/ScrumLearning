//Using IIFE construct.
(function () {
    'use strict';
    
    //Simple point object used when comparing if rectangle contains another rectangle.
    function MyPoint(x,y){
        this.x = x;
        this.y = y;
    }
    
    var dragged_element,
        on_drag_start,
        on_drag,
        on_drag_end,
        on_mouse_over,
        grabPointX,
        grabPointY,
        createSticker,
        zIndexCounter = 1;//for holding zIndex of sticker elements.
    
    on_drag_start = function (ev) {
        //Takes coordinates in which spot user clicked Sticker Header.
        //This will be handy to maintain this ratio during drag.
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
    
    //When mouse button is released.
    on_drag_end = function(ev){
        dragged_element = null;
        grabPointX = null;
        grabPointY = null;
        if (ev.target.className.indexOf('sticker-header') === -1) {
            //if sticker header was not dragged then return.
            //This helps to avoid issues with screen resize. Otehrwise all stickers wold be treated
            //in the else part.
            return;
        }

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
        if(!ev.target.classList.contains('.sticker')){
            return;
        }
    }
        
    //Defining class representing a Sticker Object
    function Sticker(id,backlog=0, posX, posY,title = "Header",text = "Body") {
        this.id = id;
        this.backlogPrev = null;
        this.posX = posX;
        this.posY = posY;
        this.title = title;
        this.text=text;
        this.stickerEl = document.createElement('div');
        this.barEl = document.createElement('div');
        this.textareaEl = document.createElement('textarea');
        this.stickerClassName;
        this.backlogPrimary = backlog;
        this.severId;
        //Declaring functions

        this.drawSticker = function(){
            this.textareaEl.setAttribute('readonly', 'readonly');
            switch(this.backlogPrimary){
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
            this.barEl.innerHTML= this.title;
            this.textareaEl.innerHTML = this.text;
            this.stickerEl.setAttribute("id", this.id); //setting unique id
            document.body.appendChild(this.stickerEl);
        }
        this.updateBacklog = function(newBacklog){
            this.backlogPrev = this.backlogPrimary;
            this.backlogPrimary = newBacklog;
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
            switch(this.backlogPrimary){
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
    };

        var rightClickContext = function(ev){
            let id = ev.target.parentNode.id;
            console.log("Righr click");
            let serverId = 0;
            if (confirm('Are you sure you want to delete this story from this course?')) {
                alert("Deleting: " + id);
                for(let i = 0; i < stickers.length; i++){//Looking for a server id of the story.
                    if(i == id){
                        serverId = stickers[i].serverId;
                        break;
                    }
                }
                deleteSelectedSticker(id);
                let destAddress= "/course/delete_story/" + courseId + "/";
                let data = new FormData();
                data.append("story_id", serverId);
                ajaxCall("POST",destAddress, data, function(){});
            } else {
                alert("Maybe later..");
            }
            return false;
        }
    
    var checkBoundingBoxes = function(innerBox, outerBox){
        //two diagonal points, used to tell if box is inside other box.
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
        alert("Product backlog will be send to server! So that you don't loose your progress.");
        let data = new FormData();
        let StickerList = [];
        for (var i = 0; i < stickers.length; i++){
            //draw Stickers according to data from Server
            if(stickers[i].backlogPrimary == -1){
               stickers[i].backlogPrimary = stickers[i].backlogPrev;
            }
            StickerList.push({id: stickers[i].serverId,backlog:stickers[i].backlogPrimary}); 
        }
            //Preparing to call an Ajax Call
            data.append('stickerList', JSON.stringify(StickerList));
            let destAddress = "/course/2_product_backlog/" + courseId + "/";
            ajaxCall("POST",destAddress, data, productBacklogSuccess);
    };

    var productBacklogSuccess = function(data){
        console.log("Got response after saving backlog progress: " + data);
    }
    
    /*Functions for Command buttons END*/


    /*On resize Event*/
    window.onresize = function(event) {
        //alert("Someone resized window. Stickers might not be in place!!")
        productBacklogRect = document.querySelector('#product_backlog').getBoundingClientRect();
        otherBacklogRect = document.querySelector('#other_backlog').getBoundingClientRect();
        let margin = 5;//in pixels
      for (var i = 0; i < stickers.length; i++){
            //draw Stickers according to data from Server
            switch(stickers[i].backlogPrimary){
                case 0:
                    stickers[i].posX = productBacklogRect.left + margin;
                    break;
                case 1:
                    stickers[i].posX = otherBacklogRect.left + margin;
                    break;
                default:
                    this.stickerClassName = "sticker-header-orange"
                    break;
            }
            stickers[i].drawSticker();
        }
    
    };

    var send_new_story = function(){
        let name =     document.querySelector('#new_story_name').value;
        let content  =     document.querySelector('#new_story_content').innerHTML;
        let data = new FormData();
        data.append("name", name);
        data.append("content",content);
        let destAddress= "/course/create_new_story/" + courseId + "/";
        ajaxCall("POST",destAddress, data,displayNewSticker);
    }
    var deleteStickers = function(){
        for(let i = 0; i < stickers.length; i++){
            stickers[i].stickerEl.remove();
            stickers[i].barEl.remove();
            stickers[i].textareaEl.remove();
        }
        stickers = [];
        console.log("Deleted");
    }

    var deleteSelectedSticker = function(stickerId){
        //Deletes sticer with id = stickerId and re-creates stickers array.
            let tempStickers = [];
            alert(stickerId);
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
            console.log("Sticker: " + stickerId + " deleted.");
            return;
    }

    var displayNewSticker = function(data){
            /*Displays new sticker on the screen*/
            let area = document.querySelector('#new_story_content').getBoundingClientRect();
            let s = new Sticker(stickers.length,-1,area.left + area.width,area.top + scrollPos);
            stickers.push(s);
            s.title = document.querySelector('#new_story_name').value;
            s.text = document.querySelector('#new_story_content').value;
            s.drawSticker();
    }



    var populateStickers = function(data){
        data = JSON.parse(data);
        let id=0;
        let name = "";
        let content = "";
        data=JSON.parse(data['stickers']);
        //For printing stickers one by one
        let productBacklogTempHeight = productBacklogRect.top + scrollPos;
        let otherBacklogTempHeight = otherBacklogRect.top + scrollPos;
        let step = 80; //Distance between next stickers.
        deleteStickers();//reset array with stickers.
        for (var i = 0; i < data.length; i++){
            //Populating Stickers
            id = data[i]['pk'];
            name = data[i]['fields']['name'];
            var whichBacklog = data[i]['fields']['backlog_primary'];
            content = data[i]['fields']['content'];
            console.log("Creating sticker: " +"id= " + id + " name = " + name + " text = " + content + " backlog: " + whichBacklog);
            //Creating sticker object and giving him starting position.
            if(whichBacklog == 0){
                stickers.push(new Sticker(i,0,productBacklogRect.left,productBacklogTempHeight));
                if(productBacklogTempHeight+step < productBacklogRect.top+productBacklogRect.height){
                    productBacklogTempHeight += step;
                }
            }
            else{
                stickers.push(new Sticker(i,1,otherBacklogRect.left,otherBacklogTempHeight));
                if(otherBacklogTempHeight+step < otherBacklogRect.top + otherBacklogRect.height){
                    otherBacklogTempHeight += step;
                }
            }
            stickers[i].title = name;
            stickers[i].text = content;
            stickers[i].serverId = id;
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
    document.querySelector('#new_story_submit').onclick  = send_new_story;
    document.querySelector('#new_story_name').onclick  = clear_field_value;
    document.querySelector('#new_story_content').onclick  = clear_field_value;
    var stickers = []
    ajaxCall("GET", "/course/get_course_stickers/" + courseId + "/", {}, populateStickers);//First need to download stickers from server
    
    /*******************    MAIN END  *******************/
    console.log("writting stickers: " + stickers);
    
})();