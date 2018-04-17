(function () {
var questions = [];
var myQuiz = [];
var startQuiz = function(){
	currentVisibility = document.getElementById('quiz-start').style.visibility;
	console.log(currentVisibility);
	if(currentVisibility === 'visible'){
		document.getElementById('quiz-start').remove();
		document.getElementById('quiz').style.visibility = 'visible'; 
		document.getElementById('quiz-status').innerHTML = 'Quiz has started...';
	}
};

var get_quiz = function(){
    var data = new FormData();
    data.append('course_pk', courseId);
    let destAddress = '/course/get_quiz/';
    ajaxCall("POST",destAddress, data, initializeQuiz); //Post results to the server
};

function Question(text, answers){
    /* Constructor */
    this.text = text;  
    this.answers = answers;
    this.selectedAnswer = null;
};
function Answer(text, correctAnswer){
    /* Constructor */
    this.text = text;  
	this.correctAnswer = correctAnswer;
};

var initializeQuiz = function(data){
    data = JSON.parse(data);
	for(var i = 0; i < data['quiz_data'].length; i++){
		//question (might be more than one)
		var answers = []
		for(var j = 0; j < data['quiz_data'][i]['answers'].length;j++){
			//console.log('   ' + data[i]['answers'][j][0]);
			answers.push(new Answer(data['quiz_data'][i]['answers'][j][0],data['quiz_data'][i]['answers'][j][1]));
		}
		q = new Question(data['quiz_data'][i]['question'],answers);
		questions.push(q);
		
	}
	console.log("Quiz initialized!");
    //alert(data[0]['which_course']);
    console.log(data);
	manager = new QuizManager(data['course_id'], questions);
	document.getElementById('btn0').onclick = checkAnswer;
	document.getElementById('btn1').onclick = checkAnswer;
	document.getElementById('btn2').onclick = checkAnswer;
	document.getElementById('btn3').onclick = checkAnswer;
	document.getElementById('btn-quiz-next').onclick = nextQuestion;
	document.getElementById('btn-quiz-prev').onclick = prevQuestion;
	document.getElementById('summary').onclick = summarizeQuiz;

    if(data['already_passed'] == true){
        let el =document.getElementById('already-passed').innerHTML = "Congratultions! You've already passed this quiz. But still can improve!"
    }

    manager.displayQuestion(0);

};

/*
QUIZMANAGER
*/
function QuizManager(id, questions){
    this.id = id;
    this.questions = questions;
    this.score = 0;
    this.currQuestion = 0;
}
QuizManager.prototype.calculateScore = function(){
    this.score = 0;
    for (let i = 0; i < this.questions.length; i++){
    	for(let j = 0; j < this.questions[i].answers.length;j++){
	        if(this.questions[i].answers[j].correctAnswer === true && this.questions[i].selectedAnswer === this.questions[i].answers[j].text){
	            console.log("Question: " + i + " correct!");
	            this.questions[i].answers[j].correctAnswer === true;
	            this.score++;
	        }
	    }
    }
    return this.score;
};
QuizManager.prototype.getQuizSummary = function(){
    let summary = "";
    for (let i = 0; i < this.questions.length; i++){
    	isCorrect = false
    	for(let j = 0; j < this.questions[i].answers.length;j++){
	        if(this.questions[i].answers[j].correctAnswer === true && this.questions[i].selectedAnswer === this.questions[i].answers[j].text){
	        	isCorrect = true;
	        }
	    }
        if(isCorrect === true){
            summary += "Question: " + (i + 1) + " correct!\n";
        }
        else{
            summary += "Question: " + (i + 1) + " incorrect!\n";
        }
    }
    return summary;
};

QuizManager.prototype.displayQuestion = function(question_number){
	console.log("In display " + question_number);
    if(question_number < 0 || question_number > this.questions.length - 1){
        return;
    }
    else{
        this.currQuestion = question_number;
        var el = document.getElementById("question");
        el.innerHTML = this.questions[question_number].text;

        //First just reset all answers! This is needed if there are few than 4 answers for a question.
	    for(let i = 0; i < 4; i++){
	        el = document.getElementById("answer" + i);
	        el.innerHTML = "";
	    }
        for (let i = 0; i < this.questions[question_number].answers.length; i++){
            el = document.getElementById("answer" + i);
            el.innerHTML = this.questions[question_number].answers[i].text;
        }
    }
}

/*GLOBAL FUNCTIONS*/
var checkAnswer = function(ev){
    if(ev.target.className==="btn-selected"){
        ev.target.className="";
        manager.questions[manager.currQuestion].selectedAnswer = null;
    }
    else{
        ev.target.className = "btn-selected"
        let answerByUser = document.getElementById(ev.target.id).children[0].innerHTML;
        manager.questions[manager.currQuestion].selectedAnswer = answerByUser;
        console.log(answerByUser);
    }
    
    for(let i = 0; i < 4; i++){
    	//Only one answer allowed
        let el =  document.getElementById('btn'+ i)
        if(el != ev.target){
           document.getElementById('btn'+ i).className="";
           }
    }
    updateProgress();
};

var updateProgress = function(){
    //Function triggered i.e. on next/prev question.
    let questions_answered = 0;
    let calculated_width = 0;
    let total_questions =  manager.questions.length
    for (let i = 0; i < total_questions; i++){
        if(manager.questions[i].selectedAnswer !== null){//user selected some answer
            questions_answered++;
        }
    }
    calculated_width = questions_answered/total_questions * 100;
    document.getElementById('quiz-progress').innerHTML = "Questions answered: " + questions_answered + " of " + total_questions;
    document.getElementById('quiz-progress').style="width:" + calculated_width + "%";
};

var nextQuestion = function(){
    if(manager.currQuestion >= manager.questions.length - 1){
        return;
    }
    manager.currQuestion++;
    for(let i = 0; i < manager.questions[manager.currQuestion].answers.length; i++){
        if(manager.questions[manager.currQuestion].answers[i].text === manager.questions[manager.currQuestion].selectedAnswer){
            document.getElementById('btn'+i).className="btn-selected";
        }
        else{
            document.getElementById('btn'+i).className="";
        }
    }
    manager.displayQuestion(manager.currQuestion);
    updateProgress();
};

var prevQuestion = function(){
    if(manager.currQuestion <1){
        return;
    }
    manager.currQuestion--;
    for(let i = 0; i < manager.questions[manager.currQuestion].answers.length; i++){
        if(manager.questions[manager.currQuestion].answers[i].text === manager.questions[manager.currQuestion].selectedAnswer){
            document.getElementById('btn'+i).className="btn-selected";
        }
        else{
            document.getElementById('btn'+i).className="";
        }
    }
    manager.displayQuestion(manager.currQuestion);    
    updateProgress();
};
var summarizeQuiz = function(){
    manager.calculateScore();
    let total_questions = manager.questions.length;
    let percentage_result = (manager.score/total_questions * 100).round(0);
    let passed;
    if(percentage_result > 60){
        passed = "Success!"
    }
    else{
        passed = "Try again!"
    }
    let final_message = "You score is: " + percentage_result + " %." + "\n" + passed;
    alert(final_message + "\n" + manager.getQuizSummary() + "CHECK MESSAGE");
    post_quiz_results();
};
var post_quiz_results= function(){
    /*Sends result of the quiz to the server, so that they can be saved into the database.*/
    let destAddress= "/course/set_quiz_result/";
    let data = new FormData();
    data.append("course_id", courseId); 
    data.append("quiz_id", manager.id);
    data.append("points", manager.score);
    ajaxCall("POST",destAddress, data, function(){}); //Post results to the server
}
Number.prototype.round = function(places) {
    //Helper function for rounding numbers
    return +(Math.round(this + "e+" + places)  + "e-" + places);
}

//MAIN
var manager;
document.getElementById('btn-start-quiz').onclick=startQuiz;
document.getElementById('quiz').style.visibility = 'hidden'; 
document.getElementById('quiz-start').style.visibility = 'visible';
get_quiz();
console.log(manager);



}());//Closing first anonymus function.1