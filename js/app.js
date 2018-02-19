// Game variables
var minutes, seconds, timercycle;
var countMoves = 0, countStars = 3;
var gameDifficulty = 10;
var cards = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt",
  "fa-cube", "fa-anchor", "fa-leaf", "fa-bicycle",
  "fa-diamond", "fa-bomb", "fa-leaf", "fa-bomb",
  "fa-bolt", "fa-bicycle", "fa-paper-plane-o", "fa-cube"
]
var countOpenCards = 0, storeOpenCards = [], countMatches = 0;

// Udacity: Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Hide all cards by flipping them backward
function hideCards() {
  $("#deck").children().attr('class', 'card');
};

// Show winning panel and stop timer
function showWinPanel() {
  clearInterval(timercycle);
  $("#winPanel").css("display", "block");
};

// Hide winning panel
function hideWinPanel() {
  $("#winPanel").css("display", "none");
};

// Increment timer every second and update the HTML display to always show two digits 00:00
var timerUpdate = function() {
  seconds++;
  if (seconds === 60) {
    minutes++;
    seconds = 0;
  }
  $(".timer").text(("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2));
};

// Reset the timer to 0:00
function timerReset() {
  clearInterval(timercycle);
  minutes = seconds = 0;
  $(".timer").text("00:00");
  timercycle = setInterval(timerUpdate, 1000);
};

// Update move counts
var updateMoves = function() {
  countMoves++;
  $(".moves").text(countMoves);
};

// Reset move counts and card matches
var resetMoves = function() {
  countMoves = countMatches = 0;
  $(".moves").text(countMoves);
};

// Reset card counts
var resetCardCounts = function() {
  countOpenCards = 0;
  storeOpenCards = [];
};

// Update shown stars whenever moves > difficulty
var updateStars = function() {
  if (countMoves % gameDifficulty == 0 && countStars > 1) {
    countStars--;
    $(".remStars").text(countStars);
    document.getElementById("stars").children[countStars].style.visibility = "hidden";
  }
};

// Reset stars to their initial count
var resetStars = function() {
  countStars = 3;
  for (i = 0; i < countStars; i++) {
    document.getElementById("stars").children[i].style.visibility = "visible";

  }
};

// Shuffle the cards
var shuffleCards = function() {
  cards = shuffle(cards);
  var cardIndex = 0;
  $.each($(".card i"), function() {
    $(this).attr("class", "fa " + cards[cardIndex]);
    cardIndex++;
  });
};

// Reset game to initial state
var restartGame = function() {
  hideWinPanel();
  hideCards();
  resetMoves();
  resetStars();
  resetCardCounts();
  shuffleCards();
  timerReset();
};

// Check if cards are matching
var checkMatch = function() {
  // Two cards are matching, set to match
  if (storeOpenCards[0].children().attr("class") === storeOpenCards[1].children().attr("class")) {
    countMatches++;
    storeOpenCards[0].attr('class', 'card match');
    storeOpenCards[1].attr('class', 'card match');
    // Win the game?
    if (countMatches == 8) {
      showWinPanel();
    }
  }
  //Two cards are not maching, flip back
  else {
    // Not Maching  set to close
    storeOpenCards[0].attr('class', 'card');
    storeOpenCards[1].attr('class', 'card');
  }
  resetCardCounts();
}

// Action taken when closed cards are clicked
var cardsClicked = function() {
  if ($(this).attr('class') == "card" && countOpenCards < 2) {
    //Open the card, store it, and increment number of opened cards
    $(this).attr('class', 'card open show');
    storeOpenCards[countOpenCards] = $(this);
    countOpenCards++;
    // Check if the two open cards are matching and update stars-moves
    if (countOpenCards == 2) {
      updateMoves();
      updateStars();
      setTimeout(checkMatch, 300);

    }
  }
};

// One of the cards clicked
$(".card").click(cardsClicked);
// Restart game button clicked
$(".restart").click(restartGame);
// Play again button on winning panel clicked
$(".playAgain").click(restartGame);

// Intitial page state
$(restartGame);
