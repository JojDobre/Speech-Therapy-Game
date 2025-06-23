/**
 * BANÍK HRA - Integrovaná s novým level systémom
 * Čistá verzia bez duplicitného kódu
 */

// ===============================
// GLOBÁLNE PREMENNÉ
// ===============================

let gameState = {
    isInitialized: false,
    isPaused: false,
    gameStartTime: null,
    levelConfig: null,
    worldConfig: null
};

// Canvas a kontext
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const blockSize = 50;

// Herné konštanty
const playerSize = blockSize;
const diamondSize = blockSize;
const GoldSize = blockSize;
const claySize = blockSize;
const kovSize = blockSize;
const mapWidth = 16;
const mapHeight = 10;

// Pozícia hráča
let playerX = blockSize;
let playerY = blockSize;
let playerDirection = 'front';
let playerRotation = 0;
let kope = false;

// Herné objekty
const diamonds = [];
const kov = [];
const golds = [];
const clay = [];

// Počty objektov (z level config)
let PocetGenDiamant = 3;
let PocetGenKov = 1;
let PocetGenGolds = 4;

// Pokrok
let diamondsCollected = 0;
let kovCollected = 0;
let goldsCollected = 0;
let spaceBarPressed = 0;

// Cvičenia
let currentWords = [];
let currentWordIndex = 0;
let kontrolacvicenia = 0;

// Obrázky
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
const hracKopaVpravoImg = new Image();
hracKopaVpravoImg.src = 'images/hrac-kope-vpravo.png';
const hracKopaVlavoImg = new Image();
hracKopaVlavoImg.src = 'images/hrac-kope-vlavo.png';

// Zvuky
let effectVyhra = new Howl({ src: [`zvuky/effects/vyhra.mp3`] });
let effectZle = new Howl({ src: [`zvuky/effects/zle.mp3`] });
let effectSpravne = new Howl({ src: [`zvuky/effects/spravne.mp3`] });
let effectkopanie = new Howl({ src: [`zvuky/effects/kopanie.wav`] });
let effectzlato = new Howl({ src: [`zvuky/effects/zlato.wav`] });

// ===============================
// INICIALIZÁCIA
// ===============================

async function initializeGame() {
    console.log('🎮 Inicializujem baník hru...');
    
    try {
        // Skontroluj dostupnosť game routera
        if (!window.gameRouter) {
            throw new Error('Game router nie je dostupný');
        }
        
        if (typeof window.gameRouter.initializeGameWithLevel !== 'function') {
            throw new Error('Game router nemá funkciu initializeGameWithLevel');
        }
        
        // Získaj level config
        gameState.levelConfig = window.gameRouter.initializeGameWithLevel();
        
        if (!gameState.levelConfig) {
            throw new Error('Level config sa nenačítal - možno chýbajú URL parametre?');
        }
        
        // Získaj world config
        if (typeof getWorldConfig === 'function') {
            gameState.worldConfig = getWorldConfig(gameState.levelConfig.worldId);
            if (!gameState.worldConfig) {
                console.warn(`World config pre ${gameState.levelConfig.worldId} sa nenašiel`);
            }
        } else {
            console.warn('Funkcia getWorldConfig nie je dostupná');
        }
        
        console.log('✅ Level config načítaný:', gameState.levelConfig);
        console.log('✅ World config načítaný:', gameState.worldConfig);
        
        // Aplikuj config
        applyLevelConfig();
        
        // Nastav hru
        setupGame();
        
        // Spusti hru
        startGame();
        
        gameState.isInitialized = true;
        console.log('🚀 Baník hra spustená');
        
    } catch (error) {
        console.error('❌ Chyba pri inicializácii:', error);
        
        // Detailnejšie error handling
        let errorMessage = 'Nepodarilo sa načítať level.';
        
        if (error.message.includes('Game router')) {
            errorMessage = 'Chyba pri načítaní herného systému. Skúste obnoviť stránku.';
        } else if (error.message.includes('Level config')) {
            errorMessage = 'Level sa nenašiel. Vraciam sa na výber levelov.';
        } else if (error.message.includes('URL parametre')) {
            errorMessage = 'Neplatná URL adresa. Vraciam sa na výber levelov.';
        }
        
        showErrorMessage(errorMessage);
        
        // Vráť sa späť po 3 sekundách
        setTimeout(() => {
            // Skús sa vrátiť cez game router
            if (window.gameRouter && gameState.levelConfig) {
                window.gameRouter.returnToLevelSelector(gameState.levelConfig.worldId);
            } else {
                // Fallback na level selector alebo worlds menu
                const urlParams = new URLSearchParams(window.location.search);
                const worldId = urlParams.get('world');
                
                if (worldId) {
                    window.location.href = `level-selector.html?world=${worldId}`;
                } else {
                    window.location.href = 'worlds-menu.html';
                }
            }
        }, 3000);
    }
}

