// =====================================
// LEVEL SYSTÉM - NOVÉ FUNKCIE
// =====================================

// Level konfigurácia
let levelConfig = null;
let currentLevelWords = [];
let gameStats = {
    wrongSpeechAttempts: 0, // Počet zlých vyslovení
    totalSpeechExercises: 0, // Celkový počet rečových cvičení
    startTime: null,
    gameTime: 0,
    isRunning: false
};

let gameState = {
    isPaused: false,
    levelConfig: null,
    worldConfig: null,
    startTime: null,
    gameTime: 0,
    isRunning: false
};
window.gameState = gameState;

// Inicializácia level systému
function initializeGameWithLevel() {
    console.log('Inicializujem level systém...');
    
    // Pokús sa načítať z gameRouter
    if (window.gameRouter && typeof window.gameRouter.initializeGameWithLevel === 'function') {
        try {
            levelConfig = window.gameRouter.initializeGameWithLevel();
            if (levelConfig) {
                gameState.levelConfig = levelConfig;
                console.log('Level config načítaný z gameRouter:', levelConfig);
            }
        } catch (error) {
            console.warn('Chyba s gameRouter:', error);
        }
    }
    
    // Ak nie je gameRouter, skús z URL
    if (!levelConfig) {
        const urlParams = new URLSearchParams(window.location.search);
        const levelId = urlParams.get('level');
        const worldId = urlParams.get('world');
        
        console.log('Trying URL params - levelId:', levelId, 'worldId:', worldId);
        
        if (levelId && typeof getLevelConfig === 'function') {
            try {
                levelConfig = getLevelConfig(levelId);
                if (levelConfig) {
                    gameState.levelConfig = levelConfig;
                    console.log('Level config načítaný z URL:', levelConfig);
                }
            } catch (error) {
                console.warn('Chyba pri načítaní level config:', error);
            }
        }
        
        if (worldId && typeof getWorldConfig === 'function') {
            try {
                gameState.worldConfig = getWorldConfig(worldId);
                console.log('World config načítaný:', gameState.worldConfig);
            } catch (error) {
                console.warn('Chyba pri načítaní world config:', error);
            }
        }
    }
    
    // Defaultné nastavenie ak sa nič nenačítalo
    if (!levelConfig) {
        console.warn('Žiadny level config nenačítaný, vytváram defaultný');
        levelConfig = {
            id: 'default_level',
            name: 'Testovací level',
            words: ["ROBOT", "RAKETA", "RYBA", "RUŽA", "RUKA"],
            diamonds: 3,
            golds: 4,
            crystals: 1,
            timeLimit: null,
            gameType: 'banik'
        };
        gameState.levelConfig = levelConfig;
        console.log('Používam defaultný level config');
    }
    
    // Aplikuj level config
    applyLevelConfig(levelConfig);
    console.log('Level systém inicializovaný');
    console.log('Final levelConfig:', levelConfig);
    console.log('Final currentLevelWords:', currentLevelWords);
    
    return levelConfig;
}

// Aplikovanie level konfigurácie
function applyLevelConfig(config) {
    if (!config) {
        console.warn('Žiadny config na aplikovanie');
        return;
    }
    
    PocetGenDiamant = config.diamonds || 3;
    PocetGenGolds = config.golds || 4;
    PocetGenKov = config.crystals || 1;
    currentLevelWords = [...(config.words || ["ROBOT", "RAKETA", "RYBA"])];
    
    console.log(`Level nastavený: ${PocetGenDiamant} diamantov, ${PocetGenGolds} zlatých, ${PocetGenKov} kryštálov`);
    console.log('Slová na precvičovanie:', currentLevelWords);
    
    // Vyexportuj pre debug
    window.currentLevelWords = currentLevelWords;
}

// Časovač hry
function startGameTimer() {
    gameStats.startTime = Date.now();
    gameStats.isRunning = true;
    gameState.startTime = Date.now();
    gameState.isRunning = true;
    
    console.log('Časovač spustený');
    
    if (levelConfig && levelConfig.timeLimit) {
        console.log('Nastavený časový limit:', levelConfig.timeLimit, 'sekúnd');
        setTimeout(() => {
            if (gameStats.isRunning && !hasGameEnded()) {
                gameOver('Čas vypršal!');
            }
        }, levelConfig.timeLimit * 1000);
    }
}

function getCurrentGameTime() {
    if (!gameStats.startTime) return 0;
    if (!gameStats.isRunning) return gameStats.gameTime;
    return Math.floor((Date.now() - gameStats.startTime) / 1000);
}

// Náhodné slovo z level configu
function getRandomWordFromLevel() {
    if (!currentLevelWords || currentLevelWords.length === 0) {
        console.warn('Žiadne level slová, používam defaultné');
        return "ROBOT";
    }
    const word = currentLevelWords[Math.floor(Math.random() * currentLevelWords.length)];
    console.log('Vybrané slovo:', word, 'z:', currentLevelWords);
    return word;
}

