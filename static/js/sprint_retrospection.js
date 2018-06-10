//Using IIFE construct.
(function () {
    'use strict';


//Grabs text from textarea and puts it into IFrame
    function populate_iframe(){
        var task_code = document.getElementById("dashboard-source").value;
        //Populating contents of iframe
        let targetIFrame = document.getElementById("dashboard-myiframe");
        targetIFrame.srcdoc = "<script> " + task_code + " <\/script>";
        window.alert("New code has been appended to an IFrame. Watch your progress in 'Results' window");
    }    

    function populate_iframe_with_multiple_stories(){
        console.log(stories);
        let targetIFrame = document.getElementById("dashboard-myiframe");
        
        let shippableProduct = "";
        for(let i = 0; i < stories.length; i++){
/*            shippableProduct = shippableProduct + "document.write('//Code for story: " + stories[i].name + "');";
            shippableProduct = shippableProduct + 'document.write("<br>");';
            shippableProduct = shippableProduct + stories[i].solution;
            shippableProduct = shippableProduct + 'document.write("<br><br>");';*/
            shippableProduct = shippableProduct + stories[i].solution;
        }
      


  targetIFrame.srcdoc = `<head>        
<style>

h1{
    margin-left:7%;
    margin-bottom:0;
    padding:0;
}
    BUTTON {
    color:black;
    font-size:1.5em;
    padding:2%;
    margin:2%;
    border-radius:10px;
    border-color: red;

    }
    BUTTON:hoover{
        pointer:cursor;
    }
    
    .board-class{
        display:block;
        border: 10px solid;
        border-color: green;
        margin:1%;
        z-index:8;
        position:absolute;
    }
    
    .points-container{
        display:block-inline;
        margin: auto;
        padding:5px;
        align: center;
    }
</style></head>`;

        targetIFrame.srcdoc = targetIFrame.srcdoc + "<body><\/body>";
        targetIFrame.srcdoc = targetIFrame.srcdoc  + "<script> "  +  shippableProduct + "var snake;var board;var game;var lblPoints;createWelcomeScreen();<\/script>";
        targetIFrame.style = 'overflow:hidden;height:700px;width:100%;';
        console.log(targetIFrame.srcdoc);
        console.log(targetIFrame.contentWindow.document.body);
        targetIFrame.focus();
    }


     /*MAIN*/
    document.getElementById("run-btn").onclick = populate_iframe_with_multiple_stories;

})();