function applyLevelConfig() {
    if (!gameState.levelConfig) return;
    
    const config = gameState.levelConfig;
    
    // Nastav slová
    if (config.words && config.words.length > 0) {
        currentWords = [...config.words];
        console.log('📝 Slová na cvičenie:', currentWords);
    }
    
    // Nastav objekty
    if (config.gameConfig) {
        PocetGenDiamant = config.gameConfig.diamonds || 2;
        PocetGenGolds = config.gameConfig.golds || 3;
        PocetGenKov = config.gameConfig.crystals || 1;
        
        console.log(`🎯 Objekty: ${PocetGenDiamant} diamantov, ${PocetGenGolds} zlatých, ${PocetGenKov} kryštálov`);
    }
    
    // Časový limit
    if (config.timeLimit) {
        setupTimeLimit(config.timeLimit);
    }
}

function setupGame() {
    // Vymaž objekty
    diamonds.length = 0;
    kov.length = 0;
    clay.length = 0;
    golds.length = 0;
    
    // Reset
    diamondsCollected = 0;
    kovCollected = 0;
    goldsCollected = 0;
    spaceBarPressed = 0;
    currentWordIndex = 0;
    kontrolacvicenia = 0;
    
    // Pozícia hráča
    playerX = blockSize;
    playerY = blockSize;
    playerDirection = 'front';
    playerRotation = 0;
    kope = false;
    
    // Generuj objekty
    generateDiamonds();
    generateKov();
    generateGolds();
    generateClay();
    
    // UI
    initializeDiamonds(PocetGenDiamant);
    initializeKov(PocetGenKov);
    initializeGolds(PocetGenGolds);
}

function startGame() {
    gameState.gameStartTime = Date.now();
    gameState.isPaused = false;
    gameLoop();
    console.log('▶️ Hra spustená');
}

// ===============================
// ČASOVÝ LIMIT
// ===============================