// NOVÝ systém hodnotenia na základe chýb v rečových cvičeniach
function calculateStars() {
    console.log('Počítam hviezdy...');
    console.log('Zlé pokusy v reči:', gameStats.wrongSpeechAttempts);
    console.log('Celkové rečové cvičenia:', gameStats.totalSpeechExercises);
    
    let stars = 1; // Minimálne 1 hviezda
    
    if (gameStats.wrongSpeechAttempts <= 2) {
        stars = 3; // 0-2 chyby = 3 hviezdy
    } else if (gameStats.wrongSpeechAttempts <= 6) {
        stars = 2; // 3-6 chýb = 2 hviezdy  
    } else {
        stars = 1; // 7+ chýb = 1 hviezda
    }
    
    console.log('Vypočítané hviezdy:', stars);
    return stars;
}

// Záznam chybného pokusu v rečovom cvičení
function recordWrongSpeechAttempt() {
    gameStats.wrongSpeechAttempts++;
    console.log('Zaznamenaná chyba v reči. Celkom chýb:', gameStats.wrongSpeechAttempts);
}

// Záznam úspešného rečového cvičenia
function recordSpeechExerciseCompleted() {
    gameStats.totalSpeechExercises++;
    console.log('Dokončené rečové cvičenie. Celkom cvičení:', gameStats.totalSpeechExercises);
}

// Dokončenie levelu
function completeLevel() {
    console.log('Level dokončený!');
    
    gameStats.isRunning = false;
    gameStats.gameTime = getCurrentGameTime();
    gameState.isRunning = false;
    gameState.gameTime = gameStats.gameTime;
    
    const stars = calculateStars();
    const results = {
        stars: stars,
        time: gameStats.gameTime,
        wrongAttempts: gameStats.wrongSpeechAttempts,
        totalExercises: gameStats.totalSpeechExercises,
        levelName: levelConfig ? levelConfig.name : 'Level',
        completed: true
    };
    
    console.log('Výsledky levelu:', results);
    
    // Pošli výsledky do gameRoutera
    if (window.gameRouter && typeof window.gameRouter.completeLevel === 'function') {
        try {
            const currentLevel = window.gameRouter.getCurrentLevel();
            if (currentLevel) {
                console.log('Posielam výsledky do gameRouter');
                window.gameRouter.completeLevel(currentLevel.worldId, currentLevel.levelId, results);
                return;
            }
        } catch (error) {
            console.warn('Chyba pri komunikácii s gameRouter:', error);
        }
    }
    
    // Fallback - zobraz endgame
    showEndGameWithLevelOptions(results);
}

// Zobrazenie endgame s level systémom
function showEndGameWithLevelOptions(results) {
    const starsText = '★'.repeat(results.stars) + '☆'.repeat(3 - results.stars);
    
    const gameendDiv = document.querySelector('.gameend');
    gameendDiv.innerHTML = `
        <h3 style="color: #FFD700; margin: 20px 0;">Hodnotenie: ${starsText}</h3>
        <p style="margin: 10px 0;">Čas: ${results.time || 0} sekúnd</p>
        <p style="margin: 10px 0; font-size: 14px;">Chyby v reči: ${results.wrongAttempts || 0}</p>
        <p style="margin: 10px 0; font-size: 14px;">Rečové cvičenia: ${results.totalExercises || 0}</p>
        <div style="display: flex; flex-direction: column; gap: 10px; align-items: center;">
            <a href="#" onclick="restartLevel(); return false;">
                <img src="images/restart_male.png" alt="Hrať znova">
            </a>
            <a href="#" onclick="goToNextLevel(); return false;">
                <img src="images/menu1.png" alt="Ďalší level">
            </a>
            <a href="#" onclick="returnToLevelSelector(); return false;">
                <img src="images/menu_male.png" alt="Menu levelov">
            </a>
        </div>
    `;
    
    document.getElementById("endgame").style.display = "block";
    document.getElementById("blur-background").style.display = "block";
    document.body.style.overflow = "hidden";
}

