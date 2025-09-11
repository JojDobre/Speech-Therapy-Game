/**
 * JavaScript súbor pre worldsmenu.html - spracovanie interaktívnych prvkov
 * Integrovaný s config/worlds.js a config/levels.js
 * Autor: Adam Reňak
 */

// Globálne premenné
let allWorlds = []; // Všetky svety z config/worlds.js
let currentWorldIndex = 0; // Index aktuálneho sveta (stred z 3 zobrazených)
let visibleWorldsStartIndex = 0; // Index prvého zo 3 zobrazených svetov
let currentSelectedWorld = null; // Aktuálne vybraný svet pre zobrazenie levelov
let playerProgress = null; // Pokrok hráča

// Čakanie na načítanie DOM obsahu
document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('load', function() {
        setTimeout(hideLoadingScreen, 1000); // Čaká 1 sekundu potom skryje
    });
    
    console.log('World menu načítané a pripravené na použitie');
    initializeWorldsMenu();
});

/**
 * Skrytie loading screen s animáciou
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// ===== INICIALIZÁCIA MENU SVETOV =====
async function initializeWorldsMenu() {
    console.log('Inicializujem worlds menu s config súbormi...');
    
    try {
        // Načítaj konfigurácie svetov
        await loadWorldsConfiguration();
        
        // Načítaj pokrok hráča
        loadPlayerProgress();
        
        // Nastaví počiatočný svet (najaktívnejší alebo prvý odomknutý)
        setInitialWorld();
        
        // Nastaví event listenery
        setupEventListeners();
        
        // Aktualizuje zobrazenie
        updateDisplay();
        
        console.log('Worlds menu úspešne inicializované');
    } catch (error) {
        console.error('Chyba pri inicializácii worlds menu:', error);
        // Fallback na základnú konfiguráciu
        setupFallbackConfiguration();
    }
}

/**
 * Načítanie konfigurácie svetov
 */
async function loadWorldsConfiguration() {
    console.log('Načítavam konfiguráciu svetov...');
    
    // Skontroluj či sú dostupné funkcie z config súborov
    if (typeof getAllWorlds === 'function') {
        allWorlds = getAllWorlds();
        console.log(`Načítaných ${allWorlds.length} svetov:`, allWorlds.map(w => w.name));
    } else {
        throw new Error('Funkcia getAllWorlds nie je dostupná');
    }
    
    // Inicializuj všetky svety ako odomknuté (podľa požiadavky)
    allWorlds.forEach(world => {
        world.isUnlocked = true; // Všetky svety sú odomknuté
    });
}

/**
 * Načítanie pokroku hráča
 */
function loadPlayerProgress() {
    console.log('Načítavam pokrok hráča...');
    
    // Pokús sa načítať z progressManager ak existuje
    if (window.progressManager) {
        playerProgress = window.progressManager.getProgress();
        console.log('Pokrok načítaný z progressManager');
        ensureAllWorldsUnlockedWithFirstLevel();
    } else {
        // Vytvor základný pokrok
        playerProgress = createDefaultProgress();
        console.log('Vytvorený základný pokrok');
    }
}

/**
 * Vytvorenie základného pokroku ak neexistuje progressManager
 */
function createDefaultProgress() {
    const progress = {
        worlds: {}
    };
    
    allWorlds.forEach(world => {
        progress.worlds[world.id] = {
            isUnlocked: true, // Všetky svety sú odomknuté
            totalStars: 0,
            completedLevels: 0,
            levels: {}
        };
        
        // Ak existuje getWorldLevels, pridaj levely
        if (typeof getWorldLevels === 'function') {
            const worldLevels = getWorldLevels(world.id);
            worldLevels.forEach((level, index) => {
                progress.worlds[world.id].levels[level.id] = {
                    isUnlocked: index === 0, // Prvý level je odomknutý
                    stars: 0,
                    completed: false
                };
            });
        }
    });
    
    return progress;
}

/**
 * Nastavenie počiatočného sveta
 */
