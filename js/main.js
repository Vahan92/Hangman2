let Hangman = function () {

    getId = (params) => {
        return document.getElementById(params);
    };
    let alphabetArray = "abcdefghijklmnopqrstuvwxyz".split("");
    let chars = '';
    let ammountOfGuesses = 6;
    let warning = 3;
    let matching = 0;
    let buttons = document.getElementsByClassName("myButtons");

    /**
     * Gets words from the txt file
     */
    function readFile() {
        $.get('words.txt', function (data) {
            arr = data.split(' ');
            console.log(arr)
        });
    }

    /**
     * Chooses random word for guessing and prints the *
     */
    hangman = () => {
        input = getId('txt');
        secretWord = chooseWord(arr);
        console.log(secretWord);
        letters = getAvailableLetters();
        asterics = printAsterics(secretWord);
        getId("loading").textContent = `Loading word list from file...`;
        getId("words").textContent = `55900 words loaded.`;
        getId("welcome").textContent = `Welcome to the game Hangman!`;
        getId("ammountOfLetters").textContent = `I am thinking of a word that is ${secretWord.length} letters long.`;
        getId("message").textContent = asterics;
        getId("ammountOfGuesses").textContent = `you have ${ammountOfGuesses} guesses left`;
        getId('letters').textContent = `Available letters: ${letters}`;
    }

    /**
     * Checks input value
     */
    checkingInputValue = () => {
        let letters = /^[A-Za-z]+$/;
        if (!input.value.match(letters)) {
            warning -= 1;
            getId("warning").textContent = `Oops! That is not a valid letter. You have ${warning} warnings left.`;
            gameOver();
        } else if (alphabetArray.includes(input.value.toLowerCase())) {
            submitGuessedWord();
        } else {
            warning -= 1;
            getId("warning").textContent = `Oops! You've already guessed that letter. You have ${warning} warnings left.`;
            gameOver();
        }
    }

    /**
     * Checks if the user typed charackter is in the word and prints it
     */
    submitGuessedWord = () => {
        let inpVal = input.value;
        let forPoints = [...new Set(secretWord)].length;
        letters = getAvailableLetters(inpVal);
        myWord = GetGuessedWord(secretWord, inpVal);
        getId('letters').textContent = `Available letters: ${letters}`;
        getId("message").textContent = myWord;
        let checkIfWon = isWordGuessed(secretWord, myWord);
        console.log('inpVal', inpVal);
        inpVal = '';
        gameOver(checkIfWon, forPoints);
    }

    /**
     * Prints the letters of alphabet which are left
     */
    getAvailableLetters = (lettersGuessed) => {
        if (lettersGuessed !== undefined) {
            alphabetArray.splice(alphabetArray.indexOf(lettersGuessed), 1).join('');
        }
        return alphabetArray;
    }

    /**
     * Prints the words that has same length and same guessed letters position in the 'guess word'
     */
    showPossibleMatches = () => {
        let arrOfSameLength = [];
        let result = [];
        for (let i = 0, arrLength = arr.length; i < arrLength; ++i) {
            if (myWord.length === arr[i].length)
                arrOfSameLength.push(arr[i]);
        }
        arrOfSameLength.forEach((element) => {
            if (matchWithGaps(myWord, element)) {
                result.push(element)
            }
        })
        getId("hints").textContent = `POSSIBLE WORDS ARE: ${result}`;
    }

    /**
     * finds the words that has same length and same guessed letters position in the 'guess word'
     */
    matchWithGaps = (myWord, other_word) => {
        let sameChars = 0;
        for (let i = 0, arrLength = other_word.length; i < arrLength; ++i) {
            if (myWord[i] !== "*" && myWord[i] === other_word[i]) {
                sameChars++;
            }
        }
        if (sameChars === matching) {
            return true;
        }
        return false;
    }

    /**
     * Chooses random word from the array
     */
    chooseWord = (x) => {
        let guessRandomWord = x[Math.floor(Math.random() * x.length - 1)];
        return guessRandomWord;
    }

    /**
     * Prints the asterics
     */
    printAsterics = (secretWord) => {
        enableButtons();
        let guessWordLength = secretWord.length;
        for (let i = 0; i < guessWordLength; ++i) {
            chars += "*";
        }
        return chars;
    }

    /**
     * Returns word with guessed letters
     */
    GetGuessedWord = (secretWord, lettersGuessed) => {
        let guessWordLength = secretWord.length, sum = 0, been = false;
        for (let i = 0; i < guessWordLength; ++i) {
            if (lettersGuessed === secretWord[i]) {
                chars = chars.substr(0, i) + lettersGuessed.toLowerCase() + chars.substr(i + 1);
                sum = 0;
                been = true;
                getId("guess").textContent = `Good Guess`;
                matching++;
            } else {
                sum = 1;
            }
        }
        if (been == false) {
            ammountOfGuesses -= sum;
            getId("guess").textContent = `Oops! That letter is not in my word.`;
            getId("ammountOfGuesses").textContent = `you have ${ammountOfGuesses} guesses left`;
        }
        input.value = '';
        return chars;
    }

    /**
     * Checks if player wol or lost the game;
     */
    gameOver = (checkIfWon, forPoints) => {
        if (checkIfWon) {
            alert(`Congratulatins, you won. your score is ${ammountOfGuesses * forPoints}`)
            location.reload();
        }
        if (ammountOfGuesses === 0 || warning < 0) {
            alert(`sorry, you lost. The word is - ${secretWord}`);
            location.reload();
        }
    }

    /**
     * Enables buttons
     */
    enableButtons = () => {
        for (let i = 0, arrLength = buttons.length; i < arrLength; ++i) {
            buttons[i].disabled = false;
        }
    }

    /**
     * Checks if word is guessed
     */    
    isWordGuessed = (secretWord, lettersGuessed) => {
        if (secretWord.localeCompare(lettersGuessed) === 0) {
            return true;
        }
        return false;
    }

    return {
        readFile: readFile,
        hangman: hangman,
        checkingInputValue: checkingInputValue,
        showPossibleMatches: showPossibleMatches
    }

}()

