// Získanie canvasu a kontextu
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const blockSize = 50; // Veľkosť jednej blokovej kocky

const playerSize = blockSize; // Veľkosť hráča
const diamondSize = blockSize; // Veľkosť diamantu
const GoldSize = blockSize; // Veľkosť diamantu
const claySize = blockSize; // Veľkosť hliny

const mapWidth = 16; // Počet blokov na šírku
const mapHeight = 10; // Počet blokov na výšku

let playerX = blockSize; // Začiatočná pozícia hráča na osi X
let playerY = blockSize; // Začiatočná pozícia hráča na osi Y

const diamonds = [];
const golds = [];
const clay = [];
let PocetGenDiamant = 4;
let PocetGenGolds = 15;

let diamondsDestroyed = 0; // Počet zničených diamantov
let goldsDestroyed = 0; // Počet zničených goldov
let isDestroying = false; // Premenná určujúca, či hráč zničí blok
let playerRotation = 0; // Úvodná rotácia hráča
let spaceBarPocitadlo1 = 0; // Počet stlačení medzerníka
let diamondsCollected = 0; // Počet zozbieraných diamantov
let goldsCollected = 0; // Počet zozbieraných diamantov
let dragonSleeping = true;

playerX = 100;
playerY = 200;
const dragonImg = new Image();
dragonImg.src = 'images/dragon.png';
const dragonsleepImg = new Image();
dragonsleepImg.src = 'images/sleepdragon.png';
const goldImg = new Image();
goldImg.src = 'images/gold.png';
const diamondImg = new Image();
diamondImg.src = 'images/diamond.png';
const clayImg = new Image();
clayImg.src = 'images/stone.png';
const playerImg = new Image();
playerImg.src = 'images/hrac.png';
const playerImgVl = new Image();
playerImgVl.src = 'images/hrac-otoceny-vlavo.png';
const playerImgVp = new Image();
playerImgVp.src = 'images/hrac-otoceny-vpravo.png';
const playerImgchrbat = new Image();
playerImgchrbat.src = 'images/hrac.png';
const hracKopaVpravoImg = new Image();
hracKopaVpravoImg.src = 'images/hrac-kope-vpravo.png';
const hracKopaVlavoImg = new Image();
hracKopaVlavoImg.src = 'images/hrac-kope-vlavo.png';
let playerDirection = 'front';
let kope = false;

