/*
 * Create a list that holds all of your cards
 */
var cards = [
  'fa-diamond',
  'fa-paper-plane-o',
  'fa-anchor',
  'fa-bolt',
  'fa-cube',
  'fa-leaf',
  'fa-bicycle',
  'fa-bomb'
];
cards.push(...cards);
cards = shuffle(cards);

/**
 * Set Game variables
 */
var moves = 0;
var rating = 3;
var mismatches = 0; // keep track of missmatched cards to decrease rating
var matches = 0; // keep track of matches, so when 8 are done, player wins.
var seconds = null; // if null, timer hasn't been started
var timer = null; // use to save the interval id

/**
 * Set Game UI elements
 */
var restart = document.getElementById('restart');
var minutesLabel = document.getElementById('minutes');
var secondsLabel = document.getElementById('seconds');
var movesLabel = document.getElementById('moves');
var ratingLabel = document.getElementById('rating');
var modal = document.getElementById('modal');
var modalMessage = document.querySelector('#modal .message');
var totalTime = document.getElementById('total-time');
var finalRating = document.getElementById('final-rating');
var playAgainBtn = document.getElementById('play-again');

/**
 * Display deck of cards on the page, adding onclick listeners to each one.
*/
var deck = document.getElementById('deck');
cards.forEach(card => {
  deck.appendChild(createCardHTML(card));
});

/**
 * add onclick listeners to remaining UI elements
 */
playAgainBtn.onclick = newGame;
modal.onclick = hideModal;
modalMessage.onclick = function(e) { e.stopPropagation(); };
restart.onclick = resetGame;

function createCardHTML(symbol) {
  const li = document.createElement('li');
  li.className = 'card';
  li.onclick = handleClick;

  const i = document.createElement('i');
  i.className = 'fa';
  i.classList.add(symbol);
  li.appendChild(i);

  return li;
 }



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

function handleClick() {
  // start the timer if the player started the game (by clicking the first card)
  if (seconds === null) startTimer();

  // if any other card is already being displayed, get it. 
  // (this will be null, if no other cards are being displayed)
  const secondCard = document.querySelector('li.card.open.show');

  // show the current card, and remove onclick listener
  this.classList.add('show', 'open');
  this.onclick = null;

  // if a second card is being shown, check if it matches the current one (null value means false)
  if (secondCard) {
    // prevent further cards from being shown, when clicked
    // (only two cards are shown at a time)
    preventFurtherClicks();

    // regardless of a match, increase move
    addMove();

    // get the symbol value of both cards
    const firstSymbol = secondCard.firstChild.classList.value;
    const secondSymbol = this.firstChild.classList.value;

    // if cards match
    if (firstSymbol === secondSymbol) {
      // increase matched number
      matches++;

      // toggle card classes as needed
      this.classList.remove('show', 'open');
      this.classList.add('match');
      secondCard.classList.remove('show', 'open');
      secondCard.classList.add('match');

      // if all 8 possible matches have been found, player wins.
      if (matches === 8 ) {
        playerWins();
        return;
      }

      // restore clicks on hidden cards.
      restoreClicks();

    // if cards didn't match
    } else {
      // increase number of mismatches, which alter rating
      mismatches++;

      // hide both open cards
      hideCards();

      // alter rating after a mismatch
      setRating();
    }
  }
}

/**
 * Hide pair of mismatched cards after 1 second.
 */
function hideCards() {
  setTimeout(function() {
    const cards = document.querySelectorAll('.open.show');
    cards.forEach(card => {
      card.classList.remove('show', 'open');
    });
    restoreClicks();
  }, 1000);
}

/**
 * Remove onclick listener on all hidden cards
 */
function preventFurtherClicks() {
  const cards = document.querySelectorAll('.card:not(.match)');
  cards.forEach(card => {
    card.onclick = null;
  });
}

/**
 * Restore onclick listeners on all hidden cards
 */
function restoreClicks() {
  const cards = document.querySelectorAll('.card:not(.match)');
  cards.forEach(card => {
    card.onclick = handleClick;
  });
}

function resetGame() {
  resetTimer();
  resetMoves();
  resetRating();
  matches = 0;
  mismatches = 0;
  cards = shuffle(cards);
  deck.innerHTML = '';
  cards.forEach(card => {
    deck.appendChild(createCardHTML(card));
  });
}

function startTimer() {
  seconds = 0;

  const setTime = function() {
    ++seconds;
    if (seconds > 3600) {
      // TODO: player looses if 1 hour has passed

      // stop timer
      stopTimer();
      return;
    }
    secondsLabel.innerText = (seconds % 60).toString().padStart(2, "0");
    minutesLabel.innerText = parseInt(seconds / 60).toString().padStart(2, "0");
  };

  timer = setInterval(setTime, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function resetTimer() {
  secondsLabel.innerText = "00";
  minutesLabel.innerText = "00";
  clearInterval(timer);
  seconds = null;
  timer = null;
  startTimer;
}

/**
 * Increase number of moves. Should be used every time a pair of cards is shown for a possible match.
 */
function addMove() {
  moves++;
  movesLabel.innerText = moves;
}

function resetMoves() {
  moves = 0;
  movesLabel.innerHTML = moves;
}

/**
 * Set rating based on current mismatches. Rating won't go below one star.
 */
function setRating() {
  // make sure rating doesn't go below 1 star
  if (mismatches > 7) return;

  // decrease rating every 3 mismatches
  if ( (mismatches % 3) === 0 ) {
    rating--;
    ratingLabel.removeChild(ratingLabel.lastElementChild);
  }
}

/**
 * Reset rating to 3 stars, and clear mismatches.
 */
function resetRating() {
  rating = 3;
  ratingLabel.innerHTML = "";
  for (let i = 3; i > 0; i--) {
    const i = document.createElement('i');
    i.classList.add('fa', 'fa-star');
    ratingLabel.appendChild(i);
  }
}

function playerWins() {
  // stop timer
  stopTimer();

  // show modal
  modal.classList.remove('hidden');

  // show final time
  totalTime.innerText = `${minutesLabel.innerText}:${secondsLabel.innerText}`;

  // show final rating as stars
  finalRating.innerHTML = "";
  for (let i = rating; i > 0; i--) {
    const i = document.createElement('i');
    i.classList.add('fa', 'fa-star');
    finalRating.appendChild(i);
  }
}

function newGame() {
  resetGame();
  modal.classList.add('hidden');
}

function hideModal() {
  modal.classList.add('hidden');
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