function setupTimeLimit(seconds) {
    console.log(`⏰ Časový limit: ${seconds}s`);
    
    let timerElement = document.getElementById('gameTimer');
    if (!timerElement) {
        timerElement = document.createElement('div');
        timerElement.id = 'gameTimer';
        timerElement.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            font-family: 'MPLUSRounded1c-Bold', Arial, sans-serif;
            font-size: 18px;
            z-index: 1000;
            border: 2px solid #FFD700;
        `;
        document.body.appendChild(timerElement);
    }
    
    let remaining = seconds;
    updateTimerDisplay(remaining);
    
    const interval = setInterval(() => {
        remaining--;
        updateTimerDisplay(remaining);
        
        if (remaining <= 0) {
            clearInterval(interval);
            handleTimeUp();
        }
        
        if (gameState.isPaused || !gameState.isInitialized) {
            clearInterval(interval);
        }
    }, 1000);
}

function updateTimerDisplay(seconds) {
    const timer = document.getElementById('gameTimer');
    if (timer) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timer.textContent = `⏰ ${mins}:${secs.toString().padStart(2, '0')}`;
        
        if (seconds <= 30) {
            timer.style.borderColor = '#FF4444';
            timer.style.backgroundColor = 'rgba(255, 68, 68, 0.9)';
        } else if (seconds <= 60) {
            timer.style.borderColor = '#FF8800';
            timer.style.backgroundColor = 'rgba(255, 136, 0, 0.8)';
        }
    }
}

function handleTimeUp() {
    gameState.isPaused = true;
    if (confirm('⏰ Čas vypršal!\n\nChceš skúsiť znova?')) {
        restartLevel();
    } else {
        returnToLevelSelector();
    }
}

// ===============================
// GENEROVANIE OBJEKTOV
// ===============================

function generateDiamonds() {
    const positions = [];
    while (diamonds.length < PocetGenDiamant) {
        const x = Math.floor(Math.random() * mapWidth) * blockSize;
        const y = (Math.floor(Math.random() * mapHeight) + 6) * blockSize;
        const pos = { x, y };
        if (!positions.some(p => p.x === x && p.y === y)) {
            diamonds.push(pos);
            positions.push(pos);
        }
    }
}

function generateKov() {
    const positions = [];
    while (kov.length < PocetGenKov) {
        const x = Math.floor(Math.random() * mapWidth) * blockSize;
        const y = (Math.floor(Math.random() * mapHeight) + 6) * blockSize;
        const pos = { x, y };
        if (!positions.some(p => p.x === x && p.y === y)) {
            kov.push(pos);
            positions.push(pos);
        }
    }
}

function generateGolds() {
    const positions = [];
    while (golds.length < PocetGenGolds) {
        const x = Math.floor(Math.random() * mapWidth) * blockSize;
        const y = (Math.floor(Math.random() * mapHeight) + 6) * blockSize;
        const pos = { x, y };
        
        const conflict = positions.some(p => p.x === x && p.y === y) ||
                        diamonds.some(d => d.x === x && d.y === y) ||
                        kov.some(k => k.x === x && k.y === y);
        
        if (!conflict) {
            golds.push(pos);
            positions.push(pos);
        }
    }
}

function generateClay() {
    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            const blockX = x * blockSize;
            const blockY = (y + 6) * blockSize;
            
            const occupied = diamonds.some(d => d.x === blockX && d.y === blockY) ||
                           kov.some(k => k.x === blockX && k.y === blockY) ||
                           golds.some(g => g.x === blockX && g.y === blockY);
            
            if (!occupied) {
                clay.push({ x: blockX, y: blockY });
            }
        }
    }
}

// ===============================
// VYKRESĽOVANIE
// ===============================

function drawPlayer() {
    let image = playerImg;
    
    if (playerDirection === 'front') {
        image = kope ? hracKopaVpravoImg : playerImg;
    } else if (playerDirection === 'vpravo') {
        image = kope ? hracKopaVpravoImg : playerImgVp;
    } else if (playerDirection === 'vlavo') {
        image = kope ? hracKopaVlavoImg : playerImgVl;
    }
    
    ctx.drawImage(image, playerX, playerY, playerSize, playerSize);
}

function drawDiamonds() {
    diamonds.forEach(diamond => {
        if (!diamond.destroyed) {
            ctx.drawImage(diamondImg, diamond.x, diamond.y, diamondSize, diamondSize);
        }
    });
}

function drawKov() {
    kov.forEach(k => {
        if (!k.destroyed) {
            ctx.drawImage(kovImg, k.x, k.y, kovSize, kovSize);
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
    clay.forEach(c => {
        ctx.drawImage(clayImg, c.x, c.y, claySize, claySize);
    });
}

function gameLoop() {
    // Vykresluj VŽDY, aj keď je hra pozastavená
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawClay();
    drawDiamonds();
    drawKov();
    drawGolds();
    
    // Vždy pokračuj v loop-e
    requestAnimationFrame(gameLoop);
}

// ===============================
// OVLÁDANIE
// ===============================

window.addEventListener('keydown', (e) => {
    // ODSTRÁNENÁ kontrola gameState.isPaused - môžeš sa pohybovať aj počas cvičení
    
    const oldX = playerX;
    const oldY = playerY;
    
    console.log(`⌨️ Stlačená klávesa: ${e.key}, pozícia hráča: ${playerX/blockSize}, ${playerY/blockSize}`);
    
    switch (e.key) {
        case 'w':
        case 'ArrowUp':
            if (playerY - blockSize >= 0) {
                playerY -= blockSize;
                playerRotation = 0;
                playerDirection = 'front';
                console.log('⬆️ Pohyb hore');
            }
            break;
        case 'a':
        case 'ArrowLeft':
            if (playerX - blockSize >= 0) {
                playerX -= blockSize;
                playerRotation = 270;
                playerDirection = 'vlavo';
                console.log('⬅️ Pohyb vľavo');
            }
            break;
        case 's':
        case 'ArrowDown':
            if (playerY + blockSize < 800) {
                playerY += blockSize;
                playerRotation = 180;
                playerDirection = 'front';
                console.log('⬇️ Pohyb dole');
            }
            break;
        case 'd':
        case 'ArrowRight':
            if (playerX + blockSize < 800) {
                playerX += blockSize;
                playerRotation = 90;
                playerDirection = 'vpravo';
                console.log('➡️ Pohyb vpravo');
            }
            break;
        case ' ':
            e.preventDefault();
            console.log('⛏️ Kopanie');
            destroyBlock();
            animateDigging();
            break;
    }
    
    console.log(`📍 Nová pozícia hráča: ${playerX/blockSize}, ${playerY/blockSize}, smer: ${playerRotation}°`);
    
    handleCollisions(oldX, oldY);
});

function handleCollisions(oldX, oldY) {
    // Clay kolízie
    clay.forEach((c, index) => {
        if (playerX === c.x && playerY === c.y) {
            playerX = oldX;
            playerY = oldY;
        }
    });
    
    // Ostatné objekty
    [...diamonds, ...kov, ...golds].forEach(obj => {
        if (playerX === obj.x && playerY === obj.y && !obj.destroyed) {
            playerX = oldX;
            playerY = oldY;
        }
    });
}

// ===============================
// NIČENIE BLOKOV - OPRAVENÉ
// ===============================

let targetBlockX = 0;
let targetBlockY = 0;

function destroyBlock() {
    const playerBlockX = Math.floor(playerX / blockSize);
    const playerBlockY = Math.floor(playerY / blockSize);
    targetBlockX = playerBlockX;
    targetBlockY = playerBlockY;
    
    // Vypočítaj cieľovú pozíciu podľa smeru hráča
    switch (playerRotation) {
        case 0: targetBlockY--; break;  // hore
        case 90: targetBlockX++; break; // vpravo
        case 180: targetBlockY++; break; // dole
        case 270: targetBlockX--; break; // vľavo
    }
    
    console.log(`🎯 Kopem na pozíciu: ${targetBlockX}, ${targetBlockY} (smer: ${playerRotation}°)`);
    
    // Clay
    clay.forEach((c, index) => {
        if (c.x / blockSize === targetBlockX && c.y / blockSize === targetBlockY) {
            clay.splice(index, 1);
            console.log('🪨 Odstránený clay');
        }
    });
    
    // Diamonds
    diamonds.forEach(d => {
        if (d.x / blockSize === targetBlockX && d.y / blockSize === targetBlockY && !d.destroyed) {
            spaceBarPressed++;
            console.log(`💎 Diamond hit! spaceBarPressed: ${spaceBarPressed}`);
            if (spaceBarPressed === 3) {
                console.log('🎤 Spúšťam rečové cvičenie');
                openCvicenie();
            }
        }
    });
    
    // Gold
    golds.forEach(g => {
        if (g.x / blockSize === targetBlockX && g.y / blockSize === targetBlockY && !g.destroyed) {
            spaceBarPressed++;
            console.log(`🥇 Gold hit! spaceBarPressed: ${spaceBarPressed}`);
            if (spaceBarPressed === 2) {
                g.destroyed = true;
                goldsCollected++;
                effectzlato.play();
                updateGoldDisplay();
                checkWinCondition();
                spaceBarPressed = 0;
                console.log(`✅ Gold collected! Total: ${goldsCollected}/${PocetGenGolds}`);
            }
        }
    });
    
    // Kov
    kov.forEach(k => {
        if (k.x / blockSize === targetBlockX && k.y / blockSize === targetBlockY && !k.destroyed) {
            spaceBarPressed++;
            console.log(`🔩 Kov hit! spaceBarPressed: ${spaceBarPressed}`);
            if (spaceBarPressed === 4) {
                console.log('🔊 Spúšťam posluchové cvičenie');
                showInfoDialog();
            }
        }
    });
}

function animateDigging() {
    kope = true;
    effectkopanie.play();
    setTimeout(() => {
        kope = false;
    }, 200);
}

// ===============================
// CVIČENIA
// ===============================

function openCvicenie() {
    if (!currentWords.length) {
        console.warn('Žiadne slová na cvičenie');
        return;
    }
    
    console.log('🎤 Otváram rečové cvičenie...');
    // NESTAVAJ gameState.isPaused = true; !!
    
    // Vyber 2 náhodné slová
    window.currentExerciseWords = [];
    const available = [...currentWords];
    
    while (window.currentExerciseWords.length < 2 && available.length > 0) {
        const index = Math.floor(Math.random() * available.length);
        window.currentExerciseWords.push(available.splice(index, 1)[0]);
    }
    
    currentWordIndex = 0;
    startExercise();
}

function startExercise() {
    document.getElementById("cvicenie").style.display = "block";
    document.getElementById("blur-background").style.display = "block";
    document.body.style.overflow = "hidden";
    displayWord();
}

function displayWord() {
    if (window.currentExerciseWords && currentWordIndex < window.currentExerciseWords.length) {
        const word = window.currentExerciseWords[currentWordIndex];
        document.getElementById("word-display").textContent = word.toUpperCase();
        document.getElementById("cvicenie-image").src = `images/slova/${word}.png`;
    }
}

function closeCvicenie() {
    console.log('🚪 Zatváram rečové cvičenie...');
    // NESTAVAJ gameState.isPaused = false; - už je false
    
    if (kontrolacvicenia === 1) {
        console.log('✅ Rečové cvičenie úspešné - ničím diamond');
        diamonds.forEach(d => {
            if (d.x / blockSize === targetBlockX && d.y / blockSize === targetBlockY && !d.destroyed) {
                d.destroyed = true;
                diamondsCollected++;
                effectzlato.play();
                updateDiamondDisplay();
                checkWinCondition();
                spaceBarPressed = 0;
                console.log(`💎 Diamond destroyed! Total: ${diamondsCollected}/${PocetGenDiamant}`);
            }
        });
    } else {
        console.log('❌ Rečové cvičenie neúspešné');
        spaceBarPressed = 0;
    }
    
    // Reset
    kontrolacvicenia = 0;
    currentWordIndex = 0;
    window.currentExerciseWords = [];
    window.slovicka = 0;
    
    document.getElementById("cvicenie").style.display = "none";
    document.getElementById("blur-background").style.display = "none";
    document.body.style.overflow = "auto";
    
    console.log('🎮 Cvičenie zatvorené, hra pokračuje...');
}

// ===============================
// REČOVÉ ROZPOZNÁVANIE
// ===============================

function rozpoznanieS() {
    if (!window.currentExerciseWords || currentWordIndex >= window.currentExerciseWords.length) {
        return;
    }
    
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'sk-SK';
    recognition.continuous = false;
    recognition.start();
    
    let transcript = '';
    
    recognition.onend = () => {
        const currentWord = window.currentExerciseWords[currentWordIndex];
        const cleaned = transcript.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        
        if (cleaned === currentWord.toLowerCase()) {
            document.getElementById("vysledok").innerHTML = '<center><img src="images/spravne.png" alt="Správne" style="width: 435px; height: 342px;"></center>';
            effectSpravne.play();
            currentWordIndex++;
            
            setTimeout(() => {
                document.getElementById("vysledok").innerHTML = '';
                if (currentWordIndex < window.currentExerciseWords.length) {
                    displayWord();
                } else {
                    kontrolacvicenia = 1;
                    closeCvicenie();
                }
            }, 2000);
        } else {
            window.slovicka = (window.slovicka || 0) + 1;
            document.getElementById("vysledok").innerHTML = '<center><img src="images/nespravne.png" alt="Nesprávne" style="width: 435px; height: 342px;"></center>';
            effectZle.play();
            
            setTimeout(() => {
                document.getElementById("vysledok").innerHTML = '';
                if (window.slovicka >= 3) {
                    kontrolacvicenia = 2;
                    closeCvicenie();
                }
            }, 2000);
        }
    };
    
    recognition.onresult = (event) => {
        transcript += event.results[0][0].transcript.trim();
    };
    
    recognition.onerror = (event) => {
        console.error('Chyba rozpoznávania:', event.error);
    };
    
    setTimeout(() => recognition.stop(), 5000);
}

// ===============================
// UI AKTUALIZÁCIE
// ===============================

function initializeDiamonds(count) {
    const container = document.querySelector('.diamonds-container');
    if (!container) return;
    
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const item = document.createElement('div');
        item.classList.add('diamond-item');
        
        const img = document.createElement('img');
        img.src = 'images/diamond.png';
        img.classList.add('diamond-image');
        
        const overlay = document.createElement('div');
        overlay.classList.add('diamond-overlay');
        
        item.appendChild(img);
        item.appendChild(overlay);
        container.appendChild(item);
    }
}

function initializeKov(count) {
    const container = document.querySelector('.kov-container');
    if (!container) return;
    
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const item = document.createElement('div');
        item.classList.add('kov-item');
        
        const img = document.createElement('img');
        img.src = 'images/kov.png';
        img.classList.add('kov-image');
        
        const overlay = document.createElement('div');
        overlay.classList.add('kov-overlay');
        
        item.appendChild(img);
        item.appendChild(overlay);
        container.appendChild(item);
    }
}

function initializeGolds(count) {
    const container = document.querySelector('.golds-container');
    if (!container) return;
    
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const item = document.createElement('div');
        item.classList.add('gold-item');
        
        const img = document.createElement('img');
        img.src = 'images/gold.png';
        img.classList.add('gold-image');
        
        const overlay = document.createElement('div');
        overlay.classList.add('gold-overlay');
        
        item.appendChild(img);
        item.appendChild(overlay);
        container.appendChild(item);
    }
}

function updateDiamondDisplay() {
    const items = document.querySelectorAll('.diamond-item');
    for (let i = 0; i < diamondsCollected; i++) {
        if (items[i]) items[i].classList.add('collected');
    }
}

function updateKovDisplay() {
    const items = document.querySelectorAll('.kov-item');
    for (let i = 0; i < kovCollected; i++) {
        if (items[i]) items[i].classList.add('collected');
    }
}

function updateGoldDisplay() {
    const items = document.querySelectorAll('.gold-item');
    for (let i = 0; i < goldsCollected; i++) {
        if (items[i]) items[i].classList.add('collected');
    }
}

// ===============================
// VÍŤAZSTVO A KONIEC HRY
// ===============================

function checkWinCondition() {
    if (diamondsCollected === PocetGenDiamant && 
        goldsCollected === PocetGenGolds && 
        kovCollected === PocetGenKov) {
        setTimeout(handleLevelComplete, 100);
    }
}

function handleLevelComplete() {
    console.log('🎉 Level dokončený!');
    gameState.isPaused = true;
    
    const results = calculateResults();
    effectVyhra.play();
    showEndGameDialog(results);
}

function calculateResults() {
    const totalTime = Math.floor((Date.now() - gameState.gameStartTime) / 1000);
    let stars = 3;
    
    if (gameState.levelConfig.timeLimit) {
        const ratio = totalTime / gameState.levelConfig.timeLimit;
        if (ratio > 0.8) stars = Math.max(1, stars - 1);
        if (ratio > 0.9) stars = Math.max(1, stars - 1);
    }
    
    return { stars, time: totalTime, completed: true };
}

function showEndGameDialog(results) {
    const timer = document.getElementById('gameTimer');
    if (timer) timer.style.display = 'none';
    
    document.getElementById("endgame").style.display = "block";
    document.getElementById("blur-background").style.display = "block";
    document.body.style.overflow = "hidden";
    
    updateEndGameModal(results);
}

function updateEndGameModal(results) {
    const content = document.querySelector('#endgame .cvicenie-content');
    if (!content) return;
    
    const stars = '⭐'.repeat(results.stars) + '☆'.repeat(3 - results.stars);
    const time = formatTime(results.time);
    
    content.innerHTML = `
        <p>VYHRAL SI HRU!</p>
        <div style="margin: 20px 0; font-size: 18px;">
            <div style="margin-bottom: 10px;">
                <strong>Hodnotenie:</strong><br>
                <span style="font-size: 24px;">${stars}</span>
            </div>
            <div style="margin-bottom: 10px;">
                <strong>Čas:</strong> ${time}
            </div>
            <div style="margin-bottom: 20px;">
                <strong>Level:</strong> ${gameState.levelConfig.name}
            </div>
        </div>
        <p style="font-size: 16px;">Chceš pokračovať?</p>
        <div class="gameend">
            <button onclick="goToNextLevel()" style="background: #4CAF50; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 16px; margin: 5px;">
                Ďalší level
            </button>
            <button onclick="restartLevel()" style="background: #FF9800; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 16px; margin: 5px;">
                Hrať znova
            </button>
            <button onclick="returnToLevelSelector()" style="background: #2196F3; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 16px; margin: 5px;">
                Výber levelov
            </button>
        </div>
    `;
    
    window.currentGameResults = results;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ===============================
// NAVIGÁCIA
// ===============================

function goToNextLevel() {
    saveGameResults();
    if (window.gameRouter && gameState.levelConfig) {
        window.gameRouter.goToNextLevel(gameState.levelConfig.worldId, gameState.levelConfig.id);
    } else {
        returnToLevelSelector();
    }
}

function restartLevel() {
    if (window.gameRouter && gameState.levelConfig) {
        window.gameRouter.restartLevel(gameState.levelConfig.worldId, gameState.levelConfig.id);
    } else {
        location.reload();
    }
}

function returnToLevelSelector() {
    if (window.currentGameResults && window.currentGameResults.completed) {
        saveGameResults();
    }
    
    if (window.gameRouter && gameState.levelConfig) {
        window.gameRouter.returnToLevelSelector(gameState.levelConfig.worldId);
    } else {
        window.location.href = 'level-selector.html';
    }
}

function saveGameResults() {
    if (!window.currentGameResults || !gameState.levelConfig) {
        console.warn('Žiadne výsledky na uloženie');
        return;
    }
    
    console.log('💾 Ukladám výsledky:', window.currentGameResults);
    
    if (window.gameRouter) {
        window.gameRouter.completeLevel(
            gameState.levelConfig.worldId,
            gameState.levelConfig.id,
            window.currentGameResults
        );
    }
}

// ===============================
// POSLUCHOVÉ CVIČENIE
// ===============================

function showInfoDialog() {
    console.log('🔊 Otváram posluchové cvičenie...');
    // NESTAVAJ gameState.isPaused = true; !!
    
    document.getElementById('zvuky').style.display = 'block';
    document.getElementById("blur-background").style.display = "block";
    document.body.style.overflow = "hidden";
    minigame();
}

function minigame() {
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
            createButtons();
        } else {
            endGame();
        }
    }

    function playRandomSounds() {
        const randomFolder = Math.floor(Math.random() * 15) + 1;
        const soundFolder = `zvuky/${randomFolder}/`;
        const allSounds = ['1.wav', '2.wav'];
        [index1, index2] = getRandomIndexes(allSounds.length);
        
        sound1 = new Howl({ src: [`${soundFolder}${allSounds[index1]}`] });
        sound2 = new Howl({ src: [`${soundFolder}${allSounds[index2]}`] });
        
        sound1.play();
        displayMessage('PREHRÁVA SA ZVUK');
        
        sound1.on('end', () => {
            setTimeout(() => {
                sound2.play();
            }, 500);
        });
    }

    function getRandomIndexes(length) {
        const index1 = Math.floor(Math.random() * length);
        const index2 = Math.floor(Math.random() * length);
        return [index1, index2];
    }

    function displayMessage(message) {
        const dialogBox = document.querySelector('.cvicenie-content-2');
        if (dialogBox) {
            dialogBox.innerHTML = `
                <p>ROZPOZNAJ SLOVÁ</p>
                <p style="font-size:20px;">${message}</p>
                <p>Sú slová rovnaké?</p>
                <center><div id="buttonsContainer"></div></center>
            `;
        }
    }

    function createButtons() {
        let container = document.getElementById('buttonsContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'buttonsContainer';
        } else {
            container.innerHTML = '';
        }

        const sameButton = document.createElement('img');
        sameButton.src = 'images/rovnake.png';
        sameButton.alt = 'Rovnaké';
        sameButton.addEventListener('click', () => evaluateGuess(true));

        const differentButton = document.createElement('img');
        differentButton.src = 'images/rozdielne.png';
        differentButton.alt = 'Rozdielne';
        differentButton.addEventListener('click', () => evaluateGuess(false));

        container.appendChild(sameButton);
        container.appendChild(differentButton);

        if (!document.getElementById('buttonsContainer')) {
            document.body.appendChild(container);
        }
    }

    function evaluateGuess(isSame) {
        if (sound1) sound1.stop();
        if (sound2) sound2.stop();

        if ((isSame && index1 === index2) || (!isSame && index1 !== index2)) {
            correctGuesses++;
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
            console.log('✅ Posluchové cvičenie úspešné - ničím kov');
            // Úspech - znič kov na cieľovej pozícii  
            kov.forEach(k => {
                if (k.x / blockSize === targetBlockX && k.y / blockSize === targetBlockY && !k.destroyed) {
                    k.destroyed = true;
                    kovCollected++;
                    effectzlato.play();
                    updateKovDisplay();
                    checkWinCondition();
                    spaceBarPressed = 0;
                    console.log(`🔩 Kov destroyed! Total: ${kovCollected}/${PocetGenKov}`);
                }
            });
        } else {
            console.log('❌ Posluchové cvičenie neúspešné');
            spaceBarPressed = 0;
        }

        displayMessage(message);
        
        setTimeout(() => {
            document.getElementById('zvuky').style.display = 'none';
            document.getElementById("blur-background").style.display = "none";
            document.body.style.overflow = "auto";
            // NESTAVAJ gameState.isPaused = false; - už je false
            console.log('🎮 Posluchové cvičenie zatvorené, hra pokračuje...');
        }, 1000);
    }

    startGame();
}

// ===============================
// MOBILNÉ OVLÁDANIE
// ===============================

document.getElementById('up')?.addEventListener('click', function() {
    if (gameState.isPaused) return;
    if (playerY - blockSize >= 0) {
        playerY -= blockSize;
        playerRotation = 0;
        playerDirection = 'front';
    }
});

document.getElementById('left')?.addEventListener('click', function() {
    if (gameState.isPaused) return;
    if (playerX - blockSize >= 0) {
        playerX -= blockSize;
        playerRotation = 270;
        playerDirection = 'vlavo';
    }
});

document.getElementById('down')?.addEventListener('click', function() {
    if (gameState.isPaused) return;
    if (playerY + blockSize < 800) {
        playerY += blockSize;
        playerRotation = 180;
        playerDirection = 'front';
    }
});

document.getElementById('right')?.addEventListener('click', function() {
    if (gameState.isPaused) return;
    if (playerX + blockSize < 800) {
        playerX += blockSize;
        playerRotation = 90;
        playerDirection = 'vpravo';
    }
});

document.getElementById('pickaxe')?.addEventListener('click', function() {
    if (gameState.isPaused) return;
    destroyBlock();
    animateDigging();
});

// ===============================
// MIKROFÓN A ROZPOZNÁVANIE
// ===============================

function getLocalStream() {
    navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then((stream) => {
            window.localStream = stream;
            if (window.localAudio) {
                window.localAudio.srcObject = stream;
                window.localAudio.autoplay = true;
            }
        })
        .catch((err) => {
            console.error('Chyba mikrofónu:', err);
        });
}

// ===============================
// ERROR HANDLING
// ===============================

function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 0, 0, 0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        z-index: 10000;
        font-family: Arial, sans-serif;
    `;
    errorDiv.innerHTML = `<h3>Chyba</h3><p>${message}</p>`;
    document.body.appendChild(errorDiv);
}

// ===============================
// GLOBÁLNE FUNKCIE PRE HTML
// ===============================

window.goToNextLevel = goToNextLevel;
window.restartLevel = restartLevel;
window.returnToLevelSelector = returnToLevelSelector;
window.rozpoznanieS = rozpoznanieS;

// ===============================
// SPUSTENIE HRY
// ===============================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 DOM načítaný, čakám na game router...');
    
    // Inicializuj mikrofón
    getLocalStream();
    
    // Event listener pre rozpoznávanie
    const rozpoznanie = document.getElementById('rozpoznanie');
    if (rozpoznanie) {
        rozpoznanie.addEventListener('click', rozpoznanieS);
    }
    
    // Počkaj na game router s postupným checkovaním
    function waitForGameRouter() {
        console.log('🔍 Kontrolujem dostupnosť závislostí...');
        console.log('- window.gameRouter:', !!window.gameRouter);
        console.log('- typeof getWorldConfig:', typeof getWorldConfig);
        console.log('- typeof getLevelConfig:', typeof getLevelConfig);
        
        if (window.gameRouter && typeof window.gameRouter.initializeGameWithLevel === 'function') {
            console.log('✅ Všetky závislosti dostupné, spúšťam hru...');
            initializeGame();
        } else {
            console.log('⏳ Čakám na načítanie závislostí...');
            setTimeout(waitForGameRouter, 100);
        }
    }
    
    // Začni čakať na game router
    setTimeout(waitForGameRouter, 200);
});