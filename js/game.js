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
    
    resetGame();
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
        diamonds: 2,    // OPRAVENÉ: bolo 3, teraz 2
        golds: 3,       // OPRAVENÉ: bolo 4, teraz 3  
        crystals: 1,
        timeLimit: null,
        positions: {
            diamonds: [{ x: 3, y: 8 }, { x: 12, y: 7 }], // len 2 pozície
            golds: [{ x: 2, y: 9 }, { x: 7, y: 8 }, { x: 14, y: 6 }], // len 3 pozície
            crystals: [{ x: 9, y: 7 }],
            player: { x: 1, y: 1 }
        }
    };
    
    initializeGameWithLevel(fallbackLevelConfig);
}

///////////////////////////////////////////////
// Spustenie inicializácie po načítaní DOM   //
///////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
    // Čakaj kým sa načítajú všetky scripty, potom inicializuj
    setTimeout(initializeFromURL, 100);
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
          spaceBarPressed = 0; // Reset počtu stlačení pre ďalšie diamanty
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
        document.body.style.overflow = "auto"; // Povoliť posúvanie stránky
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
const rozpoznanie = document.getElementById('rozpoznanie');
rozpoznanie.addEventListener('click', rozpoznanieS);













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


