/*Global variables*/
var origBoard;
const huPlayer = '0';
const aiPlayer = 'X';
var waiting = false;
var coordinateX = 0;
var coordinateY = 0;
/*This is the winning combinations for tic-tac-toe, 
each number in the array represents a position in the tic-tac-toe. 
The number 0 represents the first position and the first number represents the second position*/
/*
	      0 | 1 | 2	
	     ---|---|---
		  3 | 4 | 5
		 ---|---|---
		  6 | 7 | 8

*/
const winCombos = [
	[0,1,2],
	[3,4,5],
	[6,7,8],
	[0,3,6],
	[1,4,7],
	[2,5,8],
	[0,4,8],
	[6,4,2]
]

const cells = $('#ticTacTeo > tbody > tr > td');

function startGame(){
	/*Dont forget to create an endgame screen*/
     $('.pop-up-game').addClass("pop-up-game-hide");
     $('.svg-replay').removeClass('svg-replay-animation');
     $('.svg-replay').removeClass('svg-replay-animation');
     $('#ticTacTeo > tbody > tr > td > span').removeClass("fade-up-tic-tac-teo");
	//------------------------------------------
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {		
		cells[i].childNodes[0].innerText = '';
		cells[i].style.removeProperty('background-color');		
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square){	
if(waiting) return;
    
    // Use .target.id to get the ID of the clicked HTML element
    let cellId = square.target.id; 
    
    if (typeof origBoard[cellId] == 'number') {
        turn(cellId, huPlayer);
        if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
    }
}

function turn(squareId, player) {	

	if(player === aiPlayer)
	{
		var offset = $("#"+squareId+" > span").offset();
		waiting = true;				
		$("body,.shadowTicTacTeo, #ticTacTeo > tbody > tr > td > span").addClass("cursorNone");
		$(".mouseCursor").css({"left": coordinateX+"px", "top": coordinateY+"px"});	
		$(".mouseCursor").delay(2000).removeClass('mouseCursor-hidden');	
		$(".mouseCursor").css({"left": offset.left+"px", "top": offset.top+"px"});
		setTimeout(function(){ 
			
			
			$("#"+squareId+" > span").text(player).addClass('fade-up-tic-tac-teo');				
			origBoard[squareId] = player;		
		    let gameWon = checkWin(origBoard, player)
		    if (gameWon) gameOver(gameWon)	
		    //reset global variable
			waiting = false;				
			$("body, .shadowTicTacTeo, #ticTacTeo > tbody > tr > td > span").removeClass("cursorNone");
			$(".mouseCursor").addClass('mouseCursor-hidden');	
		}, 2000);
	}
	else
	{

		$("#"+squareId+" > span").text(player).addClass('fade-up-tic-tac-teo');	
		origBoard[squareId] = player;		
		let gameWon = checkWin(origBoard, player)
		if (gameWon) gameOver(gameWon)					
	}	       


}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function checkWin(board, player) {	
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {		
	for (let index of winCombos[gameWon.index]) {
		//$("#"+index).addClass("winning-tic-tac-teo");		
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

function declareWinner(who) {	
   $('.pop-up-game').removeClass('pop-up-game-hide');
	$('.svg-replay').addClass('svg-replay-animation');
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
	
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {			
			cells[i].removeEventListener('click', turnClick, false);
		}		
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}


$(document).ready(function(){
	
	$(".tic-tac-teo-second-container").click(function(){
		$(this).addClass("remove-tic-tac-teo-second-container");
		$(this).removeClass("tic-tac-teo-animation");
		startGame();
	});

	$(".shadowTicTacTeo").mousemove(function(event){  		
	  //$(".mouseCursor").css({"left": event.pageX+"px", "top": event.pageY+"px"});
	});

});

$(".shadowTicTacTeo").mousemove(function(event){  	
	coordinateX = event.pageX;
	coordinateY = event.pageY;
	//$(".mouseCursor").css({"left": event.pageX+"px", "top": event.pageY+"px"});
});