// Navigačné funkcie
function returnToLevelSelector() {
    if (window.gameRouter && typeof window.gameRouter.returnToLevelSelector === 'function') {
        try {
            const currentLevel = window.gameRouter.getCurrentLevel();
            if (currentLevel) {
                window.gameRouter.returnToLevelSelector(currentLevel.worldId);
                return;
            }
        } catch (error) {
            console.warn('Chyba pri návrate na level selector:', error);
        }
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const worldId = urlParams.get('world') || 'world_r';
    window.location.href = `level-selector.html?world=${worldId}`;
}

function goToNextLevel() {
    if (window.gameRouter && typeof window.gameRouter.goToNextLevel === 'function') {
        try {
            const currentLevel = window.gameRouter.getCurrentLevel();
            if (currentLevel) {
                window.gameRouter.goToNextLevel(currentLevel.worldId, currentLevel.levelId);
                return;
            }
        } catch (error) {
            console.warn('Chyba pri prechode na ďalší level:', error);
        }
    }
    
    returnToLevelSelector();
}

function restartLevel() {
    console.log('Reštartujem level...');
    window.location.reload();
}

function returnToWorldsMenu() {
    if (window.gameRouter && typeof window.gameRouter.returnToWorldsMenu === 'function') {
        window.gameRouter.returnToWorldsMenu();
    } else {
        window.location.href = 'worlds-menu.html';
    }
}

function hasGameEnded() {
    return diamondsCollected === PocetGenDiamant && 
           goldsCollected === PocetGenGolds && 
           kovCollected === PocetGenKov;
}

function gameOver(reason) {
    console.log('Game Over:', reason);
    gameState.isRunning = false;
    alert(reason + '\n\nSkús to znova!');
    setTimeout(() => {
        restartLevel();
    }, 1000);
}

// Sprístupni funkcie globálne
window.initializeGameWithLevel = initializeGameWithLevel;
window.restartLevel = restartLevel;
window.goToNextLevel = goToNextLevel;
window.returnToLevelSelector = returnToLevelSelector;
window.returnToWorldsMenu = returnToWorldsMenu;

// =====================================
// ORIGINÁLNY KÓD (ZACHOVANÝ)
// =====================================

// Získanie canvasu a kontextu
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const blockSize = 50; // Veľkosť jednej blokovej kocky

const playerSize = blockSize; // Veľkosť hráča
const diamondSize = blockSize; // Veľkosť diamantu
const GoldSize = blockSize; // Veľkosť diamantu
const claySize = blockSize; // Veľkosť hliny
const kovSize = blockSize; // Veľkosť diamantu
const mapWidth = 16; // Počet blokov na šírku
const mapHeight = 10; // Počet blokov na výšku

let playerX = blockSize; // Začiatočná pozícia hráča na osi X
let playerY = blockSize; // Začiatočná pozícia hráča na osi Y

const diamonds = [];
const kov = [];
const golds = [];
const clay = [];
let PocetGenDiamant = 3;
let PocetGenKov = 1;
let PocetGenGolds = 4;

let diamondsDestroyed = 0; // Počet zničených diamantov
let kovDestroyed = 0; // Počet zničených diamantov
let goldsDestroyed = 0; // Počet zničených goldov
let isDestroying = false; // Premenná určujúca, či hráč zničí blok
let playerRotation = 0; // Úvodná rotácia hráča
let diamondsCollected = 0; // Počet zozbieraných diamantov
let kovCollected = 0; // Počet zozbieraných kovov
let goldsCollected = 0; // Počet zozbieraných diamantov
let dragonSleeping = true;

playerX = 100;
playerY = 200;

const goldImg = new Image();
goldImg.src = 'images/gold.png';
const diamondImg = new Image();
diamondImg.src = 'images/diamond.png';
const kovImg = new Image();
kovImg.src = 'images/kov.png';
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

const EffectssoundFolder = `zvuky/effects`;
let  effectVyhra = new Howl({ src: [`zvuky/effects/vyhra.mp3`] });
let effectZle = new Howl({ src: [`zvuky/effects/zle.mp3`] });
let effectSpravne = new Howl({ src: [`zvuky/effects/spravne.mp3`] });
let effectkopanie = new Howl({ src: [`zvuky/effects/kopanie.wav`] });
let effectzlato = new Howl({ src: [`zvuky/effects/zlato.wav`] });

//Generovanie predmetov
function generateDiamonds() {
  const generatedPositions = []; // Pole na uchovanie už vygenerovaných pozícií
  while (diamonds.length != PocetGenDiamant) {
    const diamondX = Math.floor(Math.random() * mapWidth) * blockSize;
    const diamondY = (Math.floor(Math.random() * mapHeight) + 6) * blockSize; // Generovanie o 10 nižšie
    const newPosition = { x: diamondX, y: diamondY };
    // Zkontrolujeme, či je pozícia už obsadená diamantom
    const positionExists = generatedPositions.some (pos => pos.x === diamondX && pos.y === diamondY); 
    if (!positionExists) {
      diamonds.push(newPosition);
      generatedPositions.push(newPosition);
    }
  }
  initializeDiamonds(PocetGenDiamant);
} 

function generateKov() {
  const generatedPositions = []; 
  while (kov.length != PocetGenKov) {
    const kovX = Math.floor(Math.random() * mapWidth) * blockSize;
    const kovY = (Math.floor(Math.random() * mapHeight) + 6) * blockSize; 
    const newPosition = { x: kovX, y: kovY };
    const positionExists = generatedPositions.some (pos => pos.x === kovX && pos.y === kovY); 
    if (!positionExists) {
      kov.push(newPosition);
      generatedPositions.push(newPosition);
    }
  }
  initializeKov(PocetGenKov);
} 

function generateGolds() {
  const generatedPositions = []; 
  while (golds.length !== PocetGenGolds) {
    const goldX = Math.floor(Math.random() * mapWidth) * blockSize;
    const goldY = (Math.floor(Math.random() * mapHeight) + 6) * blockSize; 
    const newPosition = { x: goldX, y: goldY };
    const positionExists = generatedPositions.some(pos => pos.x === goldX && pos.y === goldY) ||
                           diamonds.some(diamond => diamond.x === goldX && diamond.y === goldY) || 
                           kov.some(kov => kov.x === goldX && kov.y === goldY);
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
        diamonds.forEach(diamond => {
          if (diamond.x === x * blockSize && diamond.y === (y + 6) * blockSize) { 
            isPositionEmpty = false;
          }
        });
        kov.forEach(kov => {
          if (kov.x === x * blockSize && kov.y === (y + 6) * blockSize) { 
            isPositionEmpty = false;
          }
        });
        golds.forEach(gold => {
          if (gold.x === x * blockSize && gold.y === (y + 6) * blockSize) { 
            isPositionEmpty = false;
          }
        });
        if (isPositionEmpty) {
          clay.push({ x: x * blockSize, y: (y + 6) * blockSize }); 
        }
      }
    }
}

