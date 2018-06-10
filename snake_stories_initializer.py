from Course.models import Story, Course
from Profile.models import Profile

story_author = Profile.objects.get(pk=1)
which_course = Course.objects.get(pk=1)

new_story = Story()
new_story.course = which_course
new_story.author = story_author
new_story.name = "Create a Cell class"
new_story.content= """
Cell class should have two methods:
A constructor(x,y) that takes two arguments: x & y and initializes this.x and this.y.
A toString() method which returns string value in format such that: "(x,y)", where x&y are values of Cell fields.
"""
new_story.solution_test = """
c = new Cell(3,5);
assert(c.x == 3 && c.y == 5, "Cell constructor class test");
assert(c.toString() == "(3,5)", "Cell toString method test");
"""
new_story.solution = """
class Cell{
	/*
		Representis a cell object that has two coordinates (x,y)
	*/
	constructor(x,y){
		/*Constructor takes x & y coordinates that will */
		this.x = x;
		this.y = y;
	}

	toString(){
		/*Overloaded toString method. Prints cell coordinates in parentheses i.e (x_value,y_value).*/
		return ("("+this.x+","+this.y+")");
	}
}
"""
new_story.perfect_solution = """
class Cell{
	/*
		Representis a cell object that has two coordinates (x,y)
	*/
	constructor(x,y){
		/*Constructor takes x & y coordinates that will */
		this.x = x;
		this.y = y;
	}

	toString(){
		/*Overloaded toString method. Prints cell coordinates in parentheses i.e (x_value,y_value).*/
		return ("("+this.x+","+this.y+")");
	}
}
"""
new_story.save() #Save to DB
#---------------------------------------------------------------------------------------
new_story = Story()
new_story.course = which_course
new_story.author = story_author
new_story.name = "Create a Snake class"
new_story.content= """
It should have following fields:
	this.body - an array of Cell elements that create a body of a snake.
	this.directionX - takes values -1, 0 or 1, where 1 means that snake is going down(-1), up(1) or not moving horizontally(0).
	this.directionY - takes values -1, 0 or 1, where 1 means that snake is going down(-1), up(1) or not moving vertically(0).
	this.food - a cell object
It should have following methods:
constructor(el): El is a Cell object
addBody(el): Appends a Cell object to a body array.
move(): Moves Snake cells according to directionX & directionY.
print(): Prints Cells of Snake body to the console.
getTailCell(): Returns snake's tail Cell object.
"""
new_story.solution_test = """
class Cell{
		constructor(x,y){
			this.x = x;
			this.y = y;
		}
	}
s = new Snake(new Cell(3,4);
assert(s.body.length == 1,"Snake body length test");
s.addBody(new Cell(3,5));
assert(s.body.length == 2,"Snake body adding body cell test");
"""
new_story.solution="""
class Snake{
	/*
	Representing Snake class.
	body: array, that holds Cell objects.
	directionX: determines if snakes  moves in X-axis and in which direction.
	directionY: determines if snakes  moves in Y-axis and in which direction.
	food: a cell that determines in which cell there is a food that makes snake grow bigger.
	*/
	constructor(el){
		/*
		@param {el} Cell object for the head of snake.
		*/
		this.body = [];
		this.body.push(el)
		this.directionX = 0;
		this.directionY = 1;
		this.food = new Cell(0,0);
	}

	addBody(el){
		/*
		Increments snake body.
		@param {Cell} Cell object is added to the tail of the snake.
		*/
		this.body.push(el);
	}

	move(){
		/*
		Moves Snake cells according to directionX & directionY.
		*/
		let new_head = new Cell(this.body[0].x,this.body[0].y);
		new_head.x = new_head.x + this.directionX
		new_head.y = new_head.y + this.directionY;
		let tailCell = this.getTailCell();
		let enlargeSnake = false;
		if(new_head.x == this.food.x && new_head.y == this.food.y){
			enlargeSnake = true;
		}
		for (let i = this.body.length-1; i > 0; i--){
			this.body[i].x = this.body[i-1].x;
			this.body[i].y = this.body[i-1].y;
		}
		this.body[0] = new_head;
		
		if(enlargeSnake == true){//Enlarge Snake
		console.log("Enlarging");
			this.addBody(tailCell);
			this.food.x =  Math.floor(Math.random() * Math.floor(10));
			this.food.y =  Math.floor(Math.random() * Math.floor(10));
		}
	}
		
	getTailCell(){
		/*
			Returns snake's tail Cell object.
		*/
		return new Cell(this.body[this.body.length-1].x,this.body[this.body.length-1].y);
	}

	print(){
		/*
		Prints Cells of Snake body.
		*/
		for (let i = 0; i < this.body.length; i++){
			console.log(this.body[i])
		}
	}
}
"""
new_story.perfect_solution = """
class Snake{
	/*
	Representing Snake class.
	body: array, that holds Cell objects.
	directionX: determines if snakes  moves in X-axis and in which direction.
	directionY: determines if snakes  moves in Y-axis and in which direction.
	food: a cell that determines in which cell there is a food that makes snake grow bigger.
	*/
	constructor(el){
		/*
		@param {el} Cell object for the head of snake.
		*/
		this.body = [];
		this.body.push(el)
		this.directionX = 0;
		this.directionY = 1;
		this.food = new Cell(0,0);
	}

	addBody(el){
		/*
		Increments snake body.
		@param {Cell} Cell object is added to the tail of the snake.
		*/
		this.body.push(el);
	}

	move(){
		/*
		Moves Snake cells according to directionX & directionY.
		*/
		let new_head = new Cell(this.body[0].x,this.body[0].y);
		new_head.x = new_head.x + this.directionX
		new_head.y = new_head.y + this.directionY;
		let tailCell = this.getTailCell();
		let enlargeSnake = false;
		if(new_head.x == this.food.x && new_head.y == this.food.y){
			enlargeSnake = true;
		}
		for (let i = this.body.length-1; i > 0; i--){
			this.body[i].x = this.body[i-1].x;
			this.body[i].y = this.body[i-1].y;
		}
		this.body[0] = new_head;
		
		if(enlargeSnake == true){//Enlarge Snake
		console.log("Enlarging");
			this.addBody(tailCell);
			this.food.x =  Math.floor(Math.random() * Math.floor(10));
			this.food.y =  Math.floor(Math.random() * Math.floor(10));
		}
	}
		
	getTailCell(){
		/*
			Returns snake's tail Cell object.
		*/
		return new Cell(this.body[this.body.length-1].x,this.body[this.body.length-1].y);
	}

	print(){
		/*
		Prints Cells of Snake body.
		*/
		for (let i = 0; i < this.body.length; i++){
			console.log(this.body[i])
		}
	}
}
"""
new_story.save()