function setInitialWorld() {
    console.log('Nastavujem počiatočný svet...');
    
    // Nájdi svet s najvyšším pokrokom alebo prvý odomknutý
    let bestWorldIndex = 0;
    let maxProgress = -1;
    
    allWorlds.forEach((world, index) => {
        if (world.isUnlocked && playerProgress.worlds[world.id]) {
            const worldProgress = playerProgress.worlds[world.id];
            const progress = worldProgress.completedLevels || 0;
            
            if (progress > maxProgress) {
                maxProgress = progress;
                bestWorldIndex = index;
            }
        }
    });
    
    currentWorldIndex = bestWorldIndex;
    currentSelectedWorld = allWorlds[currentWorldIndex];
    
    // Nastav visible worlds tak, aby bol vybraný svet v strede
    setVisibleWorldsForCenter(currentWorldIndex);
    
    console.log(`Počiatočný svet: ${currentSelectedWorld.name} (index: ${currentWorldIndex})`);
}

/**
 * NOVÁ FUNKCIA: Zabezpečenie, že všetky svety majú odomknuté prvé levely
 */
function ensureAllWorldsUnlockedWithFirstLevel() {
    console.log('Zabezpečujem odomknuté prvé levely pre všetky svety...');
    
    let needsSave = false;
    
    allWorlds.forEach(world => {
        // Zabezpeč, že svet je odomknutý
        if (!playerProgress.worlds[world.id]) {
            playerProgress.worlds[world.id] = {
                isUnlocked: true,
                totalStars: 0,
                completedLevels: 0,
                levels: {}
            };
            needsSave = true;
        } else if (!playerProgress.worlds[world.id].isUnlocked) {
            playerProgress.worlds[world.id].isUnlocked = true;
            needsSave = true;
            console.log(`Odomykam svet: ${world.name}`);
        }
        
        // Zabezpeč, že prvý level je odomknutý
        if (typeof getWorldLevels === 'function') {
            const worldLevels = getWorldLevels(world.id);
            if (worldLevels.length > 0) {
                const firstLevel = worldLevels[0];
                
                if (!playerProgress.worlds[world.id].levels[firstLevel.id]) {
                    playerProgress.worlds[world.id].levels[firstLevel.id] = {
                        isUnlocked: true,
                        stars: 0,
                        completed: false
                    };
                    needsSave = true;
                    console.log(`Odomykam prvý level ${firstLevel.id} v svete ${world.name}`);
                } else if (!playerProgress.worlds[world.id].levels[firstLevel.id].isUnlocked) {
                    playerProgress.worlds[world.id].levels[firstLevel.id].isUnlocked = true;
                    needsSave = true;
                    console.log(`Opravujem odomknutie prvého levelu ${firstLevel.id} v svete ${world.name}`);
                }
            }
        }
    });
    
    // Ulož zmeny ak boli nejaké
    if (needsSave && window.progressManager) {
        window.progressManager.saveProgress();
        console.log('Uložené opravy pokroku');
    }
}

/**
 * Nastavenie viditeľných svetov s vybraným svetom v strede
 */
function setVisibleWorldsForCenter(centerIndex) {
    visibleWorldsStartIndex = Math.max(0, centerIndex - 1);
    
    // Zabezpečí, aby sme mali vždy 3 svety ak je to možné
    if (visibleWorldsStartIndex + 2 >= allWorlds.length) {
        visibleWorldsStartIndex = Math.max(0, allWorlds.length - 3);
    }
}

/**
 * Event listenery pre checkboxy
 */
function setupTrainingModalListeners() {
    document.addEventListener('DOMContentLoaded', function() {
        const showLockedCheckbox = document.getElementById('show-locked-words');
        const showAllWorldsCheckbox = document.getElementById('show-all-worlds-words');
        
        if (showLockedCheckbox) {
            showLockedCheckbox.addEventListener('change', updateWordsDisplay);
        }
        
        if (showAllWorldsCheckbox) {
            showAllWorldsCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    // Keď je zaškrtnuté "všetky svety", automaticky zaškrtni aj "nenaučené slová"
                    showLockedCheckbox.checked = true;
                }
                updateWordsDisplay();
            });
        }
    });
}

/**
 * Nastavenie event listenerov pre training modal keď sa vytvára
 */
