const soundFolder = 'zvuky/';
const totalLevels = 5;
const correctGuessesToWin = 3;

let currentLevel = 1;
let correctGuesses = 0;
let sound1, sound2;
let index1, index2; // Definujeme index1 a index2 na úrovni, kde budú dostupné v celej funkcii

document.getElementById('startButton').addEventListener('click', startGame);

function startGame() {
    if (currentLevel <= totalLevels) {
        playRandomSounds();
        displayMessage('PREHRAVA SA ZVUK');
        createButtons();
    } else {
        endGame();
    }
}

function playRandomSounds() {
    const allSounds = getSoundList();
    [index1, index2] = getRandomIndexes(allSounds.length);

    sound1 = new Howl({ src: [`${soundFolder}${allSounds[index1]}`] });
    sound2 = new Howl({ src: [`${soundFolder}${allSounds[index2]}`] });

    console.log('Prehrávajú sa zvuky pre kolo: ' + currentLevel);
    sound1.play();
    sound1.on('end', () => {
        setTimeout(() => {
            sound2.play();
        }, 500); 
    });
}

function getSoundList() {
    // Načítanie všetkých súborov zo zvukového adresára
    const allSounds = ['bábka.wav', 'baňa.wav', 'banán.wav']; 
    return allSounds;
}

function getRandomIndexes(length) {
    const index1 = Math.floor(Math.random() * length);
    let index2 = Math.floor(Math.random() * length);

    return [index1, index2];
}

function displayMessage(message) {
    console.log(message);

    const dialogBox = document.querySelector('.dialog-box');
    dialogBox.innerHTML = `<h1>Sú slová rovnaké?</h1><p>${message}</p><div id="buttonsContainer"></div><span class="close">&times;</span>`;
}

function createButtons() {
    // Získa alebo vytvorí kontajner pre tlačidlá
    let buttonsContainer = document.getElementById('buttonsContainer');
    if (!buttonsContainer) {
        buttonsContainer = document.createElement('div');
        buttonsContainer.id = 'buttonsContainer';
    } else {
        // Ak kontajner už existuje, odstráň všetky deti
        buttonsContainer.innerHTML = '';
    }

// Vytvára tlačidlá s obrázkami
const sameButton = document.createElement('img');
sameButton.src = 'images/rovnake.png';
sameButton.alt = 'Rovnaké';
sameButton.addEventListener('click', () => evaluateGuess(true));

const differentButton = document.createElement('img');
differentButton.src = 'images/rozdielne.png';
differentButton.alt = 'Rozdielne';
differentButton.addEventListener('click', () => evaluateGuess(false));

// Pridáva tlačidlá do kontajnera
buttonsContainer.appendChild(sameButton);
buttonsContainer.appendChild(differentButton);

// Pridáva alebo aktualizuje kontajner v tele dokumentu
if (!document.getElementById('buttonsContainer')) {
    document.body.appendChild(buttonsContainer);
}
}

function evaluateGuess(isSame) {
    sound1.stop();
    sound2.stop();

    if (isSame) {
        console.log('Hráč hádal, že zvuky sú rovnaké.');
        if (index1 === index2) {
            correctGuesses++;
        }
    } else {
        console.log('Hráč hádal, že zvuky sú rozdielne.');
        if (index1 !== index2) {
            correctGuesses++;
        }
    }

    currentLevel++;

    if (correctGuesses >= correctGuessesToWin) {
        displayMessage
        endGame(true);
    } else {
        startGame();
    }
}

function endGame(hasWon = false) {
    const message = hasWon ? 'Vyhral si!' : 'Koniec hry, prehral si.';
    currentLevel = 1;
    correctGuesses = 0;
    buttonsContainer.innerHTML = '';
    displayMessage(message);
    setTimeout(() => {
        // Pridajte nasledujúci kód na zatvorenie dialogového okna
        const infoDialog = document.getElementById('info-dialog');
        infoDialog.style.display = 'none';
    }, 1000);
    
}