#---------------------------------------------------------------------------------------
new_story = Story()
new_story.course = which_course
new_story.author = story_author
new_story.name = "Create a GameBoard class"
new_story.content= """
It should contain:
constructor(size)
drawEmptyCell(x,y,size)
paintCleanBoard()
drawSnakeCell(x,y,size)
"""
new_story.solution_test = """
gb = new GameBoard(34);
assert(gb.size == 34, "Testing GameBoard size argument");
"""
new_story.solution="""
class GameBoard{
	/*
	Class representing a rectangular board that consists of rectangle cells.
	It should have following fields:
		this.size  - Dimension of a rectangular snake board;
		this.gridSize  - Number of pixels that one Cell takes on screen;
		this.canvas - An HTML canvas eelemnt.
		this.canvas.width & height = this.size * this.gridSize;
		this.ctx = this.canvas.getContext("2d");
	It should have following methods:
		drawEmptyCell(x,y,size) - Creates an empty board cell.	
		drawFood(x,y,size) - Creates a food cell cell.
		drawFood(x,y,size) - Creates a food cell cell.
		paintCleanBoard() - Creates an empty board
		drawSnakeCell(x,y,size) - 	Draws a Cell on a board that represents a part of a snake.
	*/
	constructor(size){
		/*
		@param {size} specifies an N number of cells in an NxN game board.
		*/
		this.size = size;
		this.gridSize = 30;
		this.canvas = document.createElement('canvas');
		this.canvas.id = "BoardCanvas";
		this.canvas.className = "board-class";
		this.canvas.width = this.size * this.gridSize;
		this.canvas.height = this.size * this.gridSize;
		document.body.appendChild(this.canvas)
		this.ctx = this.canvas.getContext("2d");
		this.paintCleanBoard();
	}

	drawEmptyCell(x,y,size){
		/*Creates an empty board cell.*/
	    this.ctx.strokeStyle = "rgba(255, 0, 0, 0.2)";
		this.ctx.strokeRect(x,y,size,size);
		this.ctx.fillStyle = "rgba(255, 255, 255, 1.0)";
		this.ctx.fillRect(x, y, size, size);
	}
	
	drawFood(x,y,size){
		/*Creates a food cell cell.*/
	    this.ctx.strokeStyle = "rgba(255, 0, 0, 1.0)";
		this.ctx.strokeRect(x,y,size,size);
		this.ctx.fillStyle = "rgba(255, 0, 0, 1.0)";
		this.ctx.fillRect(x, y, size, size);
	}

	paintCleanBoard(){
		/*Creates an empty board*/
		for (let i =0; i<this.size; i++){
			for(let j = 0; j < this.size; j++){
				this.drawEmptyCell(i * this.gridSize,j * this.gridSize,this.gridSize);
			}
		}
	}

	drawSnakeCell(x,y,size){
		/*Draws a Cell on a board that represents a part of a snake.*/
	    this.ctx.strokeStyle = "rgba(100, 100, 100, 0.8)";
    	this.ctx.lineWidth = 2;
	    this.ctx.strokeRect(x,y,size,size);
		this.ctx.fillStyle = "rgba(180, 255, 200, 1.0)";
		this.ctx.fillRect(x, y, size, size);
		this.ctx.lineWidth = 1;
	}
}
"""
new_story.perfect_solution = """
class GameBoard{
	/*
	Class representing a rectangular board that consists of rectangle cells.
	It should have following fields:
		this.size  - Dimension of a rectangular snake board;
		this.gridSize  - Number of pixels that one Cell takes on screen;
		this.canvas - An HTML canvas eelemnt.
		this.canvas.width & height = this.size * this.gridSize;
		this.ctx = this.canvas.getContext("2d");
	It should have following methods:
		drawEmptyCell(x,y,size) - Creates an empty board cell.	
		drawFood(x,y,size) - Creates a food cell cell.
		drawFood(x,y,size) - Creates a food cell cell.
		paintCleanBoard() - Creates an empty board
		drawSnakeCell(x,y,size) - 	Draws a Cell on a board that represents a part of a snake.
	*/
	constructor(size){
		/*
		@param {size} specifies an N number of cells in an NxN game board.
		*/
		this.size = size;
		this.gridSize = 30;
		this.canvas = document.createElement('canvas');
		this.canvas.id = "BoardCanvas";
		this.canvas.className = "board-class";
		this.canvas.width = this.size * this.gridSize;
		this.canvas.height = this.size * this.gridSize;
		document.body.appendChild(this.canvas)
		this.ctx = this.canvas.getContext("2d");
		this.paintCleanBoard();
	}

	drawEmptyCell(x,y,size){
		/*Creates an empty board cell.*/
	    this.ctx.strokeStyle = "rgba(255, 0, 0, 0.2)";
		this.ctx.strokeRect(x,y,size,size);
		this.ctx.fillStyle = "rgba(255, 255, 255, 1.0)";
		this.ctx.fillRect(x, y, size, size);
	}
	
	drawFood(x,y,size){
		/*Creates a food cell cell.*/
	    this.ctx.strokeStyle = "rgba(255, 0, 0, 1.0)";
		this.ctx.strokeRect(x,y,size,size);
		this.ctx.fillStyle = "rgba(255, 0, 0, 1.0)";
		this.ctx.fillRect(x, y, size, size);
	}

	paintCleanBoard(){
		/*Creates an empty board*/
		for (let i =0; i<this.size; i++){
			for(let j = 0; j < this.size; j++){
				this.drawEmptyCell(i * this.gridSize,j * this.gridSize,this.gridSize);
			}
		}
	}

	drawSnakeCell(x,y,size){
		/*Draws a Cell on a board that represents a part of a snake.*/
	    this.ctx.strokeStyle = "rgba(100, 100, 100, 0.8)";
    	this.ctx.lineWidth = 2;
	    this.ctx.strokeRect(x,y,size,size);
		this.ctx.fillStyle = "rgba(180, 255, 200, 1.0)";
		this.ctx.fillRect(x, y, size, size);
		this.ctx.lineWidth = 1;
	}
}
"""
new_story.save()