function setupTrainingModalEvents() {
    const showLockedCheckbox = document.getElementById('show-locked-words');
    const showAllWorldsCheckbox = document.getElementById('show-all-worlds-words');
    const closeBtn = document.getElementById('training-modal-close');
    const startBtn = document.getElementById('start-training-btn');
    
    console.log('Nastavujem event listenery pre training modal');
    
    if (showLockedCheckbox) {
        showLockedCheckbox.addEventListener('change', updateWordsDisplay);
        console.log('Show locked words checkbox listener nastavený');
    }
    
    if (showAllWorldsCheckbox) {
        showAllWorldsCheckbox.addEventListener('change', function() {
            console.log('Show all worlds checkbox clicked');
            if (this.checked) {
                showLockedCheckbox.checked = true;
            }
            updateWordsDisplay();
        });
        console.log('Show all worlds checkbox listener nastavený');
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeTrainingModal);
        console.log('Close button listener nastavený');
    }
    
    if (startBtn) {
        startBtn.addEventListener('click', startTrainingLevel);
        console.log('Start button listener nastavený');
    }
}

/**
 * Nastavenie event listenerov
 */
function setupEventListeners() {
    console.log('Nastavujem event listenery...');
    
    // Navigačné šípky
    const prevButton = document.getElementById('prev-world');
    const nextButton = document.getElementById('next-world');
    const banikButton = document.getElementById('banik-button');
    
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            navigateWorlds(-1);
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            navigateWorlds(1);
        });
    }

    if (banikButton) {
        banikButton.addEventListener('click', openTrainingModal);
    }
    
    // Tlačidlá svetov - pridajú sa dynamicky v updateWorldButtons()
    // Level cards - pridajú sa dynamicky v updateLevelsGrid()
    
    // Event listener pre level modal zatvorenie
    setupLevelModalListeners();
    setupTrainingModalListeners();
}

/**
 * Nastavenie listenerov pre level modal
 */
function setupLevelModalListeners() {
    // Zatvorenie modalu kliknutím na overlay
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('level-modal-overlay')) {
            closeLevelModal();
        }
    });
    
    // Zatvorenie modalu ESC klávesou
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLevelModal();
        }
    });
}

/**
 * Navigácia medzi svetmi (šípky)
 */
function navigateWorlds(direction) {
    console.log(`Navigujem svety: ${direction}`);
    
    // Posun visible worlds
    const newStartIndex = visibleWorldsStartIndex + direction;
    
    // Cyklická navigácia
    if (newStartIndex < 0) {
        visibleWorldsStartIndex = Math.max(0, allWorlds.length - 3);
    } else if (newStartIndex + 2 >= allWorlds.length) {
        visibleWorldsStartIndex = 0;
    } else {
        visibleWorldsStartIndex = newStartIndex;
    }
    
    // Aktualizuj display
    updateDisplay();
}

/**
 * Výber konkrétneho sveta (kliknutie na tlačidlo)
 */
function selectWorld(worldIndex) {
    console.log(`Vyberám svet: ${worldIndex}`);
    
    if (worldIndex >= 0 && worldIndex < allWorlds.length) {
        currentWorldIndex = worldIndex;
        currentSelectedWorld = allWorlds[worldIndex];
        updateDisplay();
    }
}

/**
 * Hlavná funkcia na aktualizáciu celého zobrazenia
 */
function updateDisplay() {
    console.log('Aktualizujem zobrazenie...');
    
    // Aktualizuj tlačidlá svetov (horná navigácia)
    updateWorldButtons();
    
    // Aktualizuj názov sveta
    updateWorldTitle();
    
    // Aktualizuj pozadie herného panelu
    updateGamePanelBackground();
    
    // Aktualizuj grid levelov
    updateLevelsGrid();
    
    // Aktualizuj počet hviezd
    updateStarsDisplay();
}

/**
 * Aktualizácia tlačidiel svetov (3 viditeľné)
 */