function drawPlayer() {
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
    diamonds.forEach(diamond => {
      if (!diamond.destroyed) {
        ctx.drawImage(diamondImg, diamond.x, diamond.y, diamondSize, diamondSize);
      }
    });
}

function drawKov() {
  kov.forEach(kov => {
    if (!kov.destroyed) {
      ctx.drawImage(kovImg, kov.x, kov.y, kovSize, kovSize);
    }
  });
}

function drawGolds() {
  golds.forEach(gold => {
    if (!gold.destroyed) {
      ctx.drawImage(goldImg, gold.x, gold.y, GoldSize, GoldSize);
    }
  });
}

function drawClay() {
    ctx.lineWidth = 2;
    clay.forEach(clayObj => {
      ctx.drawImage(clayImg, clayObj.x, clayObj.y, claySize, claySize);
    });
}

// MOBILNÉ OVLÁDANIE - OPRAVENÉ
const upButton = document.getElementById('up');
if (upButton) {
  upButton.addEventListener('click', function() {
    const newPlayerX = playerX;
    const newPlayerY = playerY;
    if (playerY - blockSize >= 0) {
      playerY -= blockSize;
      playerRotation = 0;
      playerDirection = 'front';
    }
    handleCollisions(newPlayerX, newPlayerY);
  });
}

const leftButton = document.getElementById('left');
if (leftButton) {
  leftButton.addEventListener('click', function() {
    const newPlayerX = playerX;
    const newPlayerY = playerY;
    if (playerX - blockSize >= 0) {
      playerX -= blockSize;
      playerRotation = 270;
      playerDirection = 'vlavo';
    }
    handleCollisions(newPlayerX, newPlayerY);
  });
}

const downButton = document.getElementById('down');
if (downButton) {
  downButton.addEventListener('click', function() {
    const newPlayerX = playerX;
    const newPlayerY = playerY;
    if (playerY + blockSize < 800) {
      playerY += blockSize;
      playerRotation = 180;
      playerDirection = 'front';
    }
    handleCollisions(newPlayerX, newPlayerY);
  });
}

const rightButton = document.getElementById('right');
if (rightButton) {
  rightButton.addEventListener('click', function() {
    const newPlayerX = playerX;
    const newPlayerY = playerY;
    if (playerX + blockSize < 800) { 
      playerX += blockSize;
      playerRotation = 90; 
      playerDirection = 'vpravo';
    }
    handleCollisions(newPlayerX, newPlayerY);
  });
}

const pickaxeButton = document.getElementById('pickaxe');
if (pickaxeButton) {
  pickaxeButton.addEventListener('click', function() {
    destroyBlock();
    animateDigging();
  });
}

// Funkcia pre spracovanie kolízií
function handleCollisions(originalX, originalY) {
  clay.forEach((clayBlock, clayIndex) => {
    const blockX = clayBlock.x;
    const blockY = clayBlock.y;
    if (playerX === blockX && playerY === blockY) {
        if (isDestroying) {
            clay.splice(clayIndex, 1);
            isDestroying = false;
        } else {
            playerX = originalX;
            playerY = originalY;
        }
    }
  });
  
  diamonds.forEach((diamond, diamondIndex) => {
    const blockX = diamond.x;
    const blockY = diamond.y;
    if (playerX === blockX && playerY === blockY && !diamond.destroyed) {
        if (isDestroying) {
            diamond.destroyed = true;
            isDestroying = false;
        } else {
            playerX = originalX;
            playerY = originalY;
        }
    }
  });
  
  kov.forEach((kov, kovIndex) => {
    const blockX = kov.x;
    const blockY = kov.y;
    if (playerX === blockX && playerY === blockY && !kov.destroyed) {
        if (isDestroying) {
            kov.destroyed = true;
            isDestroying = false;
        } else {
            playerX = originalX;
            playerY = originalY;
        }
    }
  });
  
  golds.forEach((gold, goldIndex) => {
    const blockX = gold.x;
    const blockY = gold.y;
    if (playerX === blockX && playerY === blockY && !gold.destroyed) {
        if (isDestroying) {
            gold.destroyed = true;
            isDestroying = false;
        } else {
            playerX = originalX;
            playerY = originalY;
        }
    }
  });
}