#---------------------------------------------------------------------------------------
new_story = Story()
new_story.course = which_course
new_story.author = story_author
new_story.name = "Create a SnakeGame"
new_story.content= """
It should contain:
constructor(board, snake)
paintSnake() - Moves & paints Snake position on a board
isSnakeAlive() - Check if Snake head is inside board and returns boolean true value if snake is still alive. If snake is not alive then return false.
"""
new_story.solution_test = """
sg = new SnakeGame();
assert(sg.points == 0, "Testing SnakeGame points value");
"""
new_story.solution="""
class SnakeGame{
	/*
	Represents a class of Snake Game. 
	Is responsible for managing Snake & Board objects
	*/
	constructor(board, snake){
		this.board = board;
		this.snake = snake;
		this.gameSpeed = 500;
		this.itervalID = setInterval(this.paintSnake.bind(this),this.gameSpeed);
		this.points = 0;
	}
	
	finishGame(){
		/*
		Stops the interval that is responsoble for invoking paintSnake method.
		*/
		clearInterval(this.itervalID);
	}
	
	paintSnake(){
		/*Moves & paints Snake position on a board.*/
		this.board.paintCleanBoard();
		let size = this.board.gridSize;
		this.snake.move();
		for (let i = 0; i < this.snake.body.length; i++){
			this.board.drawSnakeCell(this.snake.body[i].x * size,this.snake.body[i].y * size,size);
			this.board.drawFood(this.snake.food.x * size,this.snake.food.y * size,size);
		}
		if(this.isSnakeAlive() == false){
			alert("GAME OVER\nPoints: " + this.points);
			this.finishGame();
		}
		console.log(this.snake.body[0].x);
		this.addPoints();
		this.increseGameSpeed()
	}

	isSnakeAlive(){
		/*Check if Snake head is inside board and returns boolean true value if snake is still alive. 
			If snake is not alive then return false.
		*/
		if(this.snake.body[0].x < 0 || 
			this.snake.body[0].x >= this.board.size ||
			this.snake.body[0].y < 0 ||
			this.snake.body[0].y >= this.board.size){
			return false;
		}
		/*Check if Snake head has not hit any part of the Snake's body.*/
		for(let i = 1; i < this.snake.body.length; i++){
			if(this.snake.body[0].x == this.snake.body[i].x && this.snake.body[0].y == this.snake.body[i].y){
				return false;
			}
		}
		return true;
	}
	
	addPoints(){
		this.points = this.points  + 1;
		lblPoints.innerHTML = this.points;
		return this.points;
	}
	
	increseGameSpeed(){
		/*
			Increases gamespeed as the points grow but not beyond the speed step variable.
		*/
		let speedStep = 100;
		if(this.points % 10 == 0 && this.gameSpeed >=speedStep * 3){
			this.gameSpeed = this.gameSpeed  - speedStep;
			clearInterval(this.itervalID);
			this.itervalID = setInterval(this.paintSnake.bind(this),this.gameSpeed);
		}	
	}
}
"""
new_story.perfect_solution = """
class SnakeGame{
	/*
	Represents a class of Snake Game. 
	Is responsible for managing Snake & Board objects
	*/
	constructor(board, snake){
		this.board = board;
		this.snake = snake;
		this.gameSpeed = 500;
		this.itervalID = setInterval(this.paintSnake.bind(this),this.gameSpeed);
		this.points = 0;
	}
	
	finishGame(){
		/*
		Stops the interval that is responsoble for invoking paintSnake method.
		*/
		clearInterval(this.itervalID);
	}
	
	paintSnake(){
		/*Moves & paints Snake position on a board.*/
		this.board.paintCleanBoard();
		let size = this.board.gridSize;
		this.snake.move();
		for (let i = 0; i < this.snake.body.length; i++){
			this.board.drawSnakeCell(this.snake.body[i].x * size,this.snake.body[i].y * size,size);
			this.board.drawFood(this.snake.food.x * size,this.snake.food.y * size,size);
		}
		if(this.isSnakeAlive() == false){
			alert("GAME OVER\nPoints: " + this.points);
			this.finishGame();
		}
		console.log(this.snake.body[0].x);
		this.addPoints();
		this.increseGameSpeed()
	}

	isSnakeAlive(){
		/*Check if Snake head is inside board and returns boolean true value if snake is still alive. 
			If snake is not alive then return false.
		*/
		if(this.snake.body[0].x < 0 || 
			this.snake.body[0].x >= this.board.size ||
			this.snake.body[0].y < 0 ||
			this.snake.body[0].y >= this.board.size){
			return false;
		}
		/*Check if Snake head has not hit any part of the Snake's body.*/
		for(let i = 1; i < this.snake.body.length; i++){
			if(this.snake.body[0].x == this.snake.body[i].x && this.snake.body[0].y == this.snake.body[i].y){
				return false;
			}
		}
		return true;
	}
	
	addPoints(){
		this.points = this.points  + 1;
		lblPoints.innerHTML = this.points;
		return this.points;
	}
	
	increseGameSpeed(){
		/*
			Increases gamespeed as the points grow but not beyond the speed step variable.
		*/
		let speedStep = 100;
		if(this.points % 10 == 0 && this.gameSpeed >=speedStep * 3){
			this.gameSpeed = this.gameSpeed  - speedStep;
			clearInterval(this.itervalID);
			this.itervalID = setInterval(this.paintSnake.bind(this),this.gameSpeed);
		}	
	}
}
"""
new_story.save()

