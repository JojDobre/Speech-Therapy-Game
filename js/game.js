//////////////////////////////////////////////
// Game.js - hlavný kód pre minmihru miner  //
// Autor: Adam Renak                        //
// Diplomová práca - 28.8.2025              //
//////////////////////////////////////////////



//////////////////////////////////////////////
// ============ LOADING SCREEN ============ //
// Čakanie na načítanie DOM obsahu          //
// Skrytie loading screen s animáciou       //
//////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('load', function() {
        setTimeout(hideLoadingScreen, 1000); // Čaká 1 sekundu potom skryje
    });
    
    console.log('Hra načítaná.');
});

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}





///////////////////////////////////////////////
// ========== ZAKLADNE PREMENNE ============ //
// Diamonds, kov, Golds, Kov, Zvukové efekty //
// velkosti blokov, pocet ziskanych itemov   //
///////////////////////////////////////////////

//////////////////////////////////
// Získanie canvasu a kontextu  //
//////////////////////////////////
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const blockSize = 50; // Veľkosť jednej blokovej kocky

getLocalStream();

const playerSize = blockSize;           // Veľkosť hráča
const diamondSize = blockSize;          // Veľkosť diamantu
const GoldSize = blockSize;             // Veľkosť diamantu
const claySize = blockSize;             // Veľkosť hliny
const kovSize = blockSize;              // Veľkosť diamantu
const mapWidth = 16;                    // Počet blokov na šírku
const mapHeight = 10;                   // Počet blokov na výšku

let playerX = blockSize;                // Začiatočná pozícia hráča na osi X
let playerY = blockSize;                // Začiatočná pozícia hráča na osi Y

const diamonds = [];
const kov = [];                         ///////////////////////
const golds = [];                       // Základné premenné //
const clay = [];                        ///////////////////////
let PocetGenDiamant = 3;                
let PocetGenKov = 1;
let PocetGenGolds = 4;

let diamondsDestroyed = 0;              // Počet zničených diamantov
let kovDestroyed = 0;                   // Počet zničených diamantov
let goldsDestroyed = 0;                 // Počet zničených goldov
let isDestroying = false;               // Premenná určujúca, či hráč zničí blok
let playerRotation = 0;                 // Úvodná rotácia hráča
let diamondsCollected = 0;              // Počet zozbieraných diamantov
let kovCollected = 0;                   // Počet zozbieraných kovov
let goldsCollected = 0;                 // Počet zozbieraných diamantov

let spaceBarPressed = 0;                // Počet stlačení medzerníka
let playerBlockX;                       // Pozicia hraca X
let playerBlockY;                       // Pozicia hraca Y
let targetBlockX;                       
let targetBlockY;
let blockX;
let blockY;

/////////////////////////////////////////
// Globálne premenné pre časový systém //
/////////////////////////////////////////
let gameTimer = {
    startTime: null,           // Čas spustenia hry
    currentTime: 0,            // Aktuálny čas v sekundách
    intervalId: null,          // ID intervalu pre aktualizáciu
    timeLimit: null,           // Časový limit z levelConfig (v sekundách)
    isRunning: false,          // Označuje či timer beží
    isPaused: false            // Označuje či je timer pozastavený
};

///////////////////////
// Obrázky postavy   //
///////////////////////
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

////////////////////
// zvukové efekty //
////////////////////
const EffectssoundFolder = `zvuky/effects`;
let  effectVyhra = new Howl({ src: [`zvuky/effects/vyhra.mp3`] });
let effectZle = new Howl({ src: [`zvuky/effects/zle.mp3`] });
let effectSpravne = new Howl({ src: [`zvuky/effects/spravne.mp3`] });
let effectkopanie = new Howl({ src: [`zvuky/effects/kopanie.wav`] });
let effectzlato = new Howl({ src: [`zvuky/effects/zlato.wav`] });






////////////////////////////////////////////////////////////
//      ========== KONFIGURÁCIA LEVELU ==========         //
// Globálna premenná pre konfiguráciu aktuálneho levelu   //
// Obsahuje: words, diamonds, golds, crystals, timeLimit  //
//           positions                                    //
////////////////////////////////////////////////////////////
let currentLevelConfig = null;
let isCustomLevel = false; // Označuje či je spustený custom level

/**
 * Inicializácia hry s konfiguráciou levelu
 * @param {Object} levelConfig - konfigurácia levelu z levels.js
 * @param {Boolean} customLevel - true ak je to custom level
 */

function initializeGameWithLevel(levelConfig, customLevel = false) {
    console.log('Inicializujem hru s levelConfig:', levelConfig);
    
    currentLevelConfig = levelConfig;
    isCustomLevel = customLevel;
    
    // Aktualizácia počtov objektov podľa levelConfig
    if (levelConfig.diamonds) PocetGenDiamant = levelConfig.diamonds;
    if (levelConfig.golds) PocetGenGolds = levelConfig.golds;  
    if (levelConfig.crystals) PocetGenKov = levelConfig.crystals;

    // Nastavenie pozície hráča ak je definovaná v levelConfig
    if (levelConfig.positions && levelConfig.positions.player) {
        playerX = levelConfig.positions.player.x * blockSize;
        playerY = levelConfig.positions.player.y * blockSize;
        console.log(`Pozícia hráča nastavená na: ${levelConfig.positions.player.x}, ${levelConfig.positions.player.y}`);
    } else {
        // Predvolená pozícia
        playerX = blockSize;
        playerY = blockSize;
    }
    
    console.log(`Nastavené počty: Diamanty=${PocetGenDiamant}, Zlato=${PocetGenGolds}, Kryštály=${PocetGenKov}`);
    console.log('Custom level:', isCustomLevel);

    // Inicializácia sledovania výkonu
    initializePerformanceTracking();

    const timeLimit = levelConfig && levelConfig.timeLimit ? levelConfig.timeLimit : null;
    startTimer(timeLimit);
    
    resetGame();
}


//////////////////////////////////////////////////
//      ========== ČASOMIERA ==========         //
// spustenie časomiery, zastavenie časomiery    //
// pozastavenie a obnovenie časomiery           //
// aktualizacia časomiery atd                   //
//////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////
// Spustenie časomery - volať pri štarte hry                                        //
// @param {number|null} timeLimit - Časový limit v sekundách (null = bez limitu)    //
//////////////////////////////////////////////////////////////////////////////////////
function startTimer(timeLimit = null) {
    console.log('Spúšťam časomeru...', timeLimit ? `Limit: ${timeLimit}s` : 'Bez limitu');
    
    // Nastav časový limit z parametra
    gameTimer.timeLimit = timeLimit;
    gameTimer.startTime = Date.now();
    gameTimer.currentTime = 0;
    gameTimer.isRunning = true;
    gameTimer.isPaused = false;
    
    // Aktualizuj UI ihneď
    updateTimerDisplay();
    
    // Spusti pravidelné aktualizácie každú sekundu
    gameTimer.intervalId = setInterval(() => {
        if (!gameTimer.isPaused && gameTimer.isRunning) {
            // Vypočítaj aktuálny čas
            gameTimer.currentTime = Math.floor((Date.now() - gameTimer.startTime) / 1000);
            
            // Aktualizuj zobrazenie
            updateTimerDisplay();
            
            // Kontrola časového limitu
            if (gameTimer.timeLimit && gameTimer.currentTime >= gameTimer.timeLimit) {
                console.log('Čas vypršal!');
                handleTimeUp();
            }
        }
    }, 1000);
}

////////////////////////////////////////
//       Zastavenie časomery          //
////////////////////////////////////////
function stopTimer() {
    console.log('Zastavujem časomeru...');
    gameTimer.isRunning = false;
    
    if (gameTimer.intervalId) {
        clearInterval(gameTimer.intervalId);
        gameTimer.intervalId = null;
    }
}

////////////////////////////////////////////////////////////////////////////////
// Pozastavenie/obnovenie časomery                                            //
// @param {boolean} pause - true = pozastav, false = pokračuj                 //
////////////////////////////////////////////////////////////////////////////////
function pauseTimer(pause = true) {
    console.log(pause ? 'Pozastavujem časomeru...' : 'Obnovujem časomeru...');
    gameTimer.isPaused = pause;
    
    if (!pause && gameTimer.isRunning) {
        // Pri obnovení prepočítaj štartovací čas
        gameTimer.startTime = Date.now() - (gameTimer.currentTime * 1000);
    }
}

//////////////////////////////////////////
// Aktualizácia zobrazenia času v HTML  //
//////////////////////////////////////////
function updateTimerDisplay() {
    const timeElement = document.getElementById('game-timer');
    
    if (timeElement) {
        let displayTime;
        
        if (gameTimer.timeLimit) {
            // Ak je nastavený limit, zobrazuj zostávajúci čas
            const remainingTime = Math.max(0, gameTimer.timeLimit - gameTimer.currentTime);
            displayTime = formatTime(remainingTime);
            
            // Pridaj varovnú farbu keď zostáva málo času
            if (remainingTime <= 30) {
                timeElement.style.color = '#ff4444'; // Červená
            } else if (remainingTime <= 60) {
                timeElement.style.color = '#ffaa00'; // Oranžová
            } else {
                timeElement.style.color = ''; // Pôvodná farba
            }
        } else {
            // Bez limitu, zobrazuj uplynulý čas
            displayTime = formatTime(gameTimer.currentTime);
            timeElement.style.color = ''; // Pôvodná farba
        }
        
        timeElement.textContent = displayTime;
    } else {
        console.warn('Element #game-timer nebol nájdený v HTML');
    }
}

//////////////////////////////////////////////////
// Formátovanie času do MM:SS formátu           //
// @param {number} seconds - Čas v sekundách    //
// @returns {string} - Formátovaný čas          //
//////////////////////////////////////////////////
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

////////////////////////////////////////
//       Obsluha vypršania času       //
////////////////////////////////////////
function handleTimeUp() {
    console.log('Čas vypršal! Ukončujem hru...');
    stopTimer();
    
    // Zastav hru
    gameRunning = false;
    
    // Zobraz konečný dialog s informáciou o vypršaní času
    setTimeout(() => {
        document.getElementById("endgame").style.display = "block";
        document.getElementById("blur-background").style.display = "block";
        document.body.style.overflow = "hidden";
        
        // Pridaj informáciu o vypršaní času do konečného dialógu
        const endGameContent = document.querySelector('#endgame .execise-window');
        if (endGameContent && !endGameContent.querySelector('.time-up-message')) {
            const timeUpMessage = document.createElement('div');
            timeUpMessage.className = 'time-up-message';
            timeUpMessage.innerHTML = '<h3 style="color: #ff4444;">⏰ Čas vypršal!</h3>';
            endGameContent.insertBefore(timeUpMessage, endGameContent.querySelector('nav'));
        }
    }, 100);
}

//////////////////////////////////////////////////
// Získanie aktuálneho času hry                 //
// @returns {number} - Aktuálny čas v sekundách //
//////////////////////////////////////////////////
function getCurrentGameTime() {
    return gameTimer.currentTime;
}