//POHYB
window.addEventListener('keydown', (e) => {
  const newPlayerX = playerX;
  const newPlayerY = playerY;
  
  switch (e.key) {
      case 'w':
      case 'ArrowUp':
          if (playerY - blockSize >= 0) {
              playerY -= blockSize;
              playerRotation = 0;
              playerDirection = 'front';
          }
          break;
      case 'a':
      case 'ArrowLeft':
          if (playerX - blockSize >= 0) {
              playerX -= blockSize;
              playerRotation = 270;
              playerDirection = 'vlavo';
          }
          break;
      case 's':
      case 'ArrowDown':
          if (playerY + blockSize < 800) {
              playerY += blockSize;
              playerRotation = 180;
              playerDirection = 'front';
          }
          break;
      case 'd':
      case 'ArrowRight':
          if (playerX + blockSize < 800) { 
              playerX += blockSize;
              playerRotation = 90; 
              playerDirection = 'vpravo';
          }
          break;
  }
  
  handleCollisions(newPlayerX, newPlayerY);
});

//HERNÁ SLUČKA
function gameLoop() {
    // Skontroluj pauzu
    if (gameState.isPaused) {
        requestAnimationFrame(gameLoop);
        return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawClay();
    drawDiamonds();
    drawKov();
    drawGolds();
    requestAnimationFrame(gameLoop);
}

let spaceBarPressed = 0; // Počet stlačení medzerníka
let playerBlockX;
let playerBlockY;
let targetBlockX;
let targetBlockY;
let blockX;
let blockY;

function destroyBlock() {
    playerBlockX = Math.floor(playerX / blockSize);
    playerBlockY = Math.floor(playerY / blockSize);
    targetBlockX = playerBlockX;
    targetBlockY = playerBlockY;
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
        // Kontrola zničenia bloku, ktorý je pred hráčom v smere, ktorým je hráč otáčaný
        if (blockX === targetBlockX && blockY === targetBlockY) {
            clay.splice(clayIndex, 1);
        }
    });
    diamonds.forEach((diamond, diamondIndex) => {
      blockX = diamond.x / blockSize;
      blockY = diamond.y / blockSize;
      if (blockX === targetBlockX && blockY === targetBlockY && !diamond.destroyed) {
        spaceBarPressed++;
        if (spaceBarPressed === 3) {
          openCvicenieWithLevelWords(); // ZMENENÉ: Používa level slová
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
          effectzlato.play();
          updateGoldCount();
          updategoldsCollected(goldsCollected);
          checkWinCondition();
          spaceBarPressed = 0; 
        }
      }
    });
    kov.forEach((kov, kovIndex) => {
      const blockX = kov.x / blockSize;
      const blockY = kov.y / blockSize;
      if (blockX === targetBlockX && blockY === targetBlockY && !kov.destroyed) {
        spaceBarPressed++;
        if (spaceBarPressed === 4) {
          showInfoDialog();
        }
      }
    });
}

function animateDigging() {
    kope = true;
    drawPlayer();
    effectkopanie.play();
    setTimeout(() => {
        kope = false;
        drawPlayer();
    }, 200);
}

document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
      destroyBlock();
      animateDigging();
    }
});

function checkWinCondition() {
    if (diamondsCollected === PocetGenDiamant && goldsCollected === PocetGenGolds && kovCollected === PocetGenKov) {
      setTimeout(() => {
        diamondsCollected = 0;
        kovCollected = 0;
        goldsCollected = 0;
        effectVyhra.play();
        
        // ZMENENÉ: Používa level systém
        completeLevel();
      }, 100);
    }
}

function resetGame() {
   let hasWon = false;
   playerX = blockSize;
   playerY = blockSize;
    
   diamonds.length = 0;
   kov.length = 0;
   clay.length = 0;
   golds.length = 0;
    
    diamondsDestroyed = 0;
    kovsDestroyed = 0;
    goldsDestroyed = 0;
    isDestroying = false;
    playerRotation = 0;
    diamondsCollected = 0;
    kovCollected = 0;
    goldsCollected = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    generateDiamonds();
    generateKov();
    generateGolds();
    generateClay();
    drawPlayer();
    drawClay();
    drawDiamonds();
    drawKov();
    drawGolds();
    requestAnimationFrame(gameLoop);
}

