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
var mismatches = 0; // keep track of missmatched cards to decrease rating
var seconds = null; // if null, timer hasn't been started
var timer = null; // use to save the interval id

/**
 * Set Game labels
 */
var minutesLabel = document.getElementById('minutes');
var secondsLabel = document.getElementById('seconds');
var movesLabel = document.getElementById('moves');
var ratingLabel = document.getElementById('rating');

/*
 * Display the cards on the page
*/
var deck = document.getElementById('deck');
cards.forEach(card => {
  deck.appendChild(createCardHTML(card));
});



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
  if (seconds === null) startTimer();

  // if any other card is already being displayed, get it.
  const secondCard = document.querySelector('li.card.open.show');

  // show the current card
  this.classList.add('show', 'open');

  // if a second card is being shown, check if they match
  if (secondCard) {
    // prevent a third card or more from being shown.
    // Restore clicks after hiding cards, or finding a match
    preventClicks();

    // regardless of a match, increase move
    addMove();

    const firstSymbol = secondCard.firstChild.classList.value;
    const secondSymbol = this.firstChild.classList.value;
    if (firstSymbol === secondSymbol) {
      console.log("match!");
      this.classList.remove('show', 'open');
      this.classList.add('match');
      this.onclick = null;

      secondCard.classList.remove('show', 'open')
      secondCard.classList.add('match');
      secondCard.onclick = null;
      restoreClicks();
    } else {
      mismatches++;
      hideCards();
      setRating();
    }
  } else {
    // remove onclick function of currently shown card
    this.onclick = null;
  }
}

function hideCards() {
  setTimeout(function() {
    const cards = document.querySelectorAll('.open.show');
    cards.forEach(card => {
      card.classList.remove('show', 'open');
    });
    restoreClicks();
  }, 1000);
}

function preventClicks() {
  // get all hidden cards only
  const cards = document.querySelectorAll('.card:not(.match)');
  cards.forEach(card => {
    // prevent clicks
    card.onclick = null;
  });
}

function restoreClicks() {
  const cards = document.querySelectorAll('.card:not(.match)');
  cards.forEach(card => {
    card.onclick = handleClick;
  });
}

/**
 * Restart Button
 */

const restart = document.getElementById('restart');
restart.onclick = resetGame;

function resetGame() {
  resetTimer();
  resetMoves();
  cards = shuffle(cards);
  deck.innerHTML = '';
  cards.forEach(card => {
    deck.appendChild(createCardHTML(card));
  });
}

function startTimer() {
  seconds = 0;

  setTime = function() {
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

function addMove() {
  moves++;
  movesLabel.innerText = moves;
}

function resetMoves() {
  moves = 0;
  movesLabel.innerHTML = moves;
}

function setRating() {
  // make sure rating doesn't go below 1 star
  if (mismatches > 7) return;

  // degrease rating every 3 mismatches
  if ( (mismatches % 3) === 0 ) {
    console.log(mismatches);
    ratingLabel.removeChild(ratingLabel.lastElementChild);
  }
}

function playerWins() {

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