function updateWorldButtons() {
    const container = document.querySelector('.worlds-buttons-container');
    if (!container) return;
    
    // Vymaž existujúce tlačidlá
    container.innerHTML = '';
    
    // Vytvor 3 tlačidlá pre viditeľné svety
    for (let i = 0; i < 3 && (visibleWorldsStartIndex + i) < allWorlds.length; i++) {
        const worldIndex = visibleWorldsStartIndex + i;
        const world = allWorlds[worldIndex];
        
        const button = document.createElement('button');
        button.className = 'world-button';
        button.dataset.worldIndex = worldIndex;
        
        // Pridaj CSS triedu pre pozadie
        button.classList.add(`world-${world.name.toLowerCase()}`);
        
        // Ak je to aktuálne vybraný svet, pridaj active triedu
        if (worldIndex === currentWorldIndex) {
            button.classList.add('active');
        }
        
        // Vytvor span s písmenom
        const span = document.createElement('span');
        span.textContent = world.name; // Písmeno (napr. "R", "L", "S")
        button.appendChild(span);
        
        // Event listener
        button.addEventListener('click', () => {
            selectWorld(worldIndex);
        });
        
        container.appendChild(button);
    }
}

/**
 * Aktualizácia názvu sveta
 */
function updateWorldTitle() {
    const titleElement = document.getElementById('world-title');
    if (titleElement && currentSelectedWorld) {
        titleElement.textContent = `LEVELY ${currentSelectedWorld.name}`;
    }
}

/**
 * Aktualizácia pozadia herného panelu
 */
function updateGamePanelBackground() {
    const gamePanel = document.getElementById('game-panel');
    if (!gamePanel || !currentSelectedWorld) return;
    
    // Odstráni všetky world-bg triedy
    gamePanel.classList.remove(...Array.from(gamePanel.classList).filter(cls => cls.includes('world-') && cls.includes('-bg')));
    
    // Pridá novú background triedu
    const bgClass = `world-${currentSelectedWorld.name.toLowerCase()}-bg`;
    gamePanel.classList.add(bgClass);
}

/**
 * Aktualizácia gridu levelov
 */
function updateLevelsGrid() {
    const gridElement = document.getElementById('levels-grid');
    if (!gridElement || !currentSelectedWorld) return;
    
    console.log(`Aktualizujem levely pre svet: ${currentSelectedWorld.name}`);
    
    // Vymaž existujúce levely
    gridElement.innerHTML = '';
    
    // Načítaj levely pre aktuálny svet
    let worldLevels = [];
    if (typeof getWorldLevels === 'function') {
        worldLevels = getWorldLevels(currentSelectedWorld.id);
    }
    
    if (worldLevels.length === 0) {
        gridElement.innerHTML = `<p>Žiadne levely pre svet ${currentSelectedWorld.name}</p>`;
        return;
    }
    
    // Vygeneruj level cards
    worldLevels.forEach((level, index) => {
        const levelCard = createLevelCard(level, index + 1);
        gridElement.appendChild(levelCard);
    });
}

/**
 * Vytvorenie level card
 */
function createLevelCard(level, levelNumber) {
    const card = document.createElement('div');
    card.className = 'level-card';
    card.dataset.levelId = level.id;
    
    // Získaj pokrok levelu
    const levelProgress = playerProgress?.worlds?.[level.worldId]?.levels?.[level.id];
    const isUnlocked = levelProgress?.isUnlocked || false;
    const stars = levelProgress?.stars || 0;
    
    if (isUnlocked) {
        // Odomknutý level
        card.innerHTML = `
            <div class="level-number">
                <h1>${levelNumber}</h1>
            </div>
            <div class="level-stars">
                ${generateStarsHTML(stars)}
            </div>
        `;
        
        // Event listener na otvorenie modalu
        card.addEventListener('click', () => {
            openLevelModal(level, levelNumber);
        });
    } else {
        // Zamknutý level
        card.innerHTML = `
            <div class="lock">
                <img src="images/zamok.png" class="lock-image" alt="Zamknutý">
            </div>
            <div class="level-number">
                <h1>${levelNumber}</h1>
            </div>
            <div class="level-stars">
                ${generateStarsHTML(0)}
            </div>
        `;
    }
    
    return card;
}

/**
 * Generovanie HTML pre hviezdy
 */