// BOČNY PANEL
function updateDiamondCount() {
  const diamondCountElement = document.getElementById('diamondCount');
  if (diamondCountElement) {
      diamondCountElement.textContent = diamondsCollected;
  }
}

function initializeDiamonds(count) {
  const diamondsContainer = document.querySelector('.diamonds-container');
  if (!diamondsContainer) return;
  
  diamondsContainer.innerHTML = '';
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

function updateDiamondsCollected(count) {
  const diamonds = document.querySelectorAll('.diamond-item');
  for (let i = 0; i < count; i++) {
    diamonds[i].classList.add('collected');
  }
}

function updateKovCount() {
  const kovCountElement = document.getElementById('kovCount');
  if (kovCountElement) {
      kovCountElement.textContent = kovCollected;
  }
}

function initializeKov(count) {
  const kovContainer = document.querySelector('.kov-container');
  if (!kovContainer) return;
  
  kovContainer.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const kovItem = document.createElement('div');
    kovItem.classList.add('kov-item');
    const kovImage = document.createElement('img');
    kovImage.src = 'images/kov.png';
    kovImage.alt = 'Kov';
    kovImage.classList.add('kov-image');
    const kovOverlay = document.createElement('div');
    kovOverlay.classList.add('kov-overlay');
    kovItem.appendChild(kovImage);
    kovItem.appendChild(kovOverlay);
    kovContainer.appendChild(kovItem);
  }
}

function updateKovCollected(count) {
  const kov = document.querySelectorAll('.kov-item');
  for (let i = 0; i < count; i++) {
    kov[i].classList.add('collected');
  }
}

function updateGoldCount() {
  const goldCountElement = document.getElementById('goldCount');
  if (goldCountElement) {
      goldCountElement.textContent = goldsCollected;
  }
}

function initializeGolds(count) {
  const goldsContainer = document.querySelector('.golds-container');
  if (!goldsContainer) return;
  
  goldsContainer.innerHTML = '';
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

function updategoldsCollected(count) {
  const golds = document.querySelectorAll('.gold-item');
  for (let i = 0; i < count; i++) {
    golds[i].classList.add('collected');
  }
}

/*CVIČENIE NA ROZPOZNAVANIE ZVUKU*/
function minigame(){
  const soundFolder = 'zvuky/';
  const totalLevels = 5;
  const correctGuessesToWin = 3;
  let currentLevel = 1;
  let correctGuesses = 0;
  let sound1, sound2;
  let index1, index2;

  function startGame() {
    if (currentLevel <= totalLevels) {
        playRandomSounds();
        displayMessage('FONOLOGICKÉ CVIČENIE');
        displayMessage('Sú slová rovnaké?');
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
    displayMessage('PREHRAVA SA ZVUK');
    sound1.on('end', () => {
        setTimeout(() => {
            sound2.play();
        }, 500); 
    });
  }
  
  function getSoundList() {
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
    const dialogBox = document.querySelector('.cvicenie-content-2');
    dialogBox.innerHTML = `<p>ROZPOZNAJ SLOVÁ</p>
    <p style="font-size:20px;">${message}</p>
    <center><div id="buttonsContainer"></div></center>`;
  }
  
  function createButtons() {
    let buttonsContainer = document.getElementById('buttonsContainer');
    if (!buttonsContainer) {
        buttonsContainer = document.createElement('div');
        buttonsContainer.id = 'buttonsContainer';
    } else {
        buttonsContainer.innerHTML = '';
    }
    
    const sameButton = document.createElement('img');
    sameButton.src = 'images/rovnake.png';
    sameButton.alt = 'Rovnaké';
    sameButton.addEventListener('click', () => evaluateGuess(true));
    const differentButton = document.createElement('img');
    differentButton.src = 'images/rozdielne.png';
    differentButton.alt = 'Rozdielne';
    differentButton.addEventListener('click', () => evaluateGuess(false));
    buttonsContainer.appendChild(sameButton);
    buttonsContainer.appendChild(differentButton);
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
    const message = hasWon ? 'Správne!' : 'Skús to ešte raz.';
    if (hasWon){
      kov.forEach((kov, kovIndex) => {
        blockX = kov.x / blockSize;
        blockY = kov.y / blockSize;
        if (blockX === targetBlockX && blockY === targetBlockY && !kov.destroyed) {
          kov.destroyed = true;
          kovCollected++;
          effectzlato.play();
          updateKovCount();
          updateKovCollected(kovCollected);
          checkWinCondition();
          spaceBarPressed = 0;
        }
      });
    }
    else{
      spaceBarPressed = 0;
    }
    currentLevel = 1;
    correctGuesses = 0;
    buttonsContainer.innerHTML = '';
    displayMessage(message);
    setTimeout(() => {
        const infoDialog = document.getElementById('zvuky');
        infoDialog.style.display = 'none';
        document.getElementById("blur-background").style.display = "none";
        document.body.style.overflow = "auto";
    }, 1000);   
  }
  
  startGame();
  document.addEventListener('DOMContentLoaded', function() {
    minigame();
  });
}

function showInfoDialog() {
  const infoDialog = document.getElementById('zvuky');
  infoDialog.style.display = 'block'; 
  document.getElementById("blur-background").style.display = "block";
  document.body.style.overflow = "hidden";
  minigame();
}

/* CVIČENIE NA VYSLOVNOSŤ SLOVA*/
let currentWordIndex = 0; 
let wordList = []; // Pole slov na vyslovenie
const pocetcviceni = 2;
let kontrolacvicenia = 0;

// NOVÁ FUNKCIA: openCvicenieWithLevelWords - používa slová z level configu
function openCvicenieWithLevelWords() {
  wordList = []; // Vymaž predchádzajúce slová
  
  // Vyber náhodné slová z level configu
  let vybraneSlova = []; 
  while (wordList.length < pocetcviceni && vybraneSlova.length < currentLevelWords.length) {
    const nahodnyIndex = Math.floor(Math.random() * currentLevelWords.length);
    const slovo = currentLevelWords[nahodnyIndex];
    if (!vybraneSlova.includes(slovo)) {
      wordList.push(slovo);
      vybraneSlova.push(slovo);
    }
  }
  
  // Ak nemáme dostatok slov, pridaj ich opakovane
  while (wordList.length < pocetcviceni) {
    const nahodnyIndex = Math.floor(Math.random() * currentLevelWords.length);
    wordList.push(currentLevelWords[nahodnyIndex]);
  }
  
  console.log('Vybrané slová pre cvičenie:', wordList);
  startExercise();
}

// Funkcia na otvorenie cvičenia (zachovaná pre kompatibilitu)
function openCvicenie() {
  // ZMENENÉ: Používa level slová namiesto súboru
  openCvicenieWithLevelWords();
}

function startExercise() {
  document.getElementById("cvicenie").style.display = "block";
  document.getElementById("blur-background").style.display = "block";
  document.body.classList.add("cvicenie-open");
  document.body.style.overflow = "hidden"; 
  displayWord();
}

// OPRAVENÁ funkcia getLocalStream
function getLocalStream() {
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then((stream) => {
          window.localStream = stream;
          // OPRAVENÉ: Bezpečná kontrola pred nastavením srcObject
          if (window.localAudio) {
            window.localAudio.srcObject = stream;
            window.localAudio.autoplay = true;
          }
          console.log('Mikrofón úspešne inicializovaný');
        })
        .catch((err) => {
          console.warn(`Mikrofón nedostupný: ${err}`);
        });
    } else {
      console.warn('getUserMedia nie je podporované v tomto prehliadači');
    }
  } catch (error) {
    console.warn('Chyba pri inicializácii mikrofónu:', error);
  }
}