//////////////////////////////////////////////////////////////////////////////////////
// Získanie zostávajúceho času (ak je nastavený limit)                              //
// @returns {number|null} - Zostávajúci čas v sekundách alebo null ak nie je limit  //
//////////////////////////////////////////////////////////////////////////////////////
function getRemainingTime() {
    if (gameTimer.timeLimit) {
        return Math.max(0, gameTimer.timeLimit - gameTimer.currentTime);
    }
    return null;
}




//////////////////////////////////////////////////
// ===== SPUSTENIE HRY S URL PARAMETRAMI =====  //
// Inicializácia hry na základe URL parametrov  //
// Očakáva parametry: worldId, levelId          //
//////////////////////////////////////////////////
function initializeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // OPRAVENÉ: Podporuj oba formáty parametrov
    const worldId = urlParams.get('worldId') || urlParams.get('world');
    const levelId = urlParams.get('levelId') || urlParams.get('level');

    const isTraining = urlParams.get('training') === 'true';
    const trainingConfig = urlParams.get('config');
    
    console.log('URL parametre:', { worldId, levelId });
    
    // Zvyšok funkcie zostáva rovnaký...
    if (worldId && levelId) {
        if (typeof getLevelConfig === 'function') {
            const levelConfig = getLevelConfig(levelId);
            if (levelConfig) {
                console.log('Načítaná konfigurácia levelu:', levelConfig);
                initializeGameWithLevel(levelConfig);
                return;
            } else {
                console.warn(`Level ${levelId} nebol nájdený`);
            }
        } else {
            console.warn('Funkcia getLevelConfig nie je dostupná - levels.js nebol načítaný');
        }
    }

    if (isTraining && trainingConfig) {
        try {
            const config = JSON.parse(decodeURIComponent(trainingConfig));
            console.log('Spúšťam tréningový level s konfiguráciou:', config);
            initializeGameWithLevel(config, true); // true = custom level
            return;
        } catch (error) {
            console.error('Chyba pri načítaní tréningovej konfigurácie:', error);
        }
    }
       
    // OPRAVENÝ FALLBACK - správne počty
    console.log('Spúšťam hru s predvolenými nastaveniami');
    const fallbackLevelConfig = {
        words: ['rak', 'ryba', 'ruka', 'rosa'],
        diamonds: 2,    
        golds: 3,      
        crystals: 1,
        timeLimit: null,
        positions: {
            diamonds: [{ x: 3, y: 8 }, { x: 12, y: 7 }], // len 2 pozície
            golds: [{ x: 2, y: 9 }, { x: 7, y: 8 }, { x: 14, y: 6 }], // len 3 pozície
            crystals: [{ x: 9, y: 7 }],
            player: { x: 1, y: 1 }
        }
    };

    console.log('Fallback timeLimit:', fallbackLevelConfig.timeLimit);

    initializeGameWithLevel(fallbackLevelConfig);
}

///////////////////////////////////////////////
// Spustenie inicializácie po načítaní DOM   //
///////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
    // Čakaj kým sa načítajú všetky scripty, potom inicializuj
    setTimeout(initializeFromURL, 100);
    initializeNavigation();
});






//////////////////////////////////////////////////
// ====== VIRTUAL JOYSTICK FUNKCIONALITA ====== //
//        MECHANIKA POHYBU PRE MOBILY           //
//////////////////////////////////////////////////

///////////////////////////////////////////////
//       Premenné pre virtual joystick       //
///////////////////////////////////////////////
let joystickActive = false;
let joystickCenter = { x: 0, y: 0 };
let joystickKnob = null;
let joystickBase = null;
let joystickContainer = null;
let joystickRadius = 45; // Polomer pohybu knobu
let lastMoveTime = 0;
const moveDelay = 150; // Delay medzi pohybmi v ms

///////////////////////////////////////////////
// Inicializácia joysticku po načítaní DOM   //
///////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
    initVirtualJoystick();
});

function initVirtualJoystick() {
    joystickContainer = document.querySelector('.virtual-joystick');
    joystickKnob = document.querySelector('.joystick-knob');
    joystickBase = document.querySelector('.joystick-base');
    
    if (!joystickContainer || !joystickKnob) return;
    
    // Získanie centra joysticku
    const rect = joystickContainer.getBoundingClientRect();
    joystickCenter.x = rect.width / 2;
    joystickCenter.y = rect.height / 2;
    
    // Event listenery pre touch
    joystickKnob.addEventListener('touchstart', handleTouchStart, { passive: false });
    joystickKnob.addEventListener('touchmove', handleTouchMove, { passive: false });
    joystickKnob.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Event listenery pre mouse (testovanie na desktop)
    joystickKnob.addEventListener('mousedown', handleMouseStart);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseEnd);
}

///////////////////////////////////////////////
//                Touch start                //
///////////////////////////////////////////////
function handleTouchStart(e) {
    e.preventDefault();
    joystickActive = true;
    joystickContainer.classList.add('active');
}

///////////////////////////////////////////////
//                Touch move                 //
///////////////////////////////////////////////
function handleTouchMove(e) {
    e.preventDefault();
    if (!joystickActive) return;
    
    const touch = e.touches[0];
    const rect = joystickContainer.getBoundingClientRect();
    const x = touch.clientX - rect.left - joystickCenter.x;
    const y = touch.clientY - rect.top - joystickCenter.y;
    
    updateJoystickPosition(x, y);
}

///////////////////////////////////////////////
//                Touch end                  //
///////////////////////////////////////////////
function handleTouchEnd(e) {
    e.preventDefault();
    resetJoystick();
}

///////////////////////////////////////////////
//      Mouse start (pre testovanie)         //
///////////////////////////////////////////////
function handleMouseStart(e) {
    e.preventDefault();
    joystickActive = true;
    joystickContainer.classList.add('active');
}

///////////////////////////////////////////////
//              Mouse move                   //
///////////////////////////////////////////////
function handleMouseMove(e) {
    if (!joystickActive) return;
    
    const rect = joystickContainer.getBoundingClientRect();
    const x = e.clientX - rect.left - joystickCenter.x;
    const y = e.clientY - rect.top - joystickCenter.y;
    
    updateJoystickPosition(x, y);
}

///////////////////////////////////////////////
//                Mouse end                  //
///////////////////////////////////////////////
function handleMouseEnd(e) {
    resetJoystick();
}

///////////////////////////////////////////////
// Aktualizácia pozície knobu a pohyb hráča  //
///////////////////////////////////////////////
function updateJoystickPosition(x, y) {
    // Obmedz pohyb v kruhu
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = joystickRadius;
    
    if (distance > maxDistance) {
        x = (x / distance) * maxDistance;
        y = (y / distance) * maxDistance;
    }
    
    // Aktualizuj pozíciu knobu
    joystickKnob.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    
    // Pohyb hráča na základe pozície joysticku
    const currentTime = Date.now();
    if (currentTime - lastMoveTime > moveDelay) {
        handleJoystickMovement(x, y);
        lastMoveTime = currentTime;
    }
}

///////////////////////////////////////////////
//      Spracovanie pohybu hráča             //
///////////////////////////////////////////////
function handleJoystickMovement(x, y) {
    const threshold = 15; // Minimálna vzdialenosť pre aktiváciu pohybu
    const distance = Math.sqrt(x * x + y * y);
    
    if (distance < threshold) return;
    
    // Určenie smeru na základe uhla
    const angle = Math.atan2(y, x) * (180 / Math.PI);
    let direction = '';
    
    if (angle >= -45 && angle <= 45) {
        direction = 'right';
    } else if (angle > 45 && angle <= 135) {
        direction = 'down';
    } else if (angle > 135 || angle <= -135) {
        direction = 'left';
    } else if (angle > -135 && angle < -45) {
        direction = 'up';
    }
    
    // Vykonaj pohyb
    movePlayer(direction);
}

///////////////////////////////////////////////
// Pohyb hráča (používa existujúcu logiku)   //
///////////////////////////////////////////////
function movePlayer(direction) {
    const newPlayerX = playerX;
    const newPlayerY = playerY;
    
    switch (direction) {
        case 'up':
            if (playerY - blockSize >= 0) {
                playerY -= blockSize;
                playerRotation = 0;
                playerDirection = 'front';
            }
            break;
        case 'left':
            if (playerX - blockSize >= 0) {
                playerX -= blockSize;
                playerRotation = 270;
                playerDirection = 'vlavo';
            }
            break;
        case 'down':
            if (playerY + blockSize < 800) {
                playerY += blockSize;
                playerRotation = 180;
                playerDirection = 'front';
            }
            break;
        case 'right':
            if (playerX + blockSize < 800) {
                playerX += blockSize;
                playerRotation = 90;
                playerDirection = 'vpravo';
            }
            break;
    }
    
    // Kontrola kolízií (použije existujúcu logiku)
    checkCollisions(newPlayerX, newPlayerY);
}

/////////////////////////////////////////////////////
// Kontrola kolízií (extrahované z pôvodného kódu) //
/////////////////////////////////////////////////////
function checkCollisions(newPlayerX, newPlayerY) {
    // Kontrola kolízií s clay
    clay.forEach((clayBlock, clayIndex) => {
        const blockX = clayBlock.x;
        const blockY = clayBlock.y;
        if (playerX === blockX && playerY === blockY) {
            if (isDestroying) {
                clay.splice(clayIndex, 1);
                isDestroying = false;
            } else {
                playerX = newPlayerX;
                playerY = newPlayerY;
            }
        }
    });
    
    // Kontrola kolízií s diamonds
    diamonds.forEach((diamond, diamondIndex) => {
        const blockX = diamond.x;
        const blockY = diamond.y;
        if (playerX === blockX && playerY === blockY && !diamond.destroyed) {
            if (isDestroying) {
                diamond.destroyed = true;
                isDestroying = false;
            } else {
                playerX = newPlayerX;
                playerY = newPlayerY;
            }
        }
    });
    
    // Kontrola kolízií s kov
    kov.forEach((kov, kovIndex) => {
        const blockX = kov.x;
        const blockY = kov.y;
        if (playerX === blockX && playerY === blockY && !kov.destroyed) {
            if (isDestroying) {
                kov.destroyed = true;
                isDestroying = false;
            } else {
                playerX = newPlayerX;
                playerY = newPlayerY;
            }
        }
    });
    
    // Kontrola kolízií s golds
    golds.forEach((gold, goldIndex) => {
        const blockX = gold.x;
        const blockY = gold.y;
        if (playerX === blockX && playerY === blockY && !gold.destroyed) {
            if (isDestroying) {
                gold.destroyed = true;
                isDestroying = false;
            } else {
                playerX = newPlayerX;
                playerY = newPlayerY;
            }
        }
    });
}

///////////////////////////////////////////////
//         Reset joysticku na stred          //
///////////////////////////////////////////////
function resetJoystick() {
    joystickActive = false;
    joystickContainer.classList.remove('active');
    joystickKnob.style.transform = 'translate(-50%, -50%)';
}

///////////////////////////////////////////////
//           Akčné tlačidlo                  //
///////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
    const actionButton = document.querySelector('.action-button');
    if (actionButton) {
        actionButton.addEventListener('touchstart', handleActionTouch, { passive: false });
        actionButton.addEventListener('click', handleActionClick);
    }
});

function handleActionTouch(e) {
    e.preventDefault();
    destroyBlock();
    animateDigging();
}

function handleActionClick(e) {
    e.preventDefault();
    destroyBlock();
    animateDigging();
}