#---------------------------------------------------------------------------------------
new_story = Story()
new_story.course = which_course
new_story.author = story_author
new_story.name = "Create a initializeSnakeObject() function"
new_story.content= """
Its goal is to prepare a Snake object that will be returned so that it can be used by other functions.
It should create an instance of a Snake object. 
Add a couple of body cells and return the reference to the snake object. 
"""
new_story.solution_test = """
"""
new_story.solution="""
function initializeSnakeObject(){
	/*Creates a snake objects and returns reference to that oject.*/
	var snake= new Snake(new Cell(5,5));
	snake.addBody(new Cell(6,5));
	snake.addBody(new Cell(7,5));
	snake.addBody(new Cell(8,5));
	snake.addBody(new Cell(9,5));
	snake.addBody(new Cell(10,5));
	return snake;
}
"""
new_story.perfect_solution = """
function initializeSnakeObject(){
	/*Creates a snake objects and returns reference to that oject.*/
	var snake= new Snake(new Cell(5,5));
	snake.addBody(new Cell(6,5));
	snake.addBody(new Cell(7,5));
	snake.addBody(new Cell(8,5));
	snake.addBody(new Cell(9,5));
	snake.addBody(new Cell(10,5));
	return snake;
}
"""
new_story.save()

#---------------------------------------------------------------------------------------
new_story = Story()
new_story.course = which_course
new_story.author = story_author
new_story.name = "Create steering mechanism"
new_story.content= """
Create a checkKey(e) function.
Inside this function check what key has been pressed.
Based on arrow keys you should change the snake directionsX and directionsY fields.
Inside this function assume that you have an access to global variable 'game' and 'snake' object inside the game object.
So you can change snake's direction by: 'game.snake.directionX = 1;'.
"""
new_story.solution_test = """
"""
new_story.solution="""
function checkKey(e) {
	e = e || window.event;
	if (e.keyCode == '38') {/*Key Up*/
		if(game.snake.directionX != 0){
			game.snake.directionX = 0;
			game.snake.directionY = -1;
		}
	}
	else if (e.keyCode == '40') {/*Key Down*/
		if(game.snake.directionX != 0){
			game.snake.directionX = 0;
			game.snake.directionY = 1;
		}
	}
	else if (e.keyCode == '37') {/*Key Left*/
		if(game.snake.directionY != 0){
			game.snake.directionX = -1;
			game.snake.directionY = 0;
		}
	}
	else if (e.keyCode == '39') {/*Kez Right*/
		if(game.snake.directionY != 0){
			game.snake.directionX = 1;
			game.snake.directionY = 0;
		}
	}
	else if (e.keyCode == '13') {/*enter key*/

	}
}
"""
new_story.perfect_solution = """
function checkKey(e) {
	e = e || window.event;
	if (e.keyCode == '38') {/*Key Up*/
		if(game.snake.directionX != 0){
			game.snake.directionX = 0;
			game.snake.directionY = -1;
		}
	}
	else if (e.keyCode == '40') {/*Key Down*/
		if(game.snake.directionX != 0){
			game.snake.directionX = 0;
			game.snake.directionY = 1;
		}
	}
	else if (e.keyCode == '37') {/*Key Left*/
		if(game.snake.directionY != 0){
			game.snake.directionX = -1;
			game.snake.directionY = 0;
		}
	}
	else if (e.keyCode == '39') {/*Kez Right*/
		if(game.snake.directionY != 0){
			game.snake.directionX = 1;
			game.snake.directionY = 0;
		}
	}
	else if (e.keyCode == '13') {/*enter key*/

	}
}
"""
new_story.save()