function displayWord() {
  document.getElementById("word-display").innerText = wordList[currentWordIndex].toUpperCase();
  const imageName = wordList[currentWordIndex] + ".png"; 
  const imageElement = document.getElementById("cvicenie-image");
  imageElement.src = "images/slova/" + imageName;
  
  // Fallback pre chýbajúce obrázky
  imageElement.onerror = function() {
    this.src = 'images/slova/default.png';
  };
}

let slovicka = 0;

function rozpoznanieS() {
  // OPRAVENÉ: Bezpečná kontrola podpory Speech Recognition
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    console.error('Rozpoznávanie reči nie je podporované v tomto prehliadači');
    alert('Rozpoznávanie reči nie je podporované v tomto prehliadači');
    return;
  }
  
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'sk-SK';
  recognition.continuous = false;
  
  recognition.start();
  console.log('Nahrávanie spustené.');
  let transcript = '';
  
  const waitForEnd = new Promise((resolve) => {
    recognition.onend = () => {
      console.log('Nahrávanie ukončené.');
      console.log('Rozpoznaný text:', transcript);
      const currentWord = wordList[currentWordIndex];
      const cleanedTranscript = transcript.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
      console.log('Rozpoznaný text po vyčistení:', cleanedTranscript);
      console.log('Očakávané slovo:', currentWord.toLowerCase());
      
      if (cleanedTranscript === currentWord.toLowerCase()) {
        console.log('Bolo správne vyslovené slovo "' + currentWord + '".');
        document.getElementById("vysledok").innerHTML = '<center><img src="images/spravne.png" alt="Správne" style="width: 435px; height: 342px;"></center>';
        effectSpravne.play();
        currentWordIndex++;
        setTimeout(() => {
        document.getElementById("vysledok").innerHTML = ''; 
        if (currentWordIndex < wordList.length) {
          displayWord();
        } else {
          kontrolacvicenia = 1;
          recordSpeechExerciseCompleted(); // PRIDANÉ: Zaznamenej dokončenie cvičenia
          closeCvicenie();
        }
        }, 2000);
      } else {
        console.log('Slovo "' + currentWord + '" nebolo správne vyslovené.');
        slovicka++;
        recordWrongSpeechAttempt(); // PRIDANÉ: Zaznamenej chybu
        console.log('Skús ho vysloviť znova, slovicka: ' +slovicka);
        document.getElementById("vysledok").innerHTML = '<center><img src="images/nespravne.png" alt="Nesprávne" style="width: 435px; height: 342px;"></center>';
        effectZle.play();
      }
      setTimeout(() => {
        document.getElementById("vysledok").innerHTML = '';
        if (slovicka === 3) {
          kontrolacvicenia = 2;
          recordSpeechExerciseCompleted(); // PRIDANÉ: Zaznamenej dokončenie aj pri neúspechu
          closeCvicenie();
        }
        resolve();
      }, 2000);
    };
  });
  
  recognition.onresult = function(event) {
    transcript += event.results[0][0].transcript.trim();
  };
  
  recognition.onerror = function(event) {
    console.error('Chyba pri rozpoznávaní reči:', event.error);
    recordWrongSpeechAttempt(); // PRIDANÉ: Zaznamenej chybu aj pri error
  };
  
  setTimeout(() => {
    recognition.stop();
  }, 5000);
  
  waitForEnd.then(() => {
    console.log('Vyhodnotenie hotové.');
  });
}

