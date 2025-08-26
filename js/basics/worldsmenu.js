/**
 * JavaScript súbor pre worldsmenu.html - spracovanie interaktívnych prvkov
 * Autor: Adam Reňak
 */

// Konfigurácia svetov - zatiaľ základná
const WORLDS_CONFIG = {
    z: {
        name: "LEVELY Z",
        letter: "Z",
        levels: 15,
        description: "Cvičenie výslovnosti písmena Z"
    },
    s: {
        name: "LEVELY S", 
        letter: "S",
        levels: 20,
        description: "Cvičenie výslovnosti písmena S"
    },
    r: {
        name: "LEVELY R",
        letter: "R", 
        levels: 10,
        description: "Cvičenie výslovnosti písmena R"
    }
};

// Globálne premenné
let currentWorld = 's'; // Predvolený svet
let worldsArray = Object.keys(WORLDS_CONFIG); // ['z', 's', 'r']
let currentWorldIndex = worldsArray.indexOf(currentWorld);

// Čakanie na načítanie DOM obsahu
document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('load', function() {
        setTimeout(hideLoadingScreen, 1000); // Čaká 1 sekundu potom skryje
    });
    
    console.log('Menu načítané a pripravené na použitie');
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
function initializeWorldsMenu() {
    console.log('Inicializujem worlds menu...');
    
    // Nastaví event listenery pre navigačné šípky
    setupNavigationArrows();
    
    // Nastaví event listenery pre tlačidlá svetov
    setupWorldButtons();
    
    // Nastaví event listenery pre cvičné hry
    setupPracticeButtons();
    
    // Aktualizuje zobrazenie aktuálneho sveta
    updateWorldDisplay();
    
    console.log('Worlds menu inicializované');
}

// ===== NAVIGAČNÉ ŠÍPKY =====
function setupNavigationArrows() {
    const prevButton = document.getElementById('prev-world');
    const nextButton = document.getElementById('next-world');
    
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            navigateWorld(-1);
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            navigateWorld(1);
        });
    }
}

// Navigácia medzi svetmi
function navigateWorld(direction) {
    console.log('Navigujem svet:', direction);
    
    // Vypočíta nový index sveta
    currentWorldIndex += direction;
    
    // Zabezpečí cyklickú navigáciu
    if (currentWorldIndex < 0) {
        currentWorldIndex = worldsArray.length - 1;
    } else if (currentWorldIndex >= worldsArray.length) {
        currentWorldIndex = 0;
    }
    
    // Aktualizuje aktuálny svet
    currentWorld = worldsArray[currentWorldIndex];
    
    // Aktualizuje zobrazenie
    updateWorldDisplay();
}

// ===== TLAČIDLÁ SVETOV =====
function setupWorldButtons() {
    const worldButtons = document.querySelectorAll('.world-button');
    
    worldButtons.forEach(button => {
        button.addEventListener('click', () => {
            const worldId = button.getAttribute('data-world');
            selectWorld(worldId);
        });
    });
}

// Výber konkrétneho sveta
function selectWorld(worldId) {
    console.log('Vyberám svet:', worldId);
    
    if (WORLDS_CONFIG[worldId]) {
        currentWorld = worldId;
        currentWorldIndex = worldsArray.indexOf(worldId);
        updateWorldDisplay();
    }
}

// ===== AKTUALIZÁCIA ZOBRAZENIA =====
function updateWorldDisplay() {
    console.log('Aktualizujem zobrazenie sveta:', currentWorld);
    
    // Aktualizuje aktívne tlačidlo sveta
    updateActiveWorldButton();
    
    // Aktualizuje názov sveta
    updateWorldTitle();
    
    // Aktualizuje grid levelov
    updateLevelsGrid();
    
    // Aktualizuje počet hviezd (zatiaľ mock data)
    updateStarsDisplay();
}

