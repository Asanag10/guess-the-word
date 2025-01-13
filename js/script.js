// DOM Element Selectors
const guessedLettersElement = document.querySelector(".guessed-letters");
const guessLetterButton = document.querySelector(".guess");
const letterInput = document.querySelector(".letter");
const wordInProgress = document.querySelector(".word-in-progress");
const remainingGuessesElement = document.querySelector(".remaining");
const remainingGuessesSpan = document.querySelector(".remaining span");
const message = document.querySelector(".message");
const playAgainButton = document.querySelector(".play-again");

// Game Variables
let word = "magnolia";
let guessedLetters = [];
let remainingGuesses = 8;

// Fetch a Random Word
const getWord = async () => {
  try {
    const response = await fetch(
      "https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt"
    );
    if (!response.ok) throw new Error("Failed to fetch word list.");
    const words = await response.text();
    const wordArray = words.split("\n");
    word = wordArray[Math.floor(Math.random() * wordArray.length)].trim();
    displayPlaceholder(word);
  } catch (error) {
    message.innerText =
      "An error occurred while fetching the word list. Please try again later.";
    console.error(error);
  }
};

// Display Placeholder Symbols
const displayPlaceholder = (word) => {
  const placeholder = word
    .split("")
    .map(() => "●")
    .join("");
  wordInProgress.textContent = placeholder;
};

// Validate Input
const validateInput = (input) => {
  const acceptedLetter = /^[a-zA-Z]$/;
  if (!input) {
    message.textContent = "Please enter a letter.";
  } else if (input.length > 1) {
    message.textContent = "Please enter a single letter.";
  } else if (!acceptedLetter.test(input)) {
    message.textContent = "Please enter a letter from A to Z.";
  } else {
    return input.toUpperCase();
  }
};

// Handle Letter Guess
const makeGuess = (guess) => {
  if (guessedLetters.includes(guess)) {
    message.textContent = "You already guessed that letter. Try again.";
  } else {
    guessedLetters.push(guess);
    updateGuessesRemaining(guess);
    displayGuessedLetters();
    updateWordInProgress();
  }
};

// Display Guessed Letters
const displayGuessedLetters = () => {
  guessedLettersElement.innerHTML = guessedLetters
    .map((letter) => `<li>${letter}</li>`)
    .join("");
};

// Update Word in Progress
const updateWordInProgress = () => {
  const revealedWord = word
    .toUpperCase()
    .split("")
    .map((letter) => (guessedLetters.includes(letter) ? letter : "●"))
    .join("");
  wordInProgress.textContent = revealedWord;
  checkIfWin();
};

// Update Remaining Guesses
const updateGuessesRemaining = (guess) => {
  if (!word.toUpperCase().includes(guess)) {
    message.textContent = `Sorry, the word has no ${guess}.`;
    remainingGuesses -= 1;
  } else {
    message.textContent = `Good guess! The word contains ${guess}.`;
  }

  remainingGuessesSpan.textContent = `${remainingGuesses} guess${
    remainingGuesses !== 1 ? "es" : ""
  }`;

  if (remainingGuesses === 0) {
    message.innerHTML = `Game over! The word was <span class="highlight">${word}</span>.`;
    toggleGameElements(true);
  }
};

// Check for Win
const checkIfWin = () => {
  if (word.toUpperCase() === wordInProgress.textContent) {
    message.classList.add("win");
    message.innerHTML = `<p class="highlight">You guessed the word! Congrats!</p>`;
    toggleGameElements(true);
  }
};

// Toggle Game Elements for End State
const toggleGameElements = (endGame) => {
  guessLetterButton.classList.toggle("hide", endGame);
  remainingGuessesElement.classList.toggle("hide", endGame);
  guessedLettersElement.classList.toggle("hide", endGame);
  playAgainButton.classList.toggle("hide", !endGame);
};

// Reset Game
const resetGame = () => {
  guessedLetters = [];
  remainingGuesses = 8;
  remainingGuessesSpan.textContent = `${remainingGuesses} guesses`;
  guessedLettersElement.innerHTML = "";
  message.textContent = "";
  message.classList.remove("win");
  getWord();
  toggleGameElements(false);
};

// Event Listeners
guessLetterButton.addEventListener("click", (e) => {
  e.preventDefault();
  message.textContent = "";
  const guess = validateInput(letterInput.value.trim());
  if (guess) makeGuess(guess);
  letterInput.value = "";
});

playAgainButton.addEventListener("click", resetGame);

// Initialize Game
getWord();