function closeCvicenie() {
  if (kontrolacvicenia === 1) {
    diamonds.forEach((diamond, diamondIndex) => {
      blockX = diamond.x / blockSize;
      blockY = diamond.y / blockSize;
      if (blockX === targetBlockX && blockY === targetBlockY && !diamond.destroyed) {
      diamond.destroyed = true; 
      diamondsCollected++;
      effectzlato.play();
      updateDiamondCount();
      updateDiamondsCollected(diamondsCollected);
      checkWinCondition();
      spaceBarPressed = 0;}     
  })}
  else if (kontrolacvicenia === 2) {
      spaceBarPressed = 0;
  }
  slovicka = 0;
  kontrolacvicenia = 0;
  currentWordIndex = 0;
  wordList = [];
  document.getElementById("cvicenie").style.display = "none";
  document.getElementById("blur-background").style.display = "none";
  document.body.classList.remove("cvicenie-open");
  document.body.style.overflow = "auto"; 
}

// OPRAVENÉ: Bezpečný event listener
const rozpoznanie = document.getElementById('rozpoznanie');
if (rozpoznanie) {
  rozpoznanie.addEventListener('click', rozpoznanieS);
}

// INICIALIZÁCIA PO NAČÍTANÍ DOM
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM načítaný, inicializujem hru...');
  
  // Počkaj na načítanie config súborov a potom inicializuj level systém
  setTimeout(() => {
    console.log('Spúšťam inicializáciu level systému...');
    
    // Skontroluj dostupnosť funkcií
    console.log('getLevelConfig dostupné:', typeof getLevelConfig);
    console.log('getWorldConfig dostupné:', typeof getWorldConfig);
    console.log('gameRouter dostupný:', typeof window.gameRouter);
    
    // Inicializuj level systém
    initializeGameWithLevel();
    
    // Bezpečne inicializuj mikrofón
    getLocalStream();
    
    // Spusti časovač
    startGameTimer();
    
    console.log('Hra úspešne inicializovaná');
    
    // Debug info
    console.log('===== DEBUG INFO =====');
    console.log('levelConfig:', levelConfig);
    console.log('currentLevelWords:', currentLevelWords);
    console.log('gameState:', gameState);
    console.log('======================');
    
  }, 500); // Počkaj 500ms na načítanie config súborov
});

// Generovanie predmetov a spustenie hry
generateDiamonds();
generateKov();
generateGolds();
generateClay();
gameLoop();

// Debug funkcie
window.debugGame = {
    showConfig: () => {
        console.log('=== GAME DEBUG ===');
        console.log('levelConfig:', levelConfig);
        console.log('currentLevelWords:', currentLevelWords); 
        console.log('gameState:', gameState);
        console.log('gameStats:', gameStats);
        console.log('PocetGenDiamant:', PocetGenDiamant);
        console.log('PocetGenGolds:', PocetGenGolds);
        console.log('PocetGenKov:', PocetGenKov);
    },
    
    simulateWrong: (count = 1) => {
        for (let i = 0; i < count; i++) {
            recordWrongSpeechAttempt();
        }
        console.log('Simulované', count, 'chyby. Celkom:', gameStats.wrongSpeechAttempts);
    },
    
    testStars: () => {
        console.log('Test hodnotenia hviezd:');
        console.log('0-2 chyby = 3 hviezdy');
        console.log('3-6 chyby = 2 hviezdy');
        console.log('7+ chyby = 1 hviezda');
        console.log('Aktuálny počet chýb:', gameStats.wrongSpeechAttempts);
        console.log('Hviezdy:', calculateStars());
    },
    
    forceComplete: () => {
        completeLevel();
    }
};