///////////////////////////////////////////////
// ========== OVLADANIE PRE PC ============= //
//         POHYB - KLAVESNICA (PC)           //
///////////////////////////////////////////////
window.addEventListener('keydown', (e) => {
  const newPlayerX = playerX;
  const newPlayerY = playerY;
  
  switch (e.key) {
      case 'w':
      case 'ArrowUp':
          if (playerY - blockSize >= 0) { // Kontrola pohybu nahor
              playerY -= blockSize;
              playerRotation = 0; // Rotácia smeru hore
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
  
  //////////////////////////////////////////////
  //            Kontrola kolízií              //
  //////////////////////////////////////////////
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
  diamonds.forEach((diamond, diamondIndex) => {
      const blockX = diamond.x;
      const blockY = diamond.y;
      if (playerX === blockX && playerY === blockY && !diamond.destroyed) {
          if (isDestroying) {
              diamond.destroyed = true;
              isDestroying = false;
          } else {
              playerX = newPlayerX;
              playerY = newPlayerY;
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
            playerX = newPlayerX;
            playerY = newPlayerY;
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
              playerX = newPlayerX;
              playerY = newPlayerY;
          }
      }
  });

});

document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
      destroyBlock();
      animateDigging();
    }
});

///////////////////////////////////////////////
//      Funkcia na ničenie itemov            // 
///////////////////////////////////////////////
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
        // Kontrola zničenia bloku, ktorý je pred hráčom v smeru, ktorým je hráč otáčaný
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
          openCvicenie();
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
          recordGoldCollected();
          checkWinConditionWithRating();
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
///////////////////////////////////////////////
//          Animácia kopania                 // 
///////////////////////////////////////////////
function animateDigging() {
    kope = true;
    drawPlayer();
    effectkopanie.play();
    setTimeout(() => {
        kope = false;
        drawPlayer();
    }, 200); // Čas, po ktorom sa obrázok vráti späť (200 milisekúnd)
}





//////////////////////////////////////////////////
//  ======= GENEROVANIE SVETA A ITEMOV =======  //
// Inicializácia sveta, generovanie a kreslenie //
//  itemov a hrača                              //
//////////////////////////////////////////////////

//////////////////////////////////////////////////
// Generovanie diamantov                        //
// Podporuje presné pozície z levelConfig       //
// alebo náhodné generovanie                    //
//////////////////////////////////////////////////
function generateDiamonds() {
    const generatedPositions = [];
    
    // Ak máme presné pozície v levelConfig a nie je to custom level
    if (currentLevelConfig && currentLevelConfig.positions && 
        currentLevelConfig.positions.diamonds && !isCustomLevel) {
        
        console.log('Generujem diamanty na presných pozíciach z levelConfig');
        currentLevelConfig.positions.diamonds.forEach(pos => {
            const newPosition = { x: pos.x * blockSize, y: pos.y * blockSize };
            diamonds.push(newPosition);
            generatedPositions.push(newPosition);
            console.log(`Diamant na pozícii: ${pos.x}, ${pos.y}`);
        });
    } else {
        // Náhodné generovanie (pre custom levely alebo ak nie sú definované pozície)
        console.log('Generujem diamanty náhodne');
        while (diamonds.length != PocetGenDiamant) {
            const diamondX = Math.floor(Math.random() * mapWidth) * blockSize;
            const diamondY = (Math.floor(Math.random() * mapHeight) + 6) * blockSize;
            const newPosition = { x: diamondX, y: diamondY };
            
            const positionExists = generatedPositions.some(pos => pos.x === diamondX && pos.y === diamondY);
            if (!positionExists) {
                diamonds.push(newPosition);
                generatedPositions.push(newPosition);
            }
        }
    }
    
    initializeDiamonds(PocetGenDiamant);
}

//////////////////////////////////////////////////
// Generovanie Kovov                            //
// Podporuje presné pozície z levelConfig       //
// alebo náhodné generovanie                    //
//////////////////////////////////////////////////
function generateKov() {
    const generatedPositions = [];
    
    if (currentLevelConfig && currentLevelConfig.positions && 
        currentLevelConfig.positions.crystals && !isCustomLevel) {
        
        console.log('Generujem kryštály na presných pozíciach z levelConfig');
        currentLevelConfig.positions.crystals.forEach(pos => {
            const newPosition = { x: pos.x * blockSize, y: pos.y * blockSize };
            kov.push(newPosition);
            generatedPositions.push(newPosition);
            console.log(`Kryštál na pozícii: ${pos.x}, ${pos.y}`);
        });
    } else {
        console.log('Generujem kryštály náhodne');
        while (kov.length != PocetGenKov) {
            const kovX = Math.floor(Math.random() * mapWidth) * blockSize;
            const kovY = (Math.floor(Math.random() * mapHeight) + 6) * blockSize;
            const newPosition = { x: kovX, y: kovY };
            
            const positionExists = generatedPositions.some(pos => pos.x === kovX && pos.y === kovY);
            if (!positionExists) {
                kov.push(newPosition);
                generatedPositions.push(newPosition);
            }
        }
    }
    
    initializeKov(PocetGenKov);
}

//////////////////////////////////////////////////
// Generovanie Goldov                           //
// Podporuje presné pozície z levelConfig       //
// alebo náhodné generovanie                    //
//////////////////////////////////////////////////
function generateGolds() {
    const generatedPositions = [];
    
    if (currentLevelConfig && currentLevelConfig.positions && 
        currentLevelConfig.positions.golds && !isCustomLevel) {
        
        console.log('Generujem goldy na presných pozíciách z levelConfig');
        currentLevelConfig.positions.golds.forEach(pos => {
            const newPosition = { x: pos.x * blockSize, y: pos.y * blockSize };
            golds.push(newPosition);
            generatedPositions.push(newPosition);
            console.log(`Gold na pozícii: ${pos.x}, ${pos.y}`);
        });
    } else {
        console.log('Generujem goldy náhodne');
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
    }
    
    initializeGolds(PocetGenGolds);
}

//////////////////////////////////////////////////
// Generovanie Clay                             //
// Generuje hlinu všade okrem pozícií           //
// kde sú iné objekty                           //
//////////////////////////////////////////////////
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

//////////////////////////////////////////////////
// Funkcia na vykreslovanie postavy             //
//////////////////////////////////////////////////
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
//////////////////////////////////////////////////
// Funkcia na vykreslovanie diamantov           //
//////////////////////////////////////////////////
function drawDiamonds() {
    diamonds.forEach(diamond => {
      if (!diamond.destroyed) {
        ctx.drawImage(diamondImg, diamond.x, diamond.y, diamondSize, diamondSize);
      }
    });
}
//////////////////////////////////////////////////
// Funkcia na vykreslovanie kovu                //
//////////////////////////////////////////////////
function drawKov() {
  kov.forEach(kov => {
    if (!kov.destroyed) {
      ctx.drawImage(kovImg, kov.x, kov.y, kovSize, kovSize);
    }
  });
}
//////////////////////////////////////////////////
// Funkcia na vykreslovanie goldov              //
//////////////////////////////////////////////////
function drawGolds() {
  golds.forEach(gold => {
    if (!gold.destroyed) {
      ctx.drawImage(goldImg, gold.x, gold.y, GoldSize, GoldSize);
    }
  });
}
//////////////////////////////////////////////////
// Funkcia na vykreslovanie hliny               //
//////////////////////////////////////////////////
function drawClay() {
    ctx.lineWidth = 2;
    clay.forEach(clayObj => {
      ctx.drawImage(clayImg, clayObj.x, clayObj.y, claySize, claySize);
    });
}








