function generateStarsHTML(stars) {
    let html = '';
    for (let i = 0; i < 3; i++) {
        const starClass = i < stars ? 'active-star' : 'deactive-star';
        html += `<img src="images/star_active.png" class="${starClass}" alt="Hviezda">`;
    }
    return html;
}

/**
 * Aktualizácia zobrazenia počtu hviezd
 */
function updateStarsDisplay() {
    const starsCountElement = document.getElementById('stars-count');
    if (!starsCountElement || !currentSelectedWorld || !playerProgress) return;
    
    const worldProgress = playerProgress.worlds[currentSelectedWorld.id];
    const currentStars = worldProgress?.stars || 0;
    
    // Spočítaj maximálny počet hviezd pre svet
    let maxStars = 0;
    if (typeof getWorldLevels === 'function') {
        const worldLevels = getWorldLevels(currentSelectedWorld.id);
        maxStars = worldLevels.length * 3; // 3 hviezdy za level
    }
    
    starsCountElement.textContent = currentStars;
    
    // Aktualizuj aj total
    const starsTotalElement = document.querySelector('.stars-total');
    if (starsTotalElement) {
        starsTotalElement.textContent = ` / ${maxStars}`;
    }
}

/**
 * Otvorenie modalu s detailami levelu
 */
function openLevelModal(level, levelNumber) {
    console.log(`Otváram modal pre level: ${level.name}`);
    
    // Vytvor modal ak neexistuje
    createLevelModalIfNotExists();
    
    // Naplň modal dátami
    populateLevelModal(level, levelNumber);
    
    // Zobraz modal
    const modal = document.getElementById('level-detail-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Zablokuj scrollovanie
    }
}

/**
 * Vytvorenie level modalu ak neexistuje
 */
