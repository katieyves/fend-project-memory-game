/*
 * Create a list that holds all of your cards
 */

let cards = [
	"gem",
	"paper-plane",
	"anchor",
	"leaf",
	"bicycle",
	"bomb",
	"bolt",
	"cube",
	"gem",
	"paper-plane",
	"anchor",
	"leaf",
	"bicycle",
	"bomb",
	"bolt",
	"cube"
];

let openedCards = [];
let matchedCards = [];
let moveCounter = 0;
let time = 0;
let stars = 3;

let gameStarted = false;

let deck = document.querySelector(".deck");
let restartButton = document.querySelector(".restart");
let banner = document.querySelector(".banner");
let playAgainButton = document.querySelector(".playAgain");
let intervalTimeCount;


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


// displayCards shuffles all the cards and display them on the deck

let displayCards = function() {
	cards = shuffle(cards);
	deck.innerHTML = "";

	for (card of cards) {
		let li = document.createElement("li");
		li.innerHTML = "<i class='fa fa-" + card +"'></i>";
		li.className += "card";
		deck.appendChild(li);
	}
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 // show() shows the clicked card

let show = function(e) {
	if (e.target.classList.contains("card")) {
		e.target.classList.add("open", "show");
		if(!openedCards.includes(e.target)) {
			openedCards.push(e.target);
		}
	}
}

// checkMatch() checks if the cards are matched

let checkMatch = function(e) {
	e.target.addEventListener("transitionend", function(e) {
		if(e.target === openedCards[1]) {
			if (openedCards.length === 2) {
				moveCounter += 1;
				showScores();
				if (openedCards[0].innerHTML == openedCards[1].innerHTML) {
					for (card of openedCards) {
						card.classList.add("match");
						matchedCards.push(card);
					}
					checkWin();
				}
				for (card of openedCards) {
					card.classList.remove("show", "open");
				}			
				openedCards = [];
			}
		}
	})
}



// checkWin() checks if a user wins

let checkWin = function() {
	if (matchedCards.length === 16) {
		gameOver();
	}
}

//gameOver() shows a banner with results and stops timer

let gameOver = function() {
	banner.style.display = "block";
	clearInterval(intervalTimeCount);
	let finalTime = document.querySelector(".time");
	let finalMoves = document.querySelector(".finalMoves");
	let finalStars = document.querySelector(".finalStars");
	let pluralStar = document.querySelector(".pluralStar");

	finalTime.textContent = "Your time: " + Math.floor(time/60) + " min " + time%60 + " sec";
	finalMoves.textContent = moveCounter;
	finalStars.textContent = stars;

	if (stars === 1) {
		pluralStar.style.display = "none";
	}
}

// play() starts a game if the game hasn't been started, show clicked card and check matching
// it's launched once a card is clicked

let play = function(e) {
	let opened = document.querySelectorAll(".open");
	if (opened.length >= 2) {
		return;
	}
	if (gameStarted === false) {
		gameStarted = true;
		intervalTimeCount = setInterval(timeCount, 1000)
	};
	show(e);
	checkMatch(e);
}


// restart() restarts a game and set all the results to zero and stars to 3

let restart = function() {
	openedCards = [];
	matchedCards = [];
	moveCounter = 0;
	time = 0;
	stars = 3;
	gameStarted = false;
	clearInterval(intervalTimeCount);
	displayCards();
	showScores();
}


// showScores() shows number of moves, star rating

let showScores = function() {
	let moves = document.querySelector(".moves");
	let moveOrMoves = document.getElementById("moveOrMoves");
	let starsIcons = document.querySelectorAll(".stars i");

	moves.textContent = moveCounter;
	if(moveCounter == 1) {
		moveOrMoves.textContent = "Move";
	} else {
		moveOrMoves.textContent = "Moves";
	}

	if (moveCounter <= 12) {
		stars = 3;
		for (star of starsIcons) {
			star.classList.remove("far");
			star.classList.add("fa");
		}
	} else if (moveCounter <= 16) {
		stars = 2;
		starsIcons[2].classList.remove("fa");
		starsIcons[2].classList.add("far");
	} else if (moveCounter <= 20) {
		stars = 1;
		starsIcons[1].classList.remove("fa");
		starsIcons[1].classList.add("far");
	} else {
		stars = 0;
		starsIcons[0].classList.remove("fa");
		starsIcons[0].classList.add("far");
	}

	if (gameStarted === false) {
		showTime();
	}
}


// timeCount() counts seconds if the game is started

let timeCount = function() {
	if (gameStarted === true) {
		time += 1;
		showTime();
	}
}

// showTime() shows time

let showTime = function() {
	let min = document.querySelector(".min");
	let sec = document.querySelector(".sec");
	min.textContent = Math.floor(time/60) + " min ";
	sec.textContent = time%60 + " sec";
}

// playAgain() restarts a game after a user won

let playAgain = function() {
	restart();
	banner.style.display = "none";
}

// shuffle cards for the first time

displayCards();

// events listeners for cards, restart button  and playAgain button

deck.addEventListener("click", play);
restartButton.addEventListener("click", restart);
playAgainButton.addEventListener("click", playAgain)