function checkWinCondition() {
    if (diamondsCollected === PocetGenDiamant && goldsCollected === PocetGenGolds && kovCollected === PocetGenKov) {
      exercisePerformance.levelCompleted = true;
        exercisePerformance.gameTime = getCurrentGameTime();
        
        const starResult = calculateStars();
        console.log('Výsledok levelu:', starResult);
      
        stopTimer();
      updateDialogNavigation();
      setTimeout(() => {
        diamondsCollected = 0;
        kovCollected = 0;
        goldsCollected = 0;
        effectVyhra.play();
        document.getElementById("endgame").style.display = "block";
        document.getElementById("blur-background").style.display = "block";
        document.body.style.overflow = "hidden"; 
      }, 100); // Oneskorí upozornenie o 0,1 sekundu (100 milisekúnd)
    }
}
function resetGame() {

    // zastav timer a reinicializuj sledovanie
    stopTimer();
    initializePerformanceTracking();

   let hasWon = false; // Premenná na sledovanie, či hráč už vyhral
   playerX = blockSize; // Začiatočná pozícia hráča na osi X
   playerY = blockSize; // Začiatočná pozícia hráča na osi Y
    
   diamonds.length = 0;
   kov.length = 0;
   clay.length = 0;
   golds.length = 0;
    

    wordList = [];
    currentWordIndex = 0;
    
    diamondsDestroyed = 0; // Počet zničených diamantov
    kovsDestroyed = 0; // Počet zničených diamantov
    goldsDestroyed = 0;
    isDestroying = false; // Premenná určujúca, či hráč zničí blok
    playerRotation = 0; // Úvodná rotácia hráča
    diamondsCollected = 0; // Počet zozbieraných diamantov
    kovCollected = 0; // Počet zozbieraných diamantov
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
    //displayStats(); // Zobraz štatistiky
    requestAnimationFrame(gameLoop);

    // Získaj timeLimit z levelConfig ak je k dispozícii
    const timeLimit = currentLevelConfig && currentLevelConfig.timeLimit ? currentLevelConfig.timeLimit : null;
    startTimer(timeLimit);

    console.log('Hra spustená s časovým systémom');
}
// BOČNY PANEL
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
function updateKovCount() {
  const kovCountElement = document.getElementById('kovCount');
  if (kovCountElement) {
      kovCountElement.textContent = kovCollected;
  }
}
function initializeKov(count) {
  const kovContainer = document.querySelector('.kov-container');
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
    dialogBox.innerHTML = `<h1>ROZPOZNAJ SLOVÁ</h1>
    <p>${message}</p>
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
        
        if (hasWon) {
            // Úspešné posluchové cvičenie
            // Pre jednoduchos, predpokladáme 3 správne odpovede a 2 nesprávne (aby dosiahol 3 správne)
            const correctAnswers = 3;
            const incorrectAnswers = Math.max(0, currentLevel - correctAnswers - 1);
            recordListeningExerciseResult(correctAnswers, incorrectAnswers, true);
            
            kov.forEach((kov, kovIndex) => {
                blockX = kov.x / blockSize;
                blockY = kov.y / blockSize;
                if (blockX === targetBlockX && blockY === targetBlockY && !kov.destroyed) {
                    kov.destroyed = true;
                    kovCollected++;
                    effectzlato.play();
                    updateKovCount();
                    updateKovCollected(kovCollected);
                    checkWinConditionWithRating(); // UPRAVENÉ
                    spaceBarPressed = 0;
                }
            });
        } else {
            // Neúspešné posluchové cvičenie
            recordListeningExerciseResult(0, 5, false); // 0 správnych, 5 nesprávnych
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
  document.body.style.overflow = "hidden"; // Zabrániť posúvaniu stránky
  minigame();
}










//////////////////////////////////////////
// ====== HLASOVÉ CVIČENIE ======       //
// Premenné                             //
//////////////////////////////////////////
const url = 'slova.txt'; 
let currentWordIndex = 0; 
let wordList = []; // Pole slov na vyslovenie
const pocetcviceni = 2;
let kontrolacvicenia = 0;

//////////////////////////////////////////
// Funkcia na otvorenie cvičenia        //
// Používa slová z levelConfig          //
//////////////////////////////////////////
function openCvicenie() {
    // DEBUG informácie
    console.log('=== DEBUG openCvicenie ===');
    console.log('currentLevelConfig:', currentLevelConfig);
    console.log('isCustomLevel:', isCustomLevel);
    console.log('URL parameters:', window.location.search);
    
    // Kontrola či máme dostupnú konfiguráciu levelu
    if (!currentLevelConfig || !currentLevelConfig.words || currentLevelConfig.words.length === 0) {
        console.error('Chyba: Nie sú dostupné slová pre cvičenie v levelConfig');
        console.error('currentLevelConfig je:', currentLevelConfig);
        
        // OPRAVENÝ FALLBACK - náhodný výber slov
        console.log('Používam fallback slová pre testovanie...');
        const allFallbackWords = ['rak', 'ryba', 'ruka', 'rosa', 'ruža', 'robot', 'raketa', 'ryžou'];
        
        // Náhodný výber pocetcviceni slov z fallback zoznamu
        const shuffled = allFallbackWords.sort(() => 0.5 - Math.random());
        wordList = shuffled.slice(0, pocetcviceni);
        
        console.log('Fallback slová (náhodne vybrané):', wordList);
        startExercise();
        return;
    }
    
    console.log('Začínam cvičenie s slovami z levelConfig:', currentLevelConfig.words);
    
    // Výber náhodných slov z levelConfig namiesto zo súboru
    let vybraneSlova = []; // Zoznam vybratých slov
    const dostupneSlova = currentLevelConfig.words; // Slová z levelConfig
    
    // Vyber pocet cviceni počet náhodných slov
    while (wordList.length < pocetcviceni && vybraneSlova.length < dostupneSlova.length) {
        const nahodnyIndex = Math.floor(Math.random() * dostupneSlova.length);
        const slovo = dostupneSlova[nahodnyIndex].trim();
        
        if (!vybraneSlova.includes(slovo)) { // kontrola či sa vybralo iné/rozdielne slovo
            wordList.push(slovo);
            vybraneSlova.push(slovo);
            console.log(`Pridané slovo do cvičenia: ${slovo}`);
        }
    }
    
    // Ak nemáme dostatok slov, pridáme všetky dostupné
    if (wordList.length === 0) {
        console.warn('Neboli vybrané žiadne slová, používam všetky dostupné');
        wordList = dostupneSlova.slice(0, Math.min(pocetcviceni, dostupneSlova.length));
    }
    
    console.log('Finálny zoznam slov pre cvičenie:', wordList);
    startExercise();
}



/* Spustenie Cvicenia*/
function startExercise() {
  document.getElementById("cvicenie").style.display = "block";
  document.getElementById("blur-background").style.display = "block";
  document.body.classList.add("cvicenie-open");
  document.body.style.overflow = "hidden"; 
  displayWord();
}
function getLocalStream() {
  navigator.mediaDevices
    .getUserMedia({ video: false, audio: true })
    .then((stream) => {
      window.localStream = stream;
      window.localAudio.srcObject = stream;
      window.localAudio.autoplay = true;
    })
    .catch((err) => {
      console.error(`you got an error: ${err}`);
    });
}
// Funkcia na zobrazenie aktuálneho slova na vyslovenie
function displayWord() {
  document.getElementById("word-display").innerText = wordList[currentWordIndex].toUpperCase();
  const imageName = wordList[currentWordIndex] + ".png"; 
  document.getElementById("cvicenie-image").src = "images/slova/" + imageName;
}
let slovicka = 0;
/* Samotna funckia */
function rozpoznanieS() {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'sk-SK';
  recognition.continuous = false; //rozoznavanie jedneho slova
  // Spustenie nahrávania
  recognition.start();
  console.log('Nahrávanie spustené.');
  let transcript = ''; // Premenná na uchovávanie rozpoznaného textu
  const waitForEnd = new Promise((resolve) => { //promisa, ktorá počká na ukončenie nahrávania
    recognition.onend = () => {                 // Funkcia, ktorá sa vyvolá po ukončení nahrávania
      console.log('Nahrávanie ukončené.');
      console.log('Rozpoznaný text:', transcript);
      const currentWord = wordList[currentWordIndex];
      const cleanedTranscript = transcript.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,""); // Odstránenie interpunkčných znamienok a prevod na malé písmená
      console.log('Rozpoznaný text:', cleanedTranscript);
      if (cleanedTranscript === currentWord.toLowerCase()) {
        console.log('Bolo správne vyslovené slovo "' + currentWord + '".');
        document.getElementById("vysledok").innerHTML = '<center><img src="images/spravne.png" alt="Správne" style="width: 435px; height: 342px;"></center>';
        effectSpravne.play();
        currentWordIndex++;
        setTimeout(() => {
        document.getElementById("vysledok").innerHTML = ''; 
        if (currentWordIndex < wordList.length) {
          displayWord(); // Zobraziť ďalšie slovo
        } else {
          kontrolacvicenia = 1;
          closeCvicenie(); // Ukončiť cvičenie
        }
        }, 2000);
      } else {
        console.log('Slovo "' + currentWord + '" nebolo správne vyslovené.');
        slovicka++;
        console.log('Skús ho vysloviť znova, slovicka: ' +slovicka);
        document.getElementById("vysledok").innerHTML = '<center><img src="images/nespravne.png" alt="Nesprávne" style="width: 435px; height: 342px;"></center>';
        effectZle.play();
      }
      setTimeout(() => {
        document.getElementById("vysledok").innerHTML = ''; // Vymazanie obrázka po 2 sekundách
        if (slovicka === 3) {
          kontrolacvicenia = 2;
          closeCvicenie(); // Ukončiť cvičenie
        }
        resolve();  //resolve na splnenie promisy
      }, 2000);
    };
  });
  recognition.onresult = function(event) {
    transcript += event.results[0][0].transcript.trim();  // Rozpoznaný text
  };
  recognition.onerror = function(event) { //upozornenie na chybu
    console.error('Chyba pri rozpoznávaní reči:', event.error);
  };
  setTimeout(() => {             // Zastavenie nahrávania po 5 sekundách
    recognition.stop();
  }, 5000);
  waitForEnd.then(() => {       // Počkáme na ukončenie nahrávania pomocou promisy
    console.log('Vyhodnotenie hotové.');
  });
}
// Funkcia na zatvorenie cvičenia
function closeCvicenie() {
  if (kontrolacvicenia === 1) {

    const attempts = 3 - slovicka; // Ak slovicka=0, tak 3 pokusy; ak slovicka=2, tak 1 pokus
    recordSpeechExerciseResult(attempts, true);

    diamonds.forEach((diamond, diamondIndex) => {
      blockX = diamond.x / blockSize;
      blockY = diamond.y / blockSize;
      if (blockX === targetBlockX && blockY === targetBlockY && !diamond.destroyed) {
      diamond.destroyed = true; 
      diamondsCollected++;
      effectzlato.play();
      updateDiamondCount();
      updateDiamondsCollected(diamondsCollected);
      checkWinConditionWithRating();
      spaceBarPressed = 0;}     
  })}
  else if (kontrolacvicenia === 2) {
        recordSpeechExerciseResult(0, false);
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
const rozpoznanie = document.getElementById('rozpoznanie');
rozpoznanie.addEventListener('click', rozpoznanieS);









////////////////////////////////////////////////
// ========================================== //
// DYNAMICKÁ NAVIGÁCIA PRE KONEČNÉ DIALÓGY    //
// ========================================== //
////////////////////////////////////////////////


//////////////////////////////////////////////////////////////
// Aktualizácia navigačných tlačidiel v konečných dialógoch //
// Volať pri spustení hry a pri zobrazení dialógov          //
//////////////////////////////////////////////////////////////
function updateDialogNavigation() {
    console.log('Aktualizujem navigačné tlačidlá dialogov...');
    
    // Získaj informácie o aktuálnom leveli
    const urlParams = new URLSearchParams(window.location.search);
    const worldId = urlParams.get('worldId') || urlParams.get('world');
    const levelId = urlParams.get('levelId') || urlParams.get('level');
    const isTraining = urlParams.get('training') === 'true';
    
    console.log('Navigačné parametre:', { worldId, levelId, isTraining });
    
    // Aktualizuj endgame dialog (pri výhre)
    updateEndGameDialog(worldId, levelId, isTraining);
    
    // Aktualizuj menu dialog (tlačidlo menu)
    updateMenuDialog(worldId, levelId, isTraining);
}

/**
 * Aktualizácia endgame dialógu (pri výhre)
 */
function updateEndGameDialog(worldId, levelId, isTraining) {
    const endGameNav = document.querySelector('#endgame nav ul');
    if (!endGameNav) {
        console.warn('Endgame navigation nebol nájdený');
        return;
    }
    
    let restartUrl = 'game.html'; // fallback
    let backUrl = 'worldsmenu.html'; // fallback
    
    if (isTraining) {
        // Pre tréningové levely
        restartUrl = window.location.href; // Reštart s rovnakými parametrami
        backUrl = 'worldsmenu.html';
    } else if (worldId && levelId) {
        // Pre normálne levely - zachovaj URL parametre
        restartUrl = `game.html?worldId=${worldId}&levelId=${levelId}`;
        backUrl = `worldsmenu.html`; // Späť na worlds menu
    }
    
    // Aktualizuj obsah
    endGameNav.innerHTML = `
        <li><button onclick="restartCurrentLevel()" class="menu-button">Hrať znova</button></li>
        <li><button onclick="goToNextLevel()" class="menu-button">Ďalší level</button></li>
        <li><button onclick="returnToMenu()" class="menu-button">Menu</button></li>
    `;
    
    console.log('Endgame dialog aktualizovaný');
}

/**
 * Aktualizácia menu dialógu
 */
function updateMenuDialog(worldId, levelId, isTraining) {
    const menuNav = document.querySelector('#dialogove-okno nav ul');
    if (!menuNav) {
        console.warn('Menu dialog navigation nebol nájdený');
        return;
    }
    
    let restartUrl = 'game.html';
    let backUrl = 'worldsmenu.html';
    
    if (isTraining) {
        restartUrl = window.location.href;
        backUrl = 'worldsmenu.html';
    } else if (worldId && levelId) {
        restartUrl = `game.html?worldId=${worldId}&levelId=${levelId}`;
        backUrl = `worldsmenu.html`;
    }
    
    // Aktualizuj obsah
    menuNav.innerHTML = `
        <li><button onclick="restartCurrentLevel()" class="menu-button">Reštart</button></li>
        <li><button onclick="returnToMenu()" class="menu-button">Svety</button></li>
        <li><button onclick="window.location.href='index.html'" class="menu-button">Menu</button></li>
    `;
    
    console.log('Menu dialog aktualizovaný');
}

/**
 * Reštart aktuálneho levelu
 */
function restartCurrentLevel() {
    console.log('Reštartujem aktuálny level...');
    
    // Zatvor všetky dialógy
    closeAllDialogs();
    
    // Reštartuj hru s rovnakými parametrami
    const urlParams = new URLSearchParams(window.location.search);
    const isTraining = urlParams.get('training') === 'true';
    
    if (isTraining) {
        // Pre tréningové levely - reload stránky
        window.location.reload();
    } else {
        // Pre normálne levely - reinicializuj s rovnakou konfiguráciou
        if (currentLevelConfig) {
            initializeGameWithLevel(currentLevelConfig, isCustomLevel);
        } else {
            window.location.reload();
        }
    }
}

/**
 * Prechod na ďalší level
 */
function goToNextLevel() {
    console.log('Pokúsim sa prejsť na ďalší level...');
    
    const urlParams = new URLSearchParams(window.location.search);
    const worldId = urlParams.get('worldId') || urlParams.get('world');
    const levelId = urlParams.get('levelId') || urlParams.get('level');
    
    if (!worldId || !levelId) {
        console.log('Nie sú dostupné URL parametre, vraciam sa do menu');
        returnToMenu();
        return;
    }
    
    // Použij gameRouter ak je dostupný
    if (window.gameRouter && typeof window.gameRouter.continueToNextLevel === 'function') {
        closeAllDialogs();
        window.gameRouter.continueToNextLevel(worldId, levelId);
    } else {
        // Fallback - manuálne hľadanie ďalšieho levelu
        console.log('GameRouter nie je dostupný, používam fallback');
        if (typeof getLevelConfig === 'function') {
            const currentLevel = getLevelConfig(levelId);
            if (currentLevel) {
                const nextLevelNumber = currentLevel.levelNumber + 1;
                const nextLevelId = `${worldId}_${nextLevelNumber}`;
                const nextLevel = getLevelConfig(nextLevelId);
                
                if (nextLevel) {
                    closeAllDialogs();
                    window.location.href = `game.html?worldId=${worldId}&levelId=${nextLevelId}`;
                } else {
                    console.log('Ďalší level neexistuje, vraciam sa do menu');
                    returnToMenu();
                }
            }
        } else {
            returnToMenu();
        }
    }
}

/**
 * Návrat do menu svetov
 */
function returnToMenu() {
    console.log('Vraciam sa do menu svetov...');
    closeAllDialogs();
    window.location.href = 'worldsmenu.html';
}

/**
 * Zatvorenie všetkých dialógov
 */
function closeAllDialogs() {
    // Zatvor endgame dialog
    const endGameDialog = document.getElementById("endgame");
    if (endGameDialog) {
        endGameDialog.style.display = "none";
    }
    
    // Zatvor menu dialog
    const menuDialog = document.getElementById("dialogove-okno");
    if (menuDialog) {
        menuDialog.style.display = "none";
    }
    
    // Zatvor cvicenie dialog
    const cvicenieDialog = document.getElementById("cvicenie");
    if (cvicenieDialog) {
        cvicenieDialog.style.display = "none";
    }
    
    // Resetuj blur background
    const blurBackground = document.getElementById("blur-background");
    if (blurBackground) {
        blurBackground.style.display = "none";
    }
    
    // Resetuj body overflow
    document.body.classList.remove("dialog-open", "cvicenie-open");
    document.body.style.overflow = "auto";
}

// ==========================================
// INICIALIZÁCIA NAVIGÁCIE
// ==========================================

/**
 * Inicializácia navigačného systému
 * Volať po načítaní DOM
 */
function initializeNavigation() {
    console.log('Inicializujem navigačný systém...');
    
    // Aktualizuj dialógy hneď po načítaní
    updateDialogNavigation();
    
    // Nastav event listenery pre existujúce funkcie
    setupNavigationEventListeners();
}

/**
 * Nastavenie event listenerov pre navigáciu
 */
function setupNavigationEventListeners() {
    // Existujúce funkcie closeDialog1 a openDialog1 zostávajú rovnaké
    // ale sa môžu rozšíriť o aktualizáciu navigácie
    
    console.log('Navigation event listenery nastavené');
}

// ==========================================
// SPUSTENIE PO NAČÍTANÍ DOM
// ==========================================







///////////////////
// DEBUG FUNKCIE //
///////////////////

  /* Zobrazenie stats */
  /*function displayStats() {
      ctx.font = '20px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText(`Stlačenia medzerníka: ${spaceBarPocitadlo1}`, 10, 30);
      ctx.fillText(`Počet diamantov: ${diamondsCollected}`, 10, 60);
      ctx.fillText(`Počet kovov: ${kovCollected}`, 10, 90);
      ctx.fillText(`Počet goldov: ${goldsCollected}`, 10, 120);
  }*/

  /* MANUÁLNY TEST AKTUALIZÁCIE ČASU*/
  /*function testTimerUpdate() {
      console.log('=== TEST AKTUALIZÁCIE ČASU ===');
      const timeElement = document.getElementById('game-timer');
      
      if (timeElement) {
          console.log('Starý obsah:', timeElement.textContent);
          timeElement.textContent = '00:05';
          console.log('Nový obsah:', timeElement.textContent);
          console.log('✅ Manuálna aktualizácia funguje');
      } else {
          console.error('❌ Element nenájdený pre test');
      }
  }*/

  /* KONTROLA SPUSTENIA TIMERA */
  /*function debugStartTimer() {
      console.log('=== DEBUG START TIMER ===');
      console.log('gameTimer objekt:', gameTimer);
      console.log('gameTimer.isRunning:', gameTimer.isRunning);
      console.log('gameTimer.intervalId:', gameTimer.intervalId);
      console.log('currentLevelConfig:', currentLevelConfig);
      
      if (currentLevelConfig && currentLevelConfig.timeLimit) {
          console.log('TimeLimit z levelConfig:', currentLevelConfig.timeLimit);
      } else {
          console.log('Žiadny timeLimit nastavený - neobmedzený čas');
      }
  }*/

  /* FORÇA SPUSTENIE TIMERA PRE TEST*/
  /*function forceStartTimer() {
      console.log('=== NÚDZOVÉ SPUSTENIE TIMERA ===');
      
      // Zastaví existujúci timer ak beží
      if (gameTimer.intervalId) {
          clearInterval(gameTimer.intervalId);
          console.log('Zastavil som existujúci timer');
      }
      
      // Restart timer objektu
      gameTimer.startTime = Date.now();
      gameTimer.currentTime = 0;
      gameTimer.isRunning = true;
      gameTimer.isPaused = false;
      gameTimer.timeLimit = null; // Bez limitu pre test
      
      // Aktualizuj UI hneď
      updateTimerDisplay();
      
      // Spusti interval
      gameTimer.intervalId = setInterval(() => {
          if (!gameTimer.isPaused && gameTimer.isRunning) {
              gameTimer.currentTime = Math.floor((Date.now() - gameTimer.startTime) / 1000);
              updateTimerDisplay();
              console.log('Timer tick:', gameTimer.currentTime);
          }
      }, 1000);
      
      console.log('✅ Timer núdzovo spustený');
  }*/

  /* KONTROLA VOLANIA FUNKCIÍ */
  /*function checkFunctionCalls() {
      console.log('=== KONTROLA VOLANIA FUNKCIÍ ===');
      
      // Skontroluj či existujú funkcie
      console.log('startTimer funkcia existuje:', typeof startTimer === 'function');
      console.log('updateTimerDisplay funkcia existuje:', typeof updateTimerDisplay === 'function');
      console.log('formatTime funkcia existuje:', typeof formatTime === 'function');
      
      // Skontroluj či sa volá startTimer pri inicializácii
      console.log('currentLevelConfig pri inicializácii:', currentLevelConfig);
  }*/

    /* Simulácia výhry - nastaví všetky items ako zozbierané */
    function simulateWin() {
        console.log('🏆 Simulujem výhru...');
        
        // Nastav všetky potrebné počty na dokončenie
        diamondsCollected = PocetGenDiamant;
        goldsCollected = PocetGenGolds;
        kovCollected = PocetGenKov;
        
        console.log(`Nastavené počty: Diamanty=${diamondsCollected}/${PocetGenDiamant}, Zlato=${goldsCollected}/${PocetGenGolds}, Kryštály=${kovCollected}/${PocetGenKov}`);
        
        // Aktualizuj UI
        updateDiamondsCollected(diamondsCollected);
        updategoldsCollected(goldsCollected);
        updateKovCollected(kovCollected);
        
        // Spusti kontrolu výhry
        checkWinConditionWithRating();
    }

    /* Simulácia čiastočnej výhry - zoberie len časť items */
    function simulatePartialWin() {
        console.log('📈 Simulujem čiastočnú výhru...');
        
        // Nastav približne 80% items
        diamondsCollected = Math.max(1, Math.floor(PocetGenDiamant * 0.8));
        goldsCollected = Math.max(1, Math.floor(PocetGenGolds * 0.8));
        kovCollected = Math.max(0, Math.floor(PocetGenKov * 0.8));
        
        console.log(`Čiastočné počty: Diamanty=${diamondsCollected}/${PocetGenDiamant}, Zlato=${goldsCollected}/${PocetGenGolds}, Kryštály=${kovCollected}/${PocetGenKov}`);
        
        // Aktualizuj UI
        updateDiamondsCollected(diamondsCollected);
        updategoldsCollected(goldsCollected);
        updateKovCollected(kovCollected);
    }

    /* Resetovanie pokroku */
    function resetProgress() {
        console.log('🔄 Resetujem pokrok...');
        
        diamondsCollected = 0;
        goldsCollected = 0;
        kovCollected = 0;
        
        // Aktualizuj UI
        updateDiamondsCollected(0);
        updategoldsCollected(0);
        updateKovCollected(0);
        
        console.log('Pokrok resetovaný');
    }

    /* Zobrazenie aktuálneho stavu hry */
    function showGameStatus() {
        console.log('📊 === AKTUÁLNY STAV HRY ===');
        console.log(`Diamanty: ${diamondsCollected}/${PocetGenDiamant}`);
        console.log(`Zlato: ${goldsCollected}/${PocetGenGolds}`);
        console.log(`Kryštály: ${kovCollected}/${PocetGenKov}`);
        console.log(`Časomiera beží: ${gameTimer.isRunning}`);
        console.log(`Aktuálny čas: ${gameTimer.currentTime}s`);
        console.log(`Level config: `, currentLevelConfig);
        console.log(`Custom level: ${isCustomLevel}`);
        console.log(`URL parametre: ${window.location.search}`);
    }

    /* Manuálne zobrazenie win dialógu (bez kontroly podmienok) */
    function forceShowWinDialog() {
        console.log('🎉 Núdzovo zobrazujem win dialóg...');
        
        // Zastav timer
        stopTimer();
        
        // Aktualizuj navigáciu
        updateDialogNavigation();
        
        // Zobraz dialóg
        setTimeout(() => {
            effectVyhra.play();
            document.getElementById("endgame").style.display = "block";
            document.getElementById("blur-background").style.display = "block";
            document.body.style.overflow = "hidden";
            console.log('Win dialóg zobrazený');
        }, 100);
    }

    /* Testovanie navigačných tlačidiel */
    function testNavigationButtons() {
        console.log('🔗 Testujem navigačné tlačidlá...');
        
        const urlParams = new URLSearchParams(window.location.search);
        const worldId = urlParams.get('worldId') || urlParams.get('world');
        const levelId = urlParams.get('levelId') || urlParams.get('level');
        const isTraining = urlParams.get('training') === 'true';
        
        console.log('Navigačné parametre:');
        console.log(`- World ID: ${worldId}`);
        console.log(`- Level ID: ${levelId}`);
        console.log(`- Je tréning: ${isTraining}`);
        
        // Testuj či existujú potrebné funkcie
        console.log('Dostupné navigačné funkcie:');
        console.log(`- restartCurrentLevel: ${typeof restartCurrentLevel === 'function'}`);
        console.log(`- goToNextLevel: ${typeof goToNextLevel === 'function'}`);
        console.log(`- returnToMenu: ${typeof returnToMenu === 'function'}`);
        console.log(`- updateDialogNavigation: ${typeof updateDialogNavigation === 'function'}`);
    }

    /* Simulácia vypršania času */
    function simulateTimeUp() {
        console.log('⏰ Simulujem vypršanie času...');
        
        // Núdzovo nastav časový limit a current time
        gameTimer.timeLimit = 10; // 10 sekúnd limit
        gameTimer.currentTime = 11; // Už vypršalo
        
        // Spusti handle time up
        handleTimeUp();
    }

// ==========================================
// SPUSTI VŠETKY DEBUG TESTY
// ==========================================
function runAllDebugTests() {
    console.log('🔍 SPÚŠŤAM KOMPLETNÝ DEBUG ČASOVÉHO SYSTÉMU');
    displayStats();
    checkTimerElement();
    checkFunctionCalls();
    debugStartTimer();
    testTimerUpdate();
    
    console.log('🚀 Pokúsim sa núdzovo spustiť timer...');
    forceStartTimer();
}


/////////////////////////////////////
// ====== Dodatočné funkcie ====== //
/////////////////////////////////////

  /* Otvorenie custom level modalu */
  function openCustomLevelModal() {
      document.getElementById("custom-level-modal").style.display = "block";
      document.getElementById("blur-background").style.display = "block";
      document.body.style.overflow = "hidden";
  }

  /* Zatvorenie custom level modalu */
  function closeCustomModal() {
      document.getElementById("custom-level-modal").style.display = "none";
      document.getElementById("blur-background").style.display = "none";
      document.body.style.overflow = "auto";
}

  /* Spustenie custom levelu s vlastnými slovami */
  function startCustomLevel() {
      const wordsInput = document.getElementById('custom-words-input').value.trim();
      
      if (!wordsInput) {
          alert('Prosím zadajte aspoň jedno slovo!');
          return;
      }
      
      // Rozdelenie slov po riadkoch a vyčistenie
      const customWords = wordsInput.split('\n')
          .map(word => word.trim())
          .filter(word => word.length > 0);
      
      if (customWords.length === 0) {
          alert('Prosím zadajte platné slová!');
          return;
      }
      
      console.log('Custom slová:', customWords);
      
      // Vytvorenie custom levelConfig
      const customLevelConfig = {
          words: customWords,
          diamonds: 3,        // predvolené hodnoty
          golds: 4,
          crystals: 1,
          timeLimit: null,    // bez časového limitu
          // žiadne positions = náhodné generovanie
      };
      
      closeCustomModal();
      initializeGameWithLevel(customLevelConfig, true); // true = custom level
  }





  
/////////////////////////////////
//   ===== HERNÁ SLUČKA ====== //
//  vykreslenie hraca          //
//  vykreslenie itemov         //
/////////////////////////////////
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawClay();
    drawDiamonds();
    drawKov();
    drawGolds();
    requestAnimationFrame(gameLoop);
}


/////////////////////////////////
// ====== Hlavná slučka ====== //
// Generovanie sveta, Gameloop //
/////////////////////////////////
generateDiamonds();
generateKov();
generateGolds();
generateClay();
gameLoop();






















// ==========================================
// SYSTÉM HVIEZD A HODNOTENIA
// ==========================================

// Globálne premenné pre sledovanie výkonu
let gamePerformance = {
    speechExercises: {
        totalExercises: 0,        // Celkový počet rečových cvičení v leveli
        completedExercises: 0,    // Dokončené rečové cvičenia
        attempts: [],             // Pole pokusov pre každé cvičenie [1,2,3,1,...]
        totalPoints: 0            // Celkové body za rečové cvičenia
    },
    listeningExercises: {
        totalExercises: 0,        // Celkový počet posluchových cvičení
        completedExercises: 0,    // Dokončené posluchové cvičenia
        correctAnswers: 0,        // Správne odpovede
        incorrectAnswers: 0,      // Nesprávne odpovede
        totalPoints: 0            // Celkové body za posluchové cvičenia
    },
    golds: {
        total: 0,                 // Celkový počet goldov
        collected: 0              // Zozbierané goldy
    },
    levelCompleted: false,        // Či bol level dokončený
    finalStars: 0,               // Finálny počet hviezd
    totalPoints: 0,              // Celkové body
    maxPossiblePoints: 0         // Maximálne možné body
};

/**
 * Inicializácia sledovania výkonu na začiatku levelu
 */
function initializePerformanceTracking() {
    console.log('Inicializujem sledovanie výkonu...');
    
    // Resetuj gamePerformance
    gamePerformance = {
        speechExercises: {
            totalExercises: PocetGenDiamant,
            completedExercises: 0,
            attempts: [],
            totalPoints: 0
        },
        listeningExercises: {
            totalExercises: PocetGenKov,
            completedExercises: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            totalPoints: 0
        },
        golds: {
            total: PocetGenGolds,
            collected: 0
        },
        levelCompleted: false,
        finalStars: 0,
        totalPoints: 0,
        maxPossiblePoints: 0
    };
    
    // Vypočítaj maximálne možné body
    gamePerformance.maxPossiblePoints = 
        (PocetGenDiamant * 3) +  // Rečové cvičenia: max 3 body za každé
        (PocetGenKov * 3);       // Posluchové cvičenia: max 3 body za každé
        // Goldy nedávajú body
    
    console.log(`Výkon inicializovaný - Max body: ${gamePerformance.maxPossiblePoints}`);
    console.log(`Diamanty: ${PocetGenDiamant}, Kryštály: ${PocetGenKov}, Goldy: ${PocetGenGolds}`);
}

/**
 * Zaznamenanie výsledku rečového cvičenia
 * @param {number} attempts - Počet pokusov (1-3)
 * @param {boolean} success - Či bolo cvičenie úspešné
 */
function recordSpeechExerciseResult(attempts, success) {
    console.log(`Zaznamenávam rečové cvičenie: ${attempts} pokusov, úspech: ${success}`);
    
    if (success) {
        gamePerformance.speechExercises.completedExercises++;
        gamePerformance.speechExercises.attempts.push(attempts);
        
        // Výpočet bodov podľa počtu pokusov
        let points = 0;
        switch(attempts) {
            case 1: points = 3; break;
            case 2: points = 2; break;
            case 3: points = 1; break;
            default: points = 0; break;
        }
        
        gamePerformance.speechExercises.totalPoints += points;
        console.log(`Pridané ${points} body za rečové cvičenie`);
    } else {
        // Neúspešné cvičenie - 0 bodov
        gamePerformance.speechExercises.attempts.push(0);
        console.log('Rečové cvičenie neúspešné - 0 bodov');
    }
    
    updatePerformanceDisplay();
}

/**
 * Zaznamenanie výsledku posluchového cvičenia
 * @param {number} correctAnswers - Počet správnych odpovedí
 * @param {number} incorrectAnswers - Počet nesprávnych odpovedí
 * @param {boolean} completed - Či bolo cvičenie dokončené
 */
function recordListeningExerciseResult(correctAnswers, incorrectAnswers, completed) {
    console.log(`Zaznamenávam posluchové cvičenie: ${correctAnswers} správnych, ${incorrectAnswers} nesprávnych`);
    
    if (completed) {
        gamePerformance.listeningExercises.completedExercises++;
        gamePerformance.listeningExercises.correctAnswers += correctAnswers;
        gamePerformance.listeningExercises.incorrectAnswers += incorrectAnswers;
        
        // Výpočet bodov podľa správnych a nesprávnych odpovedí
        let points = 0;
        if (correctAnswers >= 3) {
            if (incorrectAnswers === 0) {
                points = 3; // 3 správne, 0 nesprávnych
            } else if (incorrectAnswers === 1) {
                points = 2; // 3 správne, 1 nesprávna
            } else if (incorrectAnswers === 2) {
                points = 1; // 3 správne, 2 nesprávne
            } else {
                points = 0; // Viac ako 2 nesprávne
            }
        }
        
        gamePerformance.listeningExercises.totalPoints += points;
        console.log(`Pridané ${points} body za posluchové cvičenie`);
    }
    
    updatePerformanceDisplay();
}

/**
 * Zaznamenanie zozbierania goldu
 */
function recordGoldCollected() {
    gamePerformance.golds.collected++;
    console.log(`Gold zozbieraný: ${gamePerformance.golds.collected}/${gamePerformance.golds.total}`);
    updatePerformanceDisplay();
}

/**
 * Výpočet finálneho hodnotenia
 * @returns {Object} Objekt s hviezdami a detailnými štatistikami
 */
function calculateFinalRating() {
    console.log('Vypočítavam finálne hodnotenie...');
    
    // Celkové body
    const totalPoints = gamePerformance.speechExercises.totalPoints + 
                       gamePerformance.listeningExercises.totalPoints;
    
    gamePerformance.totalPoints = totalPoints;
    
    // Percentuálny výkon
    const percentage = gamePerformance.maxPossiblePoints > 0 
        ? (totalPoints / gamePerformance.maxPossiblePoints) * 100 
        : 0;
    
    // Výpočet hviezd podľa percentuálneho výkonu
    let stars = 0;
    if (percentage >= 70) {
        stars = 3;
    } else if (percentage >= 40) {
        stars = 2;
    } else if (percentage > 0) {
        stars = 1;
    } else {
        stars = 0;
    }
    
    gamePerformance.finalStars = stars;
    
    const result = {
        stars: stars,
        totalPoints: totalPoints,
        maxPossiblePoints: gamePerformance.maxPossiblePoints,
        percentage: Math.round(percentage),
        speechPoints: gamePerformance.speechExercises.totalPoints,
        listeningPoints: gamePerformance.listeningExercises.totalPoints,
        speechSuccess: gamePerformance.speechExercises.completedExercises,
        speechTotal: gamePerformance.speechExercises.totalExercises,
        listeningSuccess: gamePerformance.listeningExercises.completedExercises,
        listeningTotal: gamePerformance.listeningExercises.totalExercises,
        goldsCollected: gamePerformance.golds.collected,
        goldsTotal: gamePerformance.golds.total,
        gameTime: getCurrentGameTime()
    };
    
    console.log('Finálne hodnotenie:', result);
    return result;
}

/**
 * Uloženie výsledkov do progress managera
 * @param {Object} rating - Výsledky hodnotenia
 */
function saveResultsToProgress(rating) {
    console.log('💾 Ukladám výsledky do progress managera...', rating);
    
    // Získaj informácie o aktuálnom leveli
    const urlParams = new URLSearchParams(window.location.search);
    const worldId = urlParams.get('worldId') || urlParams.get('world');
    const levelId = urlParams.get('levelId') || urlParams.get('level');
    const isTraining = urlParams.get('training') === 'true';
    
    // Pre tréningové levely neukladaj do progress managera
    if (isTraining) {
        console.log('🎯 Tréningový level - neukladám do progress managera');
        return {
            saved: false,
            reason: 'training_level',
            unlocked: { levels: [], worlds: [] }
        };
    }
    
    if (!worldId || !levelId) {
        console.warn('⚠️ Chýbajú URL parametre pre uloženie pokroku');
        return {
            saved: false,
            reason: 'missing_params',
            unlocked: { levels: [], worlds: [] }
        };
    }
    
    if (!window.progressManager) {
        console.warn('⚠️ ProgressManager nie je dostupný');
        return {
            saved: false,
            reason: 'no_progress_manager',
            unlocked: { levels: [], worlds: [] }
        };
    }
    
    try {
        // Príprava rozšírených dát pre progress manager
        const levelData = {
            // Základné údaje
            stars: rating.stars,
            completed: true,
            time: rating.gameTime,
            
            // Detailné štatistiky
            points: rating.totalPoints,
            maxPoints: rating.maxPossiblePoints,
            percentage: rating.percentage,
            
            // Rozdelenie bodov
            speechExercises: {
                completed: rating.speechSuccess,
                total: rating.speechTotal,
                points: rating.speechPoints,
                attempts: gamePerformance.speechExercises.attempts // Pole pokusov [1,2,3,1,...]
            },
            listeningExercises: {
                completed: rating.listeningSuccess,
                total: rating.listeningTotal,
                points: rating.listeningPoints,
                correctAnswers: gamePerformance.listeningExercises.correctAnswers,
                incorrectAnswers: gamePerformance.listeningExercises.incorrectAnswers
            },
            golds: {
                collected: rating.goldsCollected,
                total: rating.goldsTotal
            },
            
            // Metadáta
            timestamp: new Date().toISOString(),
            gameVersion: '2.0',
            levelType: 'banik'
        };
        
        console.log('📊 Ukladané dáta:', levelData);
        
        // Ulož do progress managera - VOLÁ VYLEPŠENÚ FUNKCIU
        const success = window.progressManager.updateLevelProgress(worldId, levelId, levelData);
        
        if (success) {
            console.log('✅ Výsledky úspešne uložené do progress managera');
            
            // Aktualizuj celkové štatistiky hráča
            const playerStats = {
                wordsSpoken: rating.speechTotal,
                correctPronunciations: rating.speechSuccess,
                incorrectPronunciations: rating.speechTotal - rating.speechSuccess,
                gamesPlayed: 1,
                gameType: 'banik',
                totalPlayTime: rating.gameTime
            };
            
            if (typeof window.progressManager.updateProgressStatistics === 'function') {
                window.progressManager.updateProgressStatistics(playerStats);
            }
            
            // Získaj informácie o odomknutom obsahu
            const worldProgress = window.progressManager.getWorldProgress(worldId);
            const detailedProgress = window.progressManager.getDetailedWorldProgress(worldId);
            
            console.log('🏆 Aktuálny pokrok sveta:', detailedProgress);
            
            // Vráť informácie o uložení a odomknutom obsahu
            return {
                saved: true,
                worldProgress: worldProgress,
                detailedProgress: detailedProgress,
                unlocked: {
                    levels: [], // Vyplní sa automaticky v progress manageri
                    worlds: []  // Vyplní sa automaticky v progress manageri
                }
            };
            
        } else {
            console.error('❌ Chyba pri ukladaní do progress managera');
            return {
                saved: false,
                reason: 'save_failed',
                unlocked: { levels: [], worlds: [] }
            };
        }
        
    } catch (error) {
        console.error('💥 Chyba pri ukladaní výsledkov:', error);
        return {
            saved: false,
            reason: 'exception',
            error: error.message,
            unlocked: { levels: [], worlds: [] }
        };
    }
}

/**
 * Aktualizácia zobrazenia výkonu v UI (voliteľné)
 */
function updatePerformanceDisplay() {
    // Môže aktualizovať UI elementy v reálnom čase
    // Napríklad progress bar alebo počítadlá bodov
    
    const correctWords = document.getElementById('correct-words');
    const incorrectWords = document.getElementById('incorrect-words');
    
    if (correctWords) {
        const totalCorrect = gamePerformance.speechExercises.completedExercises;
        correctWords.textContent = totalCorrect;
    }
    
    if (incorrectWords) {
        const totalIncorrect = gamePerformance.speechExercises.totalExercises - 
                              gamePerformance.speechExercises.completedExercises;
        incorrectWords.textContent = totalIncorrect;
    }
}

/**
 * Zobrazenie detailných výsledkov v win dialógu
 * @param {Object} rating - Výsledky hodnotenia
 */
function displayResultsInWinDialog(rating) {
    console.log('📋 Zobrazujem výsledky v win dialógu...');
    
    // Nájdi win dialóg
    const endGameDialog = document.querySelector('#endgame .execise-window');
    if (!endGameDialog) {
        console.warn('⚠️ Win dialóg nebol nájdený');
        return;
    }
    
    // Základné informácie o pokroku
    let progressInfo = '';
    if (saveResult && saveResult.saved && saveResult.detailedProgress) {
        const progress = saveResult.detailedProgress;
        progressInfo = `
            <div class="progress-info">
                <h4>Pokrok sveta</h4>
                <div class="progress-stats">
                    <span>Dokončené levely: ${progress.completedLevels}/${progress.levelStats.total}</span>
                    <span>Celkové hviezdy: ${progress.stars}</span>
                    <span>Úspešnosť: ${progress.completionPercentage}%</span>
                </div>
            </div>
        `;
    }
    
    // Vytvor HTML pre výsledky
    const resultsHTML = `
        <div class="level-results">
            <div class="stars-display">
                ${generateStarsHTML(rating.stars)}
            </div>
            <div class="performance-summary">
                <h3>Výsledky levelu</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-label">Čas:</span>
                        <span class="stat-value">${formatTime(rating.gameTime)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Body:</span>
                        <span class="stat-value">${rating.totalPoints}/${rating.maxPossiblePoints}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Úspešnosť:</span>
                        <span class="stat-value">${rating.percentage}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Rečové cvičenia:</span>
                        <span class="stat-value">${rating.speechSuccess}/${rating.speechTotal}</span>
                    </div>
                    ${rating.listeningTotal > 0 ? `
                    <div class="stat-item">
                        <span class="stat-label">Posluchové cvičenia:</span>
                        <span class="stat-value">${rating.listeningSuccess}/${rating.listeningTotal}</span>
                    </div>
                    ` : ''}
                </div>
                ${progressInfo}
            </div>
        </div>
    `;
    
    // Pridaj výsledky do dialógu pred navigačné tlačidlá
    const nav = endGameDialog.querySelector('nav');
    if (nav) {
        nav.insertAdjacentHTML('beforebegin', resultsHTML);
    } else {
        endGameDialog.insertAdjacentHTML('beforeend', resultsHTML);
    }
}

/**
 * Generovanie HTML pre zobrazenie hviezd
 * @param {number} stars - Počet hviezd (0-3)
 * @returns {string} HTML string
 */
function generateStarsHTML(stars) {
    let starsHTML = '<div class="stars-container">';
    
    for (let i = 1; i <= 3; i++) {
        const active = i <= stars ? 'active' : '';
        starsHTML += `<div class="star ${active}">⭐</div>`;
    }
    
    starsHTML += '</div>';
    return starsHTML;
}

// ==========================================
// INTEGRÁCIA DO EXISTUJÚCICH FUNKCIÍ
// ==========================================

/**
 * UPRAVIŤ checkWinCondition() - pridať hodnotenie
 */
function checkWinConditionWithRating() {
    if (diamondsCollected === PocetGenDiamant && goldsCollected === PocetGenGolds && kovCollected === PocetGenKov) {
        gamePerformance.levelCompleted = true;
        
        // Zastav timer
        stopTimer();
        
        // Vypočítaj hodnotenie
        const rating = calculateFinalRating();
        
        // Ulož výsledky
        saveResultsToProgress(rating);
        
        // Aktualizuj navigáciu
        updateDialogNavigation();
        
        setTimeout(() => {
            effectVyhra.play();
            document.getElementById("endgame").style.display = "block";
            document.getElementById("blur-background").style.display = "block";
            document.body.style.overflow = "hidden";
            
            // Zobraz výsledky v dialógu
            displayResultsInWinDialog(rating, saveResult);
            
        }, 100);
    }
}

// ==========================================
// DEBUG FUNKCIE PRE TESTOVANIE
// ==========================================

/**
 * Simulácia perfektného výkonu
 */
function simulatePerfectPerformance() {
    console.log('Simulujem perfektný výkon...');
    initializePerformanceTracking();
    
    // Simuluj rečové cvičenia - všetky na prvý pokus
    for (let i = 0; i < PocetGenDiamant; i++) {
        recordSpeechExerciseResult(1, true);
    }
    
    // Simuluj posluchové cvičenia - všetky správne
    for (let i = 0; i < PocetGenKov; i++) {
        recordListeningExerciseResult(3, 0, true);
    }
    
    // Simuluj goldy
    for (let i = 0; i < PocetGenGolds; i++) {
        recordGoldCollected();
    }
    
    const rating = calculateFinalRating();
    console.log('Perfektný výkon:', rating);
    return rating;
}

/**
 * Simulácia priemerného výkonu
 */
function simulateAveragePerformance() {
    console.log('Simulujem priemerný výkon...');
    initializePerformanceTracking();
    
    // Simuluj rečové cvičenia - mix pokusov
    const attempts = [1, 2, 3, 2]; // Rôzne pokusy
    for (let i = 0; i < Math.min(PocetGenDiamant, attempts.length); i++) {
        recordSpeechExerciseResult(attempts[i], true);
    }
    
    // Simuluj posluchové cvičenia - s chybami
    for (let i = 0; i < PocetGenKov; i++) {
        recordListeningExerciseResult(3, 1, true); // 3 správne, 1 chyba
    }
    
    const rating = calculateFinalRating();
    console.log('Priemerný výkon:', rating);
    return rating;
}













// ==========================================
// VYLEPŠENÉ DEBUG FUNKCIE - KOMPLETNÉ DOKONČENIE LEVELU
// ==========================================

/**
 * Simulácia kompletného dokončenia levelu s perfektným výkonom
 */
function simulateCompleteLevel_Perfect() {
    console.log('🏆 Simulujem kompletné dokončenie levelu s perfektným výkonom...');
    
    // 1. Inicializuj sledovanie výkonu
    initializePerformanceTracking();
    
    // 2. Simuluj všetky cvičenia s perfektným výkonom
    // Rečové cvičenia - všetky na prvý pokus
    for (let i = 0; i < PocetGenDiamant; i++) {
        recordSpeechExerciseResult(1, true);
    }
    
    // Posluchové cvičenia - všetky správne, žiadne chyby
    for (let i = 0; i < PocetGenKov; i++) {
        recordListeningExerciseResult(3, 0, true);
    }
    
    // Goldy - všetky zozbierané
    for (let i = 0; i < PocetGenGolds; i++) {
        recordGoldCollected();
    }
    
    // 3. Nastav hru ako dokončenú
    diamondsCollected = PocetGenDiamant;
    goldsCollected = PocetGenGolds;
    kovCollected = PocetGenKov;
    gamePerformance.levelCompleted = true;
    
    // 4. Aktualizuj UI
    updateDiamondsCollected(diamondsCollected);
    updategoldsCollected(goldsCollected);
    updateKovCollected(kovCollected);
    
    // 5. Spusti kompletné dokončenie levelu
    completeLevel();
    
    console.log('✅ Level dokončený s perfektným výkonom!');
}

/**
 * Simulácia kompletného dokončenia levelu s dobrým výkonom
 */
function simulateCompleteLevel_Good() {
    console.log('🥈 Simulujem kompletné dokončenie levelu s dobrým výkonom...');
    
    initializePerformanceTracking();
    
    // Rečové cvičenia - mix pokusov (prevažne 1-2 pokusy)
    const speechAttempts = [1, 2, 1, 2]; // Rôzne pokusy
    for (let i = 0; i < Math.min(PocetGenDiamant, speechAttempts.length); i++) {
        recordSpeechExerciseResult(speechAttempts[i], true);
    }
    // Ak je viac diamantov ako máme v poli
    for (let i = speechAttempts.length; i < PocetGenDiamant; i++) {
        recordSpeechExerciseResult(2, true); // 2 pokusy
    }
    
    // Posluchové cvičenia - s malými chybami
    for (let i = 0; i < PocetGenKov; i++) {
        recordListeningExerciseResult(3, 1, true); // 3 správne, 1 chyba
    }
    
    // Goldy
    for (let i = 0; i < PocetGenGolds; i++) {
        recordGoldCollected();
    }
    
    // Nastav ako dokončené a spusti
    diamondsCollected = PocetGenDiamant;
    goldsCollected = PocetGenGolds;
    kovCollected = PocetGenKov;
    gamePerformance.levelCompleted = true;
    
    updateDiamondsCollected(diamondsCollected);
    updategoldsCollected(goldsCollected);
    updateKovCollected(kovCollected);
    
    completeLevel();
    
    console.log('✅ Level dokončený s dobrým výkonom!');
}

/**
 * Simulácia kompletného dokončenia levelu so slabším výkonom
 */
function simulateCompleteLevel_Poor() {
    console.log('🥉 Simulujem kompletné dokončenie levelu so slabším výkonom...');
    
    initializePerformanceTracking();
    
    // Rečové cvičenia - väčšinou 3 pokusy, niektoré neúspešné
    for (let i = 0; i < PocetGenDiamant; i++) {
        if (i === 0) {
            recordSpeechExerciseResult(3, true);  // 1 bod
        } else {
            recordSpeechExerciseResult(0, false); // 0 bodov - neúspech
        }
    }
    
    // Posluchové cvičenia - s viacerými chybami
    for (let i = 0; i < PocetGenKov; i++) {
        recordListeningExerciseResult(3, 2, true); // 3 správne, 2 chyby = 1 bod
    }
    
    // Goldy
    for (let i = 0; i < PocetGenGolds; i++) {
        recordGoldCollected();
    }
    
    // Nastav ako dokončené (aj keď s chybami)
    diamondsCollected = Math.max(1, PocetGenDiamant - 1); // Aspoň 1 diamant zozbieraný
    goldsCollected = PocetGenGolds;
    kovCollected = PocetGenKov;
    gamePerformance.levelCompleted = true;
    
    updateDiamondsCollected(diamondsCollected);
    updategoldsCollected(goldsCollected);
    updateKovCollected(kovCollected);
    
    completeLevel();
    
    console.log('✅ Level dokončený so slabším výkonom!');
}

/**
 * Hlavná funkcia na dokončenie levelu
 * Volá všetky potrebné kroky vrátane uloženia a navigácie
 */
function completeLevel() {
    console.log('🏁 Dokončujem level...');
    
    // 1. Zastav timer
    stopTimer();
    
    // 2. Vypočítaj hodnotenie
    const rating = calculateFinalRating();
    console.log('📈 Hodnotenie levelu:', rating);
    
    // 3. Ulož výsledky do progress managera a získaj info o odomknutom obsahu
    const saveResult = saveResultsToProgress(rating);
    console.log('💾 Výsledok uloženia:', saveResult);
    
    // 4. Aktualizuj navigáciu pre win dialóg
    updateDialogNavigation();
    
    // 5. Zobraz win dialóg s výsledkami
    setTimeout(() => {
        // Prehrať zvuk výhry
        if (typeof effectVyhra !== 'undefined') {
            effectVyhra.play();
        }
        
        // Zobraziť dialóg
        document.getElementById("endgame").style.display = "block";
        document.getElementById("blur-background").style.display = "block";
        document.body.style.overflow = "hidden";
        
        // Pridať výsledky do dialógu s informáciou o pokroku
        displayResultsInWinDialog(rating, saveResult);
        
        console.log('🎉 Win dialóg zobrazený s výsledkami!');
        
        // 6. Zobraz notifikácie o odomknutom obsahu
        if (saveResult.saved) {
            setTimeout(() => {
                showUnlockNotificationsInGame(saveResult);
            }, 1000);
        }
        
    }, 500);
}


/**
 * NOVÁ FUNKCIA: Zobrazenie notifikácií o odomknutom obsahu v hre
 */
function showUnlockNotificationsInGame(saveResult) {
    if (!saveResult.saved) return;
    
    // Tu môžeš pridať toast notifikácie, animácie, atď.
    // Zatiaľ len console log
    console.log('🔓 Kontrolujem odomknutý obsah...');
    
    // Môžeš načítať najnovší stav progress managera a skontrolovať zmeny
    const urlParams = new URLSearchParams(window.location.search);
    const worldId = urlParams.get('worldId') || urlParams.get('world');
    
    if (worldId && window.progressManager) {
        const currentProgress = window.progressManager.getDetailedWorldProgress(worldId);
        console.log('📊 Aktuálny detailný pokrok:', currentProgress);
    }
}

/**
 * Kontrola a zobrazenie odomknutého obsahu
 */
function checkUnlockedContent() {
    if (!window.progressManager) {
        console.log('ProgressManager nie je dostupný pre kontrolu odomknutia');
        return;
    }
    
    setTimeout(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const worldId = urlParams.get('worldId') || urlParams.get('world');
        const levelId = urlParams.get('levelId') || urlParams.get('level');
        
        if (!worldId || !levelId) return;
        
        // Skontroluj či sa odomkol ďalší level
        if (typeof getLevelConfig === 'function') {
            const currentLevel = getLevelConfig(levelId);
            if (currentLevel) {
                const nextLevelNumber = currentLevel.levelNumber + 1;
                const nextLevelId = `${worldId}_${nextLevelNumber}`;
                const nextLevel = getLevelConfig(nextLevelId);
                
                if (nextLevel) {
                    const nextProgress = window.progressManager.getLevelProgress(worldId, nextLevelId);
                    if (nextProgress && nextProgress.isUnlocked) {
                        console.log(`🔓 Odomknutý ďalší level: ${nextLevel.name}`);
                        
                        // Môžeš pridať notifikáciu do UI
                        showUnlockNotification('level', nextLevel);
                    }
                }
            }
        }
        
        // Skontroluj či sa odomkol nový svet
        const worldProgress = window.progressManager.getProgress().worlds[worldId];
        if (worldProgress && worldProgress.completedLevels > 0) {
            console.log(`📊 Pokrok sveta ${worldId}: ${worldProgress.completedLevels} levelov, ${worldProgress.stars} hviezd`);
        }
        
    }, 1000);
}

/**
 * Zobrazenie notifikácie o odomknutí (jednoduchá verzia)
 */
function showUnlockNotification(type, item) {
    console.log(`🎊 Odomknuté: ${type} - ${item.name || item.title}`);
    
    // Môžeš pridať toast notifikáciu alebo alert
    // alert(`Odomknutý nový ${type}: ${item.name || item.title}!`);
}

/**
 * Rýchly test všetkých úrovní výkonu
 */
function testAllPerformanceLevels() {
    console.log('🧪 === TEST VŠETKÝCH ÚROVNÍ VÝKONU ===\n');
    
    console.log('1. Test perfektného výkonu (3 hviezdy):');
    const perfect = simulatePerfectPerformance();
    console.log(`   Výsledok: ${perfect.stars} hviezd, ${perfect.percentage}%\n`);
    
    console.log('2. Test dobrého výkonu (2 hviezdy):');
    initializePerformanceTracking();
    for (let i = 0; i < PocetGenDiamant; i++) {
        recordSpeechExerciseResult(2, true); // 2 pokusy = 2 body
    }
    for (let i = 0; i < PocetGenKov; i++) {
        recordListeningExerciseResult(3, 1, true); // 1 chyba = 2 body
    }
    const good = calculateFinalRating();
    console.log(`   Výsledok: ${good.stars} hviezd, ${good.percentage}%\n`);
    
    console.log('3. Test slabého výkonu (1 hviezda):');
    initializePerformanceTracking();
    for (let i = 0; i < Math.min(1, PocetGenDiamant); i++) {
        recordSpeechExerciseResult(3, true); // 3 pokusy = 1 bod
    }
    for (let i = 1; i < PocetGenDiamant; i++) {
        recordSpeechExerciseResult(0, false); // neúspech = 0 bodov
    }
    const poor = calculateFinalRating();
    console.log(`   Výsledok: ${poor.stars} hviezd, ${poor.percentage}%\n`);
    
    console.log('=== ZHRNUTIE ===');
    console.log(`Perfektný: ${perfect.stars}⭐ (${perfect.percentage}%)`);
    console.log(`Dobrý: ${good.stars}⭐ (${good.percentage}%)`);
    console.log(`Slabý: ${poor.stars}⭐ (${poor.percentage}%)`);
}


/**
 * Test kompletného systému s progress managerom
 */
function testCompleteSystemWithProgress() {
    console.log('🧪 === TEST KOMPLETNÉHO SYSTÉMU S PROGRESS MANAGEROM ===');
    
    if (!window.progressManager) {
        console.error('❌ ProgressManager nie je dostupný');
        return;
    }
    
    console.log('1. Aktuálny stav progress managera:');
    const stats = window.progressManager.getProgressStatistics();
    console.log(stats);
    
    console.log('\n2. Simulujem perfektný výkon s uložením:');
    simulateCompleteLevel_Perfect();
    
    console.log('\n3. Kontrolujem uložené dáta:');
    setTimeout(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const worldId = urlParams.get('worldId') || urlParams.get('world') || 'world_r';
        const levelId = urlParams.get('levelId') || urlParams.get('level') || 'world_r_1';
        
        const levelProgress = window.progressManager.getLevelProgress(worldId, levelId);
        console.log('📊 Pokrok levelu po uložení:', levelProgress);
        
        const worldProgress = window.progressManager.getDetailedWorldProgress(worldId);
        console.log('🌍 Pokrok sveta po uložení:', worldProgress);
    }, 2000);
}