// Aktualizuje aktívne tlačidlo sveta
function updateActiveWorldButton() {
    const worldButtons = document.querySelectorAll('.world-button');
    
    worldButtons.forEach(button => {
        const worldId = button.getAttribute('data-world');
        
        if (worldId === currentWorld) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Aktualizuje názov sveta v hlavičke
function updateWorldTitle() {
    const titleElement = document.getElementById('world-title');
    if (titleElement && WORLDS_CONFIG[currentWorld]) {
        titleElement.textContent = WORLDS_CONFIG[currentWorld].name;
    }
}

// Aktualizuje grid levelov - zatiaľ prázdny
function updateLevelsGrid() {
    const gridElement = document.getElementById('levels-grid');
    const gameWindow = document.getElementById('game-panel');

    if (gridElement && WORLDS_CONFIG[currentWorld]) {
        // Zatiaľ iba základný text, grid levelov vytvoríme neskôr
        gridElement.innerHTML = `
            <div class="level-card">
                <div class="level-number">
                    <h1>1</h1>
                </div>
                <div class="level-stars">
                    <div class="level-stars">
                        <img src="images/star_active.png" class="active-star">
                        <img src="images/star_active.png" class="active-star">
                        <img src="images/star_active.png" class="deactive-star">
                    </div>
                </div>
            </div>

            <div class="level-card">
                <div class="level-number">
                    <h1>2</h1>
                </div>
                <div class="level-stars">
                    <div class="level-stars">
                        <img src="images/star_active.png" class="deactive-star">
                        <img src="images/star_active.png" class="deactive-star">
                        <img src="images/star_active.png" class="deactive-star">
                    </div>
                </div>
            </div>

            <div class="level-card">
                <div class="lock">
                    <img src="images/zamok.png" class="lock-image">
                </div>
                <div class="level-number">
                    <h1>3</h1>
                </div>
                <div class="level-stars">
                    <div class="level-stars">
                        <img src="images/star_active.png" class="deactive-star">
                        <img src="images/star_active.png" class="deactive-star">
                        <img src="images/star_active.png" class="deactive-star">
                    </div>
                </div>
            </div>

            <div class="level-card">
                <div class="lock">
                    <img src="images/zamok.png" class="lock-image">
                </div>
                <div class="level-number">
                    <h1>4</h1>
                </div>
                <div class="level-stars">
                    <div class="level-stars">
                        <img src="images/star_active.png" class="deactive-star">
                        <img src="images/star_active.png" class="deactive-star">
                        <img src="images/star_active.png" class="deactive-star">
                    </div>
                </div>
            </div>

            <div class="level-card">
                <div class="lock">
                    <img src="images/zamok.png" class="lock-image">
                </div>
                <div class="level-number">
                    <h1>5</h1>
                </div>
                <div class="level-stars">
                    <div class="level-stars">
                        <img src="images/star_active.png" class="deactive-star">
                        <img src="images/star_active.png" class="deactive-star">
                        <img src="images/star_active.png" class="deactive-star">
                    </div>
                </div>
            </div>

            <div class="level-card">
                <div class="lock">
                    <img src="images/zamok.png" class="lock-image">
                </div>
                <div class="level-number">
                    <h1>6</h1>
                </div>
                <div class="level-stars">
                    <div class="level-stars">
                        <img src="images/star_active.png" class="deactive-star">
                        <img src="images/star_active.png" class="deactive-star">
                        <img src="images/star_active.png" class="deactive-star">
                    </div>
                </div>
            </div>

            <div class="level-card">
                <div class="lock">
                    <img src="images/zamok.png" class="lock-image">
                </div>
                <div class="level-number">
                    <h1>7</h1>
                </div>
                <div class="level-stars">
                    <div class="level-stars">
                        <img src="images/star_active.png" class="deactive-star">
                        <img src="images/star_active.png" class="deactive-star">
                        <img src="images/star_active.png" class="deactive-star">
                    </div>
                </div>
            </div>

            <div class="level-card">
                <div class="lock">
                    <img src="images/zamok.png" class="lock-image">
                </div>
                <div class="level-number">
                    <h1>8</h1>
                </div>
                <div class="level-stars">
                    <div class="level-stars">
                        <img src="images/star_active.png" class="deactive-star">
                        <img src="images/star_active.png" class="deactive-star">
                        <img src="images/star_active.png" class="deactive-star">
                    </div>
                </div>
            </div>

            <div>
                Levely pre svet ${WORLDS_CONFIG[currentWorld].letter}<br>
                Počet levelov: ${WORLDS_CONFIG[currentWorld].levels}
            </div>
        `;
    }

    // Aktualizuje pozadie game window
    if (gameWindow) {
        // Odstráni všetky predchádzajúce background triedy
        gameWindow.classList.remove('world-z-bg', 'world-s-bg', 'world-r-bg');
        
        // Pridá novú background triedu pre aktuálny svet
        gameWindow.classList.add(`world-${currentWorld}-bg`);
    }
}

// Aktualizuje zobrazenie počtu hviezd
function updateStarsDisplay() {
    const starsCountElement = document.getElementById('stars-count');
    if (starsCountElement) {
        // Zatiaľ mock data, neskôr načítame z localStorage
        const mockStars = {
            z: 12,
            s: 20, 
            r: 8
        };
        
        starsCountElement.textContent = mockStars[currentWorld] || 0;
    }
}

// ===== CVIČNÉ HRY =====
function setupPracticeButtons() {
    const pexesoButton = document.getElementById('pexeso-button');
    const banikButton = document.getElementById('banik-button');
    
    if (pexesoButton) {
        pexesoButton.addEventListener('click', () => {
            console.log('Spúšťam cvičné pexeso pre svet:', currentWorld);
            // TODO: Implementovať spustenie pexeso hry
            alert(`Spúšťam pexeso pre písmeno ${WORLDS_CONFIG[currentWorld].letter}`);
        });
    }
    
    if (banikButton) {
        banikButton.addEventListener('click', () => {
            console.log('Spúšťam cvičnú baník hru pre svet:', currentWorld);
            // TODO: Implementovať spustenie baník hry
            alert(`Spúšťam baník hru pre písmeno ${WORLDS_CONFIG[currentWorld].letter}`);
        });
    }
}

// ===== POMOCNÉ FUNKCIE =====

// Funkcia pre debugging
function debugWorldsMenu() {
    console.log('=== WORLDS MENU DEBUG ===');
    console.log('Aktuálny svet:', currentWorld);
    console.log('Index sveta:', currentWorldIndex);
    console.log('Konfigurácia sveta:', WORLDS_CONFIG[currentWorld]);
    console.log('========================');
}

// Export pre testovanie (ak je potrebné)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        WORLDS_CONFIG,
        selectWorld,
        navigateWorld,
        debugWorldsMenu
    };
}