#---------------------------------------------------------------------------------------
new_story = Story()
new_story.course = which_course
new_story.author = story_author
new_story.name = "Create Main function"
new_story.content= """
Main function that starts the Snake game.
First declare 3 vars(snake,board, game).
Initialize snake with initializeSnakeObject() function.
Then create a new GameBoard object and assign it to board var.
Finally create a SnakeGame instance and assign it to game var.
At last make sure that document will trace keydown events and run checkKey() function created in previous steps.
"""
new_story.solution_test = """
"""
new_story.solution="""
function main(){
	snake = initializeSnakeObject();
	board = new GameBoard(15);
	game = new SnakeGame(board,snake);
	lblPoints = document.getElementById("lbl-points");
	document.onkeydown = checkKey;
}
"""
new_story.perfect_solution = """
function main(){
	snake = initializeSnakeObject();
	board = new GameBoard(15);
	game = new SnakeGame(board,snake);
	lblPoints = document.getElementById("lbl-points");
	document.onkeydown = checkKey;
}
"""
new_story.save()

#---------------------------------------------------------------------------------------
new_story = Story()
new_story.course = which_course
new_story.author = story_author
new_story.name = "Create welcome screeen"
new_story.content= """
Create createWelcomeScreen() function that will:
Create two buttons and add them to document body. 
For each add an onclick event.
Button1:
	id:btn-start
	text:Start game
	onclick : main() function.
Button2:
	id:btn-instruction
	text:Instruction
	onclick: Show alert with instructions for the user.
"""
new_story.solution_test = """
"""
new_story.solution="""
function createWelcomeScreen(){
	/*
		Create two buttons and add them to document body. 
		For each add an onclick event.
		Button1:
			id:btn-start
			text:Start game
			onclick : main() function.
		Button2:
			id:btn-instruction
			text:Instruction
			onclick: Show alert with instructions for the user.
	*/
	var btn = document.createElement("button");        // Create a <button> element
	btn.id = "btn-start";
	var t = document.createTextNode("Start game");       // Create a text node
	btn.appendChild(t);                                // Append the text to <button>
	document.body.appendChild(btn);        
	btn.onclick = function(){
			if(game != null){
				game.finishGame();
			}
			main();
		}
		
	let label = document.createElement("label");
	label.id = "lbl-points";
	label.className = "points-container";
	document.body.appendChild(label);
		
	btn = document.createElement("button");        // Create a <button> element
	btn.id = "btn-instruction";
	t = document.createTextNode("Instruction");       // Create a text node
	btn.appendChild(t);                                // Append the text to <button>
	document.body.appendChild(btn);             
	btn.onclick = function(){
		alert("This is a snake game. Control the snake, eat apples and try not to hit the edge of a map!");
	}	
	
}
"""
new_story.perfect_solution = """
function createWelcomeScreen(){
	/*
		Create two buttons and add them to document body. 
		For each add an onclick event.
		Button1:
			id:btn-start
			text:Start game
			onclick : main() function.
		Button2:
			id:btn-instruction
			text:Instruction
			onclick: Show alert with instructions for the user.
	*/
	var btn = document.createElement("button");        // Create a <button> element
	btn.id = "btn-start";
	var t = document.createTextNode("Start game");       // Create a text node
	btn.appendChild(t);                                // Append the text to <button>
	document.body.appendChild(btn);        
	btn.onclick = function(){
			if(game != null){
				game.finishGame();
			}
			main();
		}
		
	let label = document.createElement("label");
	label.id = "lbl-points";
	label.className = "points-container";
	document.body.appendChild(label);
		
	btn = document.createElement("button");        // Create a <button> element
	btn.id = "btn-instruction";
	t = document.createTextNode("Instruction");       // Create a text node
	btn.appendChild(t);                                // Append the text to <button>
	document.body.appendChild(btn);             
	btn.onclick = function(){
		alert("This is a snake game. Control the snake, eat apples and try not to hit the edge of a map!");
	}	
	
}
"""
new_story.save() #Save to DB


#---------Story template -----------------
#new_story = Story()
#new_story.author = story_author
#new_story.name = ""
#new_story.content= """
"""
new_story.solution_test = """
"""
new_story.perfect_solution = """
"""
new_story.save() #Save to DB
#-----------------------------