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
        zIndexCounter = 1;
    
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
    on_drag_end = function(){
        dragged_element = null;
        grabPointX = null;
        grabPointY = null;
        updateStickerColors();
    }
    
    on_mouse_over = function(ev){
        if(!ev.target.classList.contains('.sticker')){
            return;
        }
    }
    document.addEventListener('mousemove', on_drag, false);
    document.addEventListener('mouseup', on_drag_end, false);
        
    //Defining class representing a Sticker Object
    function Sticker(id,color, posX, posY,title = "Header",text = "Body") {
        this.id = id;
        this.color = color;
        this.colorPrev = null;
        this.posX = posX;
        this.posY = posY;
        this.title = title;
        this.text=text;
        this.stickerEl = document.createElement('div');
        this.barEl = document.createElement('div');
        this.textareaEl = document.createElement('textarea');
        this.stickerClassName;
        //Declaring functions
        this.hello = function(){
            return "Im " + this.color + " sticker!";
        }
        this.drawSticker = function(){
            //Setting class with color attached to the end. This is shorter than switch statement.
            this.stickerClassName = "sticker-header-" + this.color; 
            this.textareaEl.setAttribute('readonly', 'readonly');
            this.barEl.classList.add(this.stickerClassName);
            this.stickerEl.classList.add('sticker');
            this.stickerEl.appendChild(this.barEl);
            this.stickerEl.appendChild(this.textareaEl);
            this.stickerEl.addEventListener('mouseover', on_mouse_over, false);
            this.stickerEl.addEventListener('mousedown', on_drag_start, false);
            this.stickerEl.style.transform = "translateX(" + this.posX + "px) translateY(" + this.posY + "px)";
            this.barEl.innerHTML= this.title;
            this.textareaEl.innerHTML = this.text;
            this.stickerEl.setAttribute("id", this.id); //setting unique id
            document.body.appendChild(this.stickerEl);
        }
        this.updateColor = function(color){
            this.colorPrev = this.color;
            this.color = color;
                switch(this.colorPrev){
                case 'blue':
                    this.stickerClassName = "sticker-header-blue";
                    break;
                case 'red':
                    this.stickerClassName = "sticker-header-red";
                    break;
                case 'green':
                    this.stickerClassName = "sticker-header-green";
                    break;
                default:
                    this.stickerClassName = "sticker-header-orange"
                    break;
            }
            this.barEl.classList.remove(this.stickerClassName);
            switch(this.color){
                case 'blue':
                    this.stickerClassName = "sticker-header-blue";
                    break;
                case 'red':
                    this.stickerClassName = "sticker-header-red";
                    break;
                case 'green':
                    this.stickerClassName = "sticker-header-green";
                    break;
                default:
                    this.stickerClassName = "sticker-header-orange"
                    break;
            }
            this.barEl.classList.add(this.stickerClassName);
        }
    };
    
    var updateStickerColors = function(){
       for (var i = 0; i < stickers.length; i++){
            //Sticker Header bouding box
            var bb = stickers[i].barEl.getBoundingClientRect();
           if(checkBoundingBoxes(bb,commitedStoriesBacklog) == true){
               stickers[i].updateColor('green');
              }
           else if (checkBoundingBoxes(bb,tasksNotStarted) == true){
              stickers[i].updateColor('blue');
           }
           else if (checkBoundingBoxes(bb,tasksWip) == true){
              stickers[i].updateColor('orange');
           }
           else if (checkBoundingBoxes(bb,tasksCompleted) == true){
              stickers[i].updateColor('green');
           }
           else{
               stickers[i].updateColor('red');
           }
       }
    }
    
    var checkBoundingBoxes = function(innerBox, outerBox){
        //two diagonal points, used to tell if box is inside other box.
        var p1 = new MyPoint(innerBox.left, innerBox.top);
        var p2 = new MyPoint(innerBox.left + innerBox.width, innerBox.top + innerBox.height);

        if(p1.x > outerBox.left && p1.x < outerBox.left + outerBox.width &&
            p1.y > outerBox.top && p1.y < outerBox.top + outerBox.height &&
            p2.x > outerBox.left && p2.x < outerBox.left + outerBox.width &&
            p2.y > outerBox.top && p2.y < outerBox.top + outerBox.height
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
        let sendMessage = ""
        for (var i = 0; i < stickers.length; i++){
           sendMessage += "Sticker " + i + ": " + stickers[i].color + "\n";
        }
        alert("Product backlog will be send to server! So that you don't loose your progress." + sendMessage);
    };
    
    /*Functions for Command buttons END*/

    /*******************    MAIN START  *******************/
    
    //Asume I get all Stickers from server i.e. as an array.
    //Getting coordinates of boundingClientRects displayed in browswer.
    var commitedStoriesBacklog = document.querySelector('#sprint_commited_stories').getBoundingClientRect();
    var tasksNotStarted = document.querySelector('#sprint_tasks_not_started').getBoundingClientRect();
    var tasksWip = document.querySelector('#sprint_work_in_progress').getBoundingClientRect();
    var tasksCompleted = document.querySelector('#sprint_tasks_completed').getBoundingClientRect();
    //Assign behaviour to the command buttons.
    document.querySelector('#command_see_details').onclick = c_see_details;
    document.querySelector('#command_save_progress').onclick = c_save_progress;
    var stickers = []
    //Populating Stickers
    for (var i = 0; i < 5; i++){
    stickers.push(new Sticker(i,'blue',commitedStoriesBacklog.left,commitedStoriesBacklog.top));
    }
    
    
    for (var i = 0; i < stickers.length; i++){
        //draw Stickers according to data from Server
        stickers[i].drawSticker();
        console.log("Drawing new!!");
    }
    
    /*******************    MAIN END  *******************/
    
})();