function createLevelModalIfNotExists() {
    if (document.getElementById('level-detail-modal')) return;
    
    const modalHTML = `
        <div id="level-detail-modal" class="level-modal-overlay" style="display: none;">
            <div class="close" id="modal-close-btn">X</div>
            <div class="level-modal-content">
                <div class="level-modal-header">
                    <h2 id="modal-level-name">Názov levelu</h2>
                </div>
                <div class="level-modal-body">
                    <div class="level-info">
                        <p><strong>Svet:</strong> <span id="modal-world-name">-</span></p>
                        <p><strong>Typ hry:</strong> <span id="modal-game-type">-</span></p>
                        <p><strong>Slová na precvičovanie:</strong></p>
                        <div id="modal-words" class="words-list"></div>
                    </div>
                    <div class="level-progress">
                        <p><strong>Tvoj pokrok:</strong></p>
                        <div id="modal-stars" class="modal-stars"></div>
                        <p id="modal-best-time"><strong>Najlepší čas:</strong> --:--</p>
                    </div>
                </div>
                <div class="level-modal-footer">
                    <button id="modal-play-btn" class="btn-primary"><a>Spustiť level</a></button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Pridaj event listenery
    document.getElementById('modal-close-btn').addEventListener('click', closeLevelModal);
    document.getElementById('modal-play-btn').addEventListener('click', playSelectedLevel);
}

/**
 * Naplnenie modalu dátami levelu
 */
function populateLevelModal(level, levelNumber) {
    document.getElementById('modal-level-name').textContent = `Level ${levelNumber}`;
    document.getElementById('modal-world-name').textContent = currentSelectedWorld.title || currentSelectedWorld.name;
    document.getElementById('modal-game-type').textContent = getGameTypeName(level.gameType);
    
    // Slová
    const wordsContainer = document.getElementById('modal-words');
    wordsContainer.innerHTML = '';
    level.words.forEach(word => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word-tag';
        wordSpan.textContent = word;
        wordsContainer.appendChild(wordSpan);
    });
    
    // Pokrok
    const levelProgress = playerProgress?.worlds?.[level.worldId]?.levels?.[level.id];
    const stars = levelProgress?.stars || 0;
    const bestTime = levelProgress?.bestTime;
    
    document.getElementById('modal-stars').innerHTML = generateStarsHTML(stars);
    document.getElementById('modal-best-time').textContent = `Najlepší čas: ${bestTime ? formatTime(bestTime) : '--:--'}`;
    
    // Ulož aktuálny level pre play button
    document.getElementById('modal-play-btn').dataset.levelId = level.id;
}

/**
 * Získanie názvu typu hry
 */
function getGameTypeName(gameType) {
    const names = {
        'banik': 'Baník',
        'pexeso': 'Pexeso', 
        'mario': 'Super Mario'
    };
    return names[gameType] || gameType;
}

/**
 * Formátovanie času
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Zatvorenie level modalu
 */
function closeLevelModal() {
    const modal = document.getElementById('level-detail-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Obnoví scrollovanie
    }
}

/**
 * Spustenie vybraného levelu
 */
function playSelectedLevel() {
    const levelId = document.getElementById('modal-play-btn').dataset.levelId;
    if (!levelId) return;
    
    console.log(`Spúšťam level: ${levelId}`);
    
    closeLevelModal();
    
    // Pokús sa použiť gameRouter
    if (window.gameRouter && typeof window.gameRouter.startLevel === 'function') {
        window.gameRouter.startLevel(currentSelectedWorld.id, levelId);
    } else {
        // Fallback - priama navigácia s OPRAVENÝMI parametrami
        const level = getLevelConfig(levelId);
        if (level) {
            const gameUrls = {
                'banik': 'game.html',
                'pexeso': 'pexeso.html', 
                'mario': 'mario.html'
            };
            const url = gameUrls[level.gameType];
            if (url) {
                // OPRAVENÉ: worldId namiesto world, levelId namiesto level
                window.location.href = `${url}?worldId=${currentSelectedWorld.id}&levelId=${levelId}`;
                console.log(`Navigujem na: ${url}?worldId=${currentSelectedWorld.id}&levelId=${levelId}`);
            }
        }
    }
}

/**
 * Fallback konfigurácia ak config súbory nie sú dostupné
 */
function setupFallbackConfiguration() {
    console.warn('Používam fallback konfiguráciu');
    
    allWorlds = [
        { id: 'world_r', name: 'R', title: 'Svet písmena R', isUnlocked: true },
        { id: 'world_l', name: 'L', title: 'Svet písmena L', isUnlocked: true },
        { id: 'world_s', name: 'S', title: 'Svet písmena S', isUnlocked: true }
    ];
    
    playerProgress = createDefaultProgress();
    setInitialWorld();
    setupEventListeners();
    updateDisplay();
}

// ===== POMOCNÉ FUNKCIE =====

/**
 * Funkcia pre debugging
 */
function debugWorldsMenu() {
    console.log('=== WORLDS MENU DEBUG ===');
    console.log('Všetky svety:', allWorlds);
    console.log('Aktuálny svet:', currentSelectedWorld);
    console.log('Visible worlds start:', visibleWorldsStartIndex);
    console.log('Pokrok hráča:', playerProgress);
    console.log('========================');
}

// Export pre testovanie (ak je potrebné)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        selectWorld,
        navigateWorlds,
        debugWorldsMenu
    };
}


/**
 * Otvorenie training modalu
 */
function openTrainingModal() {
    console.log('Otváram trénovací modal pre svet:', currentSelectedWorld.name);
    
    // Vytvor modal ak neexistuje
    createTrainingModalIfNotExists();
    
    // Naplň modal dátami
    populateTrainingModal();

    // Nastav event listenery PO vytvorení modalu
    setupTrainingModalEvents();
    
    // Zobraz modal
    const modal = document.getElementById('training-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Vytvorenie training modalu ak neexistuje
 */
function createTrainingModalIfNotExists() {
    if (document.getElementById('training-modal')) return;
    
    // Modal HTML je už v HTML súbore, takže len pridáme event listenery
    document.addEventListener('DOMContentLoaded', function() {
        const closeBtn = document.getElementById('training-modal-close');
        const startBtn = document.getElementById('start-training-btn');
        const includeAllCheckbox = document.getElementById('include-all-words');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeTrainingModal);
        }
        
        if (startBtn) {
            startBtn.addEventListener('click', startTrainingLevel);
        }
        
        if (includeAllCheckbox) {
            includeAllCheckbox.addEventListener('change', toggleAllWords);
        }
    });
}

/**
 * Naplnenie training modalu dátami
 */
function populateTrainingModal() {
    // Aktualizuj názov sveta
    const wordsTitle = document.getElementById('words-section-title');
    if (wordsTitle) {
        wordsTitle.textContent = `Naučené slová zo sveta ${currentSelectedWorld.name}:`;
    }
    
    // Načítaj len slová z odomknutých levelov
    const unlockedWords = getUnlockedWorldWords();
    populateWordsList(unlockedWords);
    
    // Reset checkboxov
    document.getElementById('show-locked-words').checked = false;
    document.getElementById('show-all-worlds-words').checked = false;
    
    // Nastav predvolené hodnoty pre itemy
    document.getElementById('diamonds-count').value = 2;
    document.getElementById('golds-count').value = 3;
    document.getElementById('crystals-count').value = 1;
}

/**
 * Získanie slov len z odomknutých levelov aktuálneho sveta
 */
function getUnlockedWorldWords() {
    const unlockedWords = [];
    
    if (typeof getWorldLevels === 'function' && currentSelectedWorld) {
        const worldLevels = getWorldLevels(currentSelectedWorld.id);
        worldLevels.forEach(level => {
            const levelProgress = playerProgress?.worlds?.[level.worldId]?.levels?.[level.id];
            const isUnlocked = levelProgress?.isUnlocked || false;
            
            if (isUnlocked && level.words) {
                level.words.forEach(word => {
                    if (!unlockedWords.includes(word)) {
                        unlockedWords.push(word);
                    }
                });
            }
        });
    }
    
    return unlockedWords.sort();
}

/**
 * Získanie všetkých slov z aktuálneho sveta (vrátane zamknutých)
 */
function getAllCurrentWorldWords() {
    const allWords = [];
    
    if (typeof getWorldLevels === 'function' && currentSelectedWorld) {
        const worldLevels = getWorldLevels(currentSelectedWorld.id);
        worldLevels.forEach(level => {
            if (level.words) {
                level.words.forEach(word => {
                    if (!allWords.find(w => w.text === word)) {
                        const levelProgress = playerProgress?.worlds?.[level.worldId]?.levels?.[level.id];
                        const isUnlocked = levelProgress?.isUnlocked || false;
                        
                        allWords.push({
                            text: word,
                            isUnlocked: isUnlocked
                        });
                    }
                });
            }
        });
    }
    
    return allWords.sort((a, b) => a.text.localeCompare(b.text));
}

/**
 * Získanie všetkých slov zo všetkých svetov
 */
function getAllWorldsWords() {
    const allWords = [];
    
    if (typeof getWorldLevels === 'function') {
        allWorlds.forEach(world => {
            const worldLevels = getWorldLevels(world.id);
            worldLevels.forEach(level => {
                if (level.words) {
                    level.words.forEach(word => {
                        if (!allWords.find(w => w.text === word)) {
                            const levelProgress = playerProgress?.worlds?.[level.worldId]?.levels?.[level.id];
                            const isUnlocked = levelProgress?.isUnlocked || false;
                            
                            allWords.push({
                                text: word,
                                isUnlocked: isUnlocked,
                                world: world.name
                            });
                        }
                    });
                }
            });
        });
    }
    
    return allWords.sort((a, b) => a.text.localeCompare(b.text));
}

/**
 * Naplnenie zoznamu slov
 */
function populateWordsList(words) {
    const wordsContainer = document.getElementById('words-list');
    if (!wordsContainer) return;
    
    wordsContainer.innerHTML = '';
    
    if (typeof words[0] === 'string') {
        // Jednoduché slová (len text)
        words.forEach(word => {
            const wordElement = createWordElement(word, true);
            wordsContainer.appendChild(wordElement);
        });
    } else {
        // Objekty s dodatočnými informáciami
        words.forEach(wordObj => {
            const wordElement = createWordElement(wordObj.text, wordObj.isUnlocked, wordObj.world);
            wordsContainer.appendChild(wordElement);
        });
    }
}

/**
 * Vytvorenie elementu pre slovo
 */
function createWordElement(word, isUnlocked = true, worldName = null) {
    const wordElement = document.createElement('div');
    wordElement.className = 'word-item';
    wordElement.textContent = word;
    wordElement.dataset.word = word;
    
    // ODSTRÁNENÉ: locked styling - všetky slová sú klikateľné
    if (!isUnlocked) {
        wordElement.classList.add('locked');
        wordElement.title = 'Toto slovo je zo zamknutého levelu';
        // Ale stále povoľ kliknutie
    }
    
    if (worldName && worldName !== currentSelectedWorld.name) {
        wordElement.title = `Slovo zo sveta ${worldName}`;
    }
    
    // Event listener pre výber slova - funguje pre všetky slová
    wordElement.addEventListener('click', function() {
        console.log('Kliknuté na slovo:', word);
        if (this.classList.contains('selected')) {
            this.classList.remove('selected');
            console.log('Slovo odznačené:', word);
        } else {
            this.classList.add('selected');
            console.log('Slovo označené:', word);
        }
    });
    
    return wordElement;
}

/**
 * Aktualizácia zobrazenia slov na základe checkboxov
 */
function updateWordsDisplay() {
    const showLocked = document.getElementById('show-locked-words').checked;
    const showAllWorlds = document.getElementById('show-all-worlds-words').checked;
    const wordsTitle = document.getElementById('words-section-title');
    
    let words;
    let titleText;
    
    if (showAllWorlds) {
        words = getAllWorldsWords();
        titleText = showLocked ? 'Všetky slová zo všetkých svetov:' : 'Naučené slová zo všetkých svetov:';
        if (!showLocked) {
            words = words.filter(w => w.isUnlocked);
        }
    } else {
        if (showLocked) {
            words = getAllCurrentWorldWords();
            titleText = `Všetky slová zo sveta ${currentSelectedWorld.name}:`;
        } else {
            words = getUnlockedWorldWords();
            titleText = `Naučené slová zo sveta ${currentSelectedWorld.name}:`;
        }
    }
    
    wordsTitle.textContent = titleText;
    populateWordsList(words);
}

/**
 * Spustenie tréningového levelu - aktualizovaná verzia
 */
function startTrainingLevel() {
    // Zbieranie vybraných slov
    const selectedWordElements = document.querySelectorAll('#words-list .word-item.selected');
    const selectedWords = Array.from(selectedWordElements).map(el => el.dataset.word);
    
    if (selectedWords.length === 0) {
        alert('Prosím vyberte aspoň jedno slovo pre tréning!');
        return;
    }
    
    // Získanie nastavení počtu itemov
    const diamondsCount = parseInt(document.getElementById('diamonds-count').value) || 2;
    const goldsCount = parseInt(document.getElementById('golds-count').value) || 3;
    const crystalsCount = parseInt(document.getElementById('crystals-count').value) || 1;
    
    console.log('Spúšťam tréning:', {
        words: selectedWords,
        diamonds: diamondsCount,
        golds: goldsCount,
        crystals: crystalsCount
    });
    
    // Zatvor modal
    closeTrainingModal();
    
    // Vytvor custom levelConfig pre tréning
    const trainingLevelConfig = {
        words: selectedWords,
        diamonds: diamondsCount,
        golds: goldsCount,
        crystals: crystalsCount,
        timeLimit: null,
        isTraining: true
    };
    
    // Spusti hru s tréningovým levelom
    const gameUrl = `game.html?training=true&config=${encodeURIComponent(JSON.stringify(trainingLevelConfig))}`;
    window.location.href = gameUrl;
}

/**
 * Zatvorenie training modalu
 */
function closeTrainingModal() {
    const modal = document.getElementById('training-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}



function debugTrainingModal() {
    console.log('=== TRAINING MODAL DEBUG ===');
    console.log('Modal element:', document.getElementById('training-modal'));
    console.log('Close button:', document.getElementById('training-modal-close'));
    console.log('Start button:', document.getElementById('start-training-btn'));
    console.log('Show locked checkbox:', document.getElementById('show-locked-words'));
    console.log('Show all worlds checkbox:', document.getElementById('show-all-worlds-words'));
    console.log('Current selected world:', currentSelectedWorld);
    console.log('============================');
}