//Zobrazenie stats
function displayStats() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Stlačenia medzerníka: ${spaceBarPocitadlo1}`, 10, 30);
    ctx.fillText(`Počet diamantov: ${diamondsCollected}`, 10, 60);
    ctx.fillText(`Počet goldov: ${goldsCollected}`, 10, 90);
}

//Generovanie diamantov
function generateDiamonds() {
  const generatedPositions = []; // Pole na uchovanie už vygenerovaných pozícií
  while (diamonds.length != PocetGenDiamant) {
    const diamondX = Math.floor(Math.random() * mapWidth) * blockSize;
    const diamondY = (Math.floor(Math.random() * mapHeight) + 6) * blockSize; // Generovanie o 10 nižšie
    const newPosition = { x: diamondX, y: diamondY };
    // Zkontrolujeme, či je pozícia už obsadená diamantom
    const positionExists = generatedPositions.some (pos => pos.x === diamondX && pos.y === diamondY); 
    // Ak pozícia nie je obsadená, pridáme diamant
    if (!positionExists) {
      diamonds.push(newPosition);
      generatedPositions.push(newPosition);
    }
  }
  initializeDiamonds(PocetGenDiamant);
} 
//Generovanie zlata
function generateGolds() {
  const generatedPositions = []; // Pole na uchovanie už vygenerovaných pozícií

  while (golds.length !== PocetGenGolds) {
    const goldX = Math.floor(Math.random() * mapWidth) * blockSize;
    const goldY = (Math.floor(Math.random() * mapHeight) + 6) * blockSize; // Generovanie o 10 nižšie
    const newPosition = { x: goldX, y: goldY };

    // Zkontrolujeme, či je pozícia už obsadená zlatom alebo diamantom
    const positionExists = generatedPositions.some(pos => pos.x === goldX && pos.y === goldY) ||
                           diamonds.some(diamond => diamond.x === goldX && diamond.y === goldY);

    // Ak pozícia nie je obsadená, pridáme zlato
    if (!positionExists) {
      golds.push(newPosition);
      generatedPositions.push(newPosition);
    }
  }
  initializeGolds(PocetGenGolds);
}

function generateClay() {
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        let isPositionEmpty = true;
  
        // Zkontrolujeme, či je pozícia už obsadená diamantom
        diamonds.forEach(diamond => {
          if (diamond.x === x * blockSize && diamond.y === (y + 6) * blockSize) { // Generovanie o 10 nižšie
            isPositionEmpty = false;
          }
        });
        golds.forEach(gold => {
          if (gold.x === x * blockSize && gold.y === (y + 6) * blockSize) { // Generovanie o 10 nižšie
            isPositionEmpty = false;
          }
        });
  
        // Ak je pozícia voľná, pridáme hlinu
        if (isPositionEmpty) {
          clay.push({ x: x * blockSize, y: (y + 6) * blockSize }); // Generovanie o 10 nižšie
        }
      }
    }
}
function drawPlayer() {
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    //ctx.fillStyle = 'yellow';
    let image;
    if (playerDirection == 'front' ){
      image = playerImg;
      if(kope == true){
        image = hracKopaVpravoImg;
      }
    }else if (playerDirection == 'vpravo' ){
      image = playerImgVp;
      if(kope == true){
        image = hracKopaVpravoImg;
      }
    } else if (playerDirection == 'vlavo' ){
      image = playerImgVl;
      if(kope == true){
        image = hracKopaVlavoImg;
      }
    }else{
      image = playerImg;
  }
    ctx.drawImage(image, playerX, playerY, playerSize, playerSize);
    if(kope == true){
      image = hracKopaVpravoImg;
    }
}    
function drawDiamonds() {
    //ctx.strokeStyle = 'black';
    diamonds.forEach(diamond => {
      if (!diamond.destroyed) {
        ctx.drawImage(diamondImg, diamond.x, diamond.y, diamondSize, diamondSize);
      }
    });
}
function drawGolds() {
  //ctx.strokeStyle = 'black';
  golds.forEach(gold => {
    if (!gold.destroyed) {
      ctx.drawImage(goldImg, gold.x, gold.y, GoldSize, GoldSize);
    }
  });
}
function drawClay() {
    //ctx.fillStyle = 'brown';
    //ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    clay.forEach(clayObj => {
      ctx.drawImage(clayImg, clayObj.x, clayObj.y, claySize, claySize);
      //ctx.strokeRect(clayObj.x, clayObj.y, claySize, claySize);
    });
}
// Funkcia pre kreslenie draka
function drawDragon() {
  if (dragonSleeping) {
    ctx.drawImage(dragonsleepImg, 350, 0, 400, 200); // Zobrazenie obrázka draka v pravej hornej časti
  } 
  if (!dragonSleeping) {
    ctx.drawImage(dragonImg, 350, 0, 400, 200);
  }
}
// Funkcia na kontrolu prebúdzania draka
function checkDragon() {
  if (spaceBarPocitadlo1 === 19 && dragonSleeping) {
    dragonSleeping = false;
    drawDragon();
  } 
  if (spaceBarPocitadlo1 === 19 && !dragonSleeping) {
    const winConfirm = confirm('Drak sa zobudil');
    spaceBarPocitadlo1 = 0;
    dragonSleeping = true;
  }
}
//Ovládanie WASD
window.addEventListener('keydown', (e) => {
    const newPlayerX = playerX;
    const newPlayerY = playerY;
    switch (e.key) {
      case 'w':
        playerY -= blockSize;
        playerRotation = 0; // Rotácia smeru hore
        playerDirection = 'front';
        break;
      case 'a':
        playerX -= blockSize;
        playerRotation = 270; // Rotácia smeru doľava
        playerDirection = 'vlavo';
        break;
      case 's':
        playerY += blockSize;
        playerRotation = 180; // Rotácia smeru dole
        playerDirection = 'front';
        break;
      case 'd':
        playerX += blockSize;
        playerRotation = 90; // Rotácia smeru doprava
        playerDirection = 'vpravo';
        break;
    }

    // Kontrola kolízií s hlinou
    clay.forEach((clayBlock, clayIndex) => {
        const blockX = clayBlock.x;
        const blockY = clayBlock.y;
        if (playerX === blockX && playerY === blockY) {
            if (isDestroying) {
                clay.splice(clayIndex, 1);
                isDestroying = false;
            } else {
                // Nastavenie hráča späť na pôvodné miesto, keď sa snaží prejsť cez blok
                playerX = newPlayerX;
                playerY = newPlayerY;
            }
        }
    });

    // Kontrola kolízií s diamantom
    diamonds.forEach((diamond, diamondIndex) => {
        const blockX = diamond.x;
        const blockY = diamond.y;
        if (playerX === blockX && playerY === blockY && !diamond.destroyed) {
            if (isDestroying) {
                diamond.destroyed = true;
                isDestroying = false;
            } else {
                // Nastavenie hráča späť na pôvodné miesto, keď sa snaží prejsť cez diamant
                playerX = newPlayerX;
                playerY = newPlayerY;
            }
        }
    });

    // Kontrola kolízií s goldom
    golds.forEach((gold, goldIndex) => {
      const blockX = gold.x;
      const blockY = gold.y;
      if (playerX === blockX && playerY === blockY && !gold.destroyed) {
          if (isDestroying) {
              gold.destroyed = true;
              isDestroying = false;
          } else {
              // Nastavenie hráča späť na pôvodné miesto, keď sa snaží prejsť cez diamant
              playerX = newPlayerX;
              playerY = newPlayerY;
          }
      }
  });

});
// Funkcia pre hlavnú hernú slučku
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawClay();
    /*drawDragon();*/
    drawDiamonds();
    drawGolds();
    displayStats(); // Zobraz štatistiky
    requestAnimationFrame(gameLoop);
}
let spaceBarPressed = 0; // Počet stlačení medzerníka
function destroyBlock() {
    const playerBlockX = Math.floor(playerX / blockSize);
    const playerBlockY = Math.floor(playerY / blockSize);

    let targetBlockX = playerBlockX;
    let targetBlockY = playerBlockY;

    // Zistí smer hráča a určí cieľový blok podľa toho
    switch (playerRotation) {
        case 0:
            targetBlockY--;
            break;
        case 90:
            targetBlockX++;
            break;
        case 180:
            targetBlockY++;
            break;
        case 270:
            targetBlockX--;
            break;
    }

    clay.forEach((clayBlock, clayIndex) => {
        const blockX = clayBlock.x / blockSize;
        const blockY = clayBlock.y / blockSize;

        // Kontrola zničenia bloku, ktorý je pred hráčom v smeru, ktorým je hráč otáčaný
        if (blockX === targetBlockX && blockY === targetBlockY) {
            clay.splice(clayIndex, 1);
        }
    });
  
    diamonds.forEach((diamond, diamondIndex) => {
      const blockX = diamond.x / blockSize;
      const blockY = diamond.y / blockSize;
  
      if (blockX === targetBlockX && blockY === targetBlockY && !diamond.destroyed) {
        spaceBarPressed++;
        if (spaceBarPressed === 3) {
          openCvicenie();
          diamond.destroyed = true;
          diamondsCollected++;
          updateDiamondCount();
          updateDiamondsCollected(diamondsCollected);
          checkWinCondition();
          spaceBarPressed = 0; // Reset počtu stlačení pre ďalšie diamanty
        }
        
      }
    });

    golds.forEach((gold, goldIndex) => {
      const blockX = gold.x / blockSize;
      const blockY = gold.y / blockSize;
  
      if (blockX === targetBlockX && blockY === targetBlockY && !gold.destroyed) {
        spaceBarPressed++;
        if (spaceBarPressed === 2) {
          gold.destroyed = true;
          goldsCollected++;
          updateGoldCount();
          updategoldsCollected(goldsCollected);
          checkWinCondition();
          spaceBarPressed = 0; // Reset počtu stlačení pre ďalšie diamanty
        }
        
      }
    });
}
function animateDigging() {
    kope = true;
    drawPlayer();
    setTimeout(() => {
       // Vrátime sa k pôvodnému obrázku
        kope = false;
        drawPlayer();
    }, 200); // Čas, po ktorom sa obrázok vráti späť (500 milisekúnd)
}
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
      destroyBlock();
      animateDigging();
      checkDragon();
      spaceBarPocitadlo1++;
    }
});
function checkWinCondition() {
    if (diamondsCollected === PocetGenDiamant && goldsCollected === PocetGenGolds) {
      setTimeout(() => {
        diamondsCollected = 0;
        goldsCollected = 0;
        effectVyhra.play();
        const winConfirm = confirm('Gratulujem, vyhral si hru! Chceš hrať znova?');
        if (winConfirm) {
          // Znovu spustiť hru
          resetGame();
        } else {
          // Ukončiť aplikáciu
          window.close(); // Toto môže byť zablokované v niektorých prehliadačoch
        }
      }, 100); // Oneskorí upozornenie o 0,1 sekundu (100 milisekúnd)
    }
}
function resetGame() {
   let hasWon = false; // Premenná na sledovanie, či hráč už vyhral
   playerX = blockSize; // Začiatočná pozícia hráča na osi X
   playerY = blockSize; // Začiatočná pozícia hráča na osi Y
    
   diamonds.length = 0;
   clay.length = 0;
   golds.length = 0;
    
    diamondsDestroyed = 0; // Počet zničených diamantov
    goldsDestroyed = 0;
    isDestroying = false; // Premenná určujúca, či hráč zničí blok
    playerRotation = 0; // Úvodná rotácia hráča
    spaceBarPocitadlo1 = 0; // Počet stlačení medzerníka
    diamondsCollected = 0; // Počet zozbieraných diamantov
    goldsCollected = 0;
    dragonSleeping = true;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    generateDiamonds();
    generateGolds();
    generateClay();
    drawPlayer();
    drawClay();
    drawDragon();
    drawDiamonds();
    drawGolds();
    displayStats(); // Zobraz štatistiky
    requestAnimationFrame(gameLoop);
}







// Funkcia na aktualizáciu počtu vykopaných diamantov
function updateDiamondCount() {
  const diamondCountElement = document.getElementById('diamondCount');
  if (diamondCountElement) {
      diamondCountElement.textContent = diamondsCollected;
  }
}

// Funkcia na inicializáciu zobrazenia diamantov
function initializeDiamonds(count) {
  const diamondsContainer = document.querySelector('.diamonds-container');
  // Vymažte všetky existujúce diamantové položky
  diamondsContainer.innerHTML = '';
  
  // Vytvorte a pridajte diamantové položky na základe počtu diamantov
  for (let i = 0; i < count; i++) {
    const diamondItem = document.createElement('div');
    diamondItem.classList.add('diamond-item');
    
    const diamondImage = document.createElement('img');
    diamondImage.src = 'images/diamond.png';
    diamondImage.alt = 'Diamond';
    diamondImage.classList.add('diamond-image');
    
    const diamondOverlay = document.createElement('div');
    diamondOverlay.classList.add('diamond-overlay');
    
    diamondItem.appendChild(diamondImage);
    diamondItem.appendChild(diamondOverlay);
    diamondsContainer.appendChild(diamondItem);
  }
}

// Funkcia na aktualizáciu zobrazenia diamantov po získaní nového diamantu
function updateDiamondsCollected(count) {
  const diamonds = document.querySelectorAll('.diamond-item');
  // Aktualizujte triedy pre všetky diamanty po získaní nového diamantu
  for (let i = 0; i < count; i++) {
    diamonds[i].classList.add('collected');
  }
}



// Funkcia na aktualizáciu počtu vykopaných goldov
function updateGoldCount() {
  const goldCountElement = document.getElementById('goldCount');
  if (goldCountElement) {
      goldCountElement.textContent = goldsCollected;
  }
}

// Funkcia na inicializáciu zobrazenia goldou
function initializeGolds(count) {
  const goldsContainer = document.querySelector('.golds-container');
  // Vymažte všetky existujúce diamantové položky
  goldsContainer.innerHTML = '';
  
  // Vytvorte a pridajte diamantové položky na základe počtu diamantov
  for (let i = 0; i < count; i++) {
    const goldItem = document.createElement('div');
    goldItem.classList.add('gold-item');
    
    const goldImage = document.createElement('img');
    goldImage.src = 'images/gold.png';
    goldImage.alt = 'Gold';
    goldImage.classList.add('gold-image');
    
    const goldOverlay = document.createElement('div');
    goldOverlay.classList.add('gold-overlay');
    
    goldItem.appendChild(goldImage);
    goldItem.appendChild(goldOverlay);
    goldsContainer.appendChild(goldItem);
  }
}

// Funkcia na aktualizáciu zobrazenia diamantov po získaní nového goldu
function updategoldsCollected(count) {
  const golds = document.querySelectorAll('.gold-item');
  // Aktualizujte triedy pre všetky diamanty po získaní nového diamantu
  for (let i = 0; i < count; i++) {
    golds[i].classList.add('collected');
  }
}



/*MINIGAME ROZPOZNAVANIE ZVUKU*/
function minigame(){
  const soundFolder = 'zvuky/';
  const totalLevels = 5;
  const correctGuessesToWin = 3;

  let currentLevel = 1;
  let correctGuesses = 0;
  let sound1, sound2;
  let index1, index2; // Definujeme index1 a index2 na úrovni, kde budú dostupné v celej funkcii

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
    const randomFolder = Math.floor(Math.random() * 15) + 1;
    const soundFolder = `zvuky/${randomFolder}/`;
    const allSounds = getSoundList(soundFolder);
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
    const allSounds = ['1.wav', '2.wav']; 
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
        const infoDialog = document.getElementById('info-dialog');
        infoDialog.style.display = 'none';
    }, 1000);   
  }

startGame();
document.addEventListener('DOMContentLoaded', function() {
  minigame();
});

}
function showInfoDialog() {
  const infoDialog = document.getElementById('info-dialog');
  infoDialog.style.display = 'block'; // Zobraziť dialogové okno
  minigame();
}












/* MINIGAME VYSLOVNOSŤ SLOVA*/
const url = 'slova.txt'; // Upravte na skutočnú URL vášho API, ktoré poskytuje obsah súboru
let currentWordIndex = 0; // Index aktuálneho slova
let wordList = []; // Pole slov na vyslovenie
const pocetcviceni = 2;

const EffectssoundFolder = `zvuky/effects`;
let  effectVyhra = new Howl({ src: [`zvuky/effects/vyhra.mp3`] });
let effectZle = new Howl({ src: [`zvuky/effects/zle.mp3`] });
let effectSpravne = new Howl({ src: [`zvuky/effects/spravne.mp3`] });

// Funkcia na otvorenie cvičenia a výber náhodných slov
function openCvicenie() {
  fetch(url)
  .then(response => response.text())
  .then(obsah => {
    const riadky = obsah.split('\n');
    let vybraneSlova = []; // Seznam již vybraných slov
    while (wordList.length < pocetcviceni) {
      const nahodnyIndex = Math.floor(Math.random() * riadky.length);
      const slovo = riadky[nahodnyIndex].trim();
      if (!vybraneSlova.includes(slovo)) { // Pokud slovo není již vybráno
        wordList.push(slovo);
        vybraneSlova.push(slovo);
      }
    }
    startExercise();
  })
  .catch(error => {
    console.error('Chyba pri načítaní obsahu súboru: ' + error);
  });
}
/* Spustenie Cvicenia*/
function startExercise() {
  document.getElementById("cvicenie").style.display = "block";
  document.getElementById("blur-background").style.display = "block";
  document.body.classList.add("cvicenie-open");
  document.body.style.overflow = "hidden"; // Zabrániť posúvaní stránky
  displayWord();
}
// Funkcia na zobrazenie aktuálneho slova na vyslovenie
function displayWord() {
  document.getElementById("word-display").innerText = wordList[currentWordIndex].toUpperCase();
  const imageName = wordList[currentWordIndex] + ".png"; 
  document.getElementById("cvicenie-image").src = "images/slova/" + imageName;
}
/* Samotna funckia */
function rozpoznanieS() {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'sk-SK';     //jazyk
  recognition.continuous = false; //rozoznavanie jedneho slova

  // Spustenie nahrávania po stlačení tlačidla
  recognition.start();
  console.log('Nahrávanie spustené.');

  let transcript = ''; // Premenná na uchovávanie rozpoznaného textu

  //promisa, ktorá počká na ukončenie nahrávania
  const waitForEnd = new Promise((resolve) => {
    // Funkcia, ktorá sa vyvolá po ukončení nahrávania
    recognition.onend = () => {
      console.log('Nahrávanie ukončené.');
      console.log('Rozpoznaný text:', transcript);

      const currentWord = wordList[currentWordIndex];

      if (transcript.toLowerCase() === currentWord.toLowerCase()) {
        console.log('Bolo správne vyslovené slovo "' + currentWord + '".');
        document.getElementById("vysledok").innerHTML = '<center><img src="images/spravne.png" alt="Správne" style="width: 435px; height: 342px;"></center>';
        effectSpravne.play();
        currentWordIndex++;
        setTimeout(() => {
        document.getElementById("vysledok").innerHTML = ''; 
        if (currentWordIndex < wordList.length) {
          displayWord(); // Zobraziť ďalšie slovo
        } else {
          closeCvicenie(); // Ukončiť cvičenie
        }
        }, 2000);
      } else {
        console.log('Slovo "' + currentWord + '" nebolo správne vyslovené.');
        console.log('Skús ho vysloviť znova');
        document.getElementById("vysledok").innerHTML = '<center><img src="images/nespravne.png" alt="Nesprávne" style="width: 435px; height: 342px;"></center>';
        effectZle.play();
      }
      setTimeout(() => {
        document.getElementById("vysledok").innerHTML = ''; // Vymazanie obrázka po 2 sekundách
      resolve();  //resolve na splnenie promisy
      }, 2000);
    };
  });

  recognition.onresult = function(event) {
    transcript += event.results[0][0].transcript.trim();  // Rozpoznaný text
  };
  //upozornenie na chybu
  recognition.onerror = function(event) {
    console.error('Chyba pri rozpoznávaní reči:', event.error);
  };
  // Zastavenie nahrávania po 5 sekundách
  setTimeout(() => {
    recognition.stop();
  }, 5000);
  // Počkáme na ukončenie nahrávania pomocou promisy
  waitForEnd.then(() => {
    console.log('Vyhodnotenie hotové.');
  });
}
// Funkcia na zatvorenie cvičenia
function closeCvicenie() {
  currentWordIndex = 0;
  wordList = [];
  document.getElementById("cvicenie").style.display = "none";
  document.getElementById("blur-background").style.display = "none";
  document.body.classList.remove("cvicenie-open");
  document.body.style.overflow = "auto"; // Povoliť posúvanie stránky
}
const rozpoznanie = document.getElementById('rozpoznanie');
rozpoznanie.addEventListener('click', rozpoznanieS);


/*Generovanie predmetov a GameLoop*/
generateDiamonds();
generateGolds();
generateClay();
gameLoop();


