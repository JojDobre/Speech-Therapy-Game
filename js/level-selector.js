/**
 * LEVEL SELECTOR - JavaScript logika
 * Správa výberu levelov v rámci sveta
 */

class LevelSelector {
    constructor() {
        // URL parametre
        this.urlParams = new URLSearchParams(window.location.search);
        this.currentWorldId = this.urlParams.get('world') || 'world_r';
        
        // Elementy
        this.levelsContainer = document.getElementById('levelsContainer');
        this.loadingScreen = document.getElementById('loadingScreen');
        
        // Modals
        this.lockedLevelModal = document.getElementById('lockedLevelModal');
        this.levelInfoModal = document.getElementById('levelInfoModal');
        this.worldSettingsModal = document.getElementById('worldSettingsModal');
        
        // Dáta
        this.currentWorld = null;
        this.worldLevels = [];
        this.playerProgress = null;
        this.currentFilter = 'all';
        this.selectedLevelId = null;
        
        // Inicializácia
        this.init();
    }

    /**
     * Inicializácia level selectora
     */
    async init() {
        try {
            console.log(`Inicializujem level selector pre svet: ${this.currentWorldId}`);
            
            // Zobraz loading
            this.showLoading(true);
            
            // Načítaj konfigurácie
            await this.loadConfigurations();
            
            // Načítaj pokrok hráča
            await this.loadPlayerProgress();
            
            // Aktualizuj navigáciu
            this.updateNavigation();
            
            // Vygeneruj levely
            this.generateLevels();
            
            // Nastav event listenery
            this.setupEventListeners();
            
            // Skry loading
            this.showLoading(false);
            
            console.log('Level selector úspešne inicializovaný');
            
        } catch (error) {
            console.error('Chyba pri inicializácii level selectora:', error);
            this.showError('Nepodarilo sa načítať levely');
        }
    }

    /**
     * Načítanie konfiguračných súborov
     */
    async loadConfigurations() {
        console.log('Načítavam konfigurácie...');
        
        // Načítaj svet
        if (typeof getWorldConfig === 'function') {
            this.currentWorld = getWorldConfig(this.currentWorldId);
            if (!this.currentWorld) {
                throw new Error(`Svet ${this.currentWorldId} neexistuje`);
            }
        } else {
            throw new Error('Konfigurácia svetov nie je dostupná');
        }
        
        // Načítaj levely sveta
        if (typeof getWorldLevels === 'function') {
            this.worldLevels = getWorldLevels(this.currentWorldId);
            console.log(`Načítaných ${this.worldLevels.length} levelov pre svet ${this.currentWorldId}`);
        } else {
            throw new Error('Konfigurácia levelov nie je dostupná');
        }
    }

    /**
     * Načítanie pokroku hráča
     */
    async loadPlayerProgress() {
        console.log('Načítavam pokrok hráča...');
        
        if (window.progressManager) {
            this.playerProgress = window.progressManager.getProgress();
            console.log('Pokrok načítaný z progressManagera');
        } else {
            throw new Error('ProgressManager nie je dostupný');
        }
    }

    /**
     * Aktualizácia navigácie
     */
    updateNavigation() {
        const worldProgress = this.playerProgress.worlds[this.currentWorldId];
        const maxStars = this.worldLevels.length * 3; // 3 hviezdy na level
        
        // Aktualizuj elementy navigácie
        document.getElementById('worldIconNav').src = this.currentWorld.icon;
        document.getElementById('worldLetterNav').textContent = this.currentWorld.name;
        document.getElementById('worldTitleNav').textContent = this.currentWorld.title;
        document.getElementById('worldProgressNav').textContent = 
            `${worldProgress.completedLevels}/${this.worldLevels.length} levelov`;
        document.getElementById('worldStarsNav').textContent = 
            `${worldProgress.stars}/${maxStars}`;
        
        // Nastav farbu ikony sveta
        const worldIcon = document.getElementById('worldIconNav').parentElement;
        worldIcon.style.backgroundColor = this.currentWorld.color;
    }

    /**
     * Generovanie levelov
     */
    generateLevels() {
        console.log('Generujem levely...');
        
        this.levelsContainer.innerHTML = '';
        
        // Filtrovanie levelov podľa typu hry
        const filteredLevels = this.currentFilter === 'all' 
            ? this.worldLevels 
            : this.worldLevels.filter(level => level.gameType === this.currentFilter);
        
        if (filteredLevels.length === 0) {
            this.levelsContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; color: white; padding: 40px;">
                    <h3>Žiadne levely</h3>
                    <p>Pre filter "${this.getFilterName(this.currentFilter)}" nie sú dostupné žiadne levely.</p>
                </div>
            `;
            return;
        }
        
        filteredLevels.forEach(level => {
            const levelElement = this.createLevelElement(level);
            this.levelsContainer.appendChild(levelElement);
        });
    }

    /**
     * Vytvorenie HTML elementu pre level
     */
    createLevelElement(level) {
        // Získaj pokrok levelu (s automatickou inicializáciou)
        let levelProgress = null;
        if (window.progressManager) {
            levelProgress = window.progressManager.getLevelProgress(this.currentWorldId, level.id);
        }
        
        // Použij defaultné hodnoty ak pokrok neexistuje
        const isUnlocked = levelProgress ? levelProgress.isUnlocked : (level.levelNumber === 1 && this.currentWorldId === 'world_r');
        const userStars = levelProgress ? levelProgress.stars : 0;
        const isCompleted = levelProgress ? levelProgress.completed : false;
        const bestTime = levelProgress ? levelProgress.bestTime : null;

        // Vytvor hlavný kontajner
        const levelCard = document.createElement('div');
        levelCard.className = 'level-card';
        levelCard.dataset.levelId = level.id;
        
        // Pridaj triedy podľa stavu
        if (!isUnlocked) {
            levelCard.classList.add('locked');
        }
        if (isCompleted) {
            levelCard.classList.add('completed');
        }

        levelCard.innerHTML = `
            <div class="level-number">${level.levelNumber}</div>
            
            <div class="level-game-type">
                <img src="images/${this.getGameTypeIcon(level.gameType)}" alt="${level.gameType}">
            </div>
            
            <div class="level-name">${level.name}</div>
            
            <div class="level-difficulty">
                ${this.generateDifficultyStars(level.difficulty)}
            </div>
            
            <div class="level-user-stars">
                ${this.generateUserStars(userStars)}
            </div>
            
            ${bestTime ? `<div class="level-best-time">Najlepší čas: ${this.formatTime(bestTime)}</div>` : ''}
            
            ${level.timeLimit ? `<div class="time-limit-indicator">${Math.floor(level.timeLimit / 60)}min</div>` : ''}
            
            ${!isUnlocked ? '<div class="locked-indicator">🔒</div>' : ''}
        `;

        return levelCard;
    }

    /**
     * Získanie ikony pre typ hry
     */
    getGameTypeIcon(gameType) {
        const icons = {
            'banik': 'banik-icon.png',
            'pexeso': 'pexeso-icon.png',
            'mario': 'mario-icon.png'
        };
        return icons[gameType] || 'default-icon.png';
    }

    /**
     * Generovanie hviezd obtiažnosti
     */
    generateDifficultyStars(difficulty) {
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            const filled = i <= difficulty ? 'filled' : '';
            starsHtml += `<div class="difficulty-star ${filled}"></div>`;
        }
        return starsHtml;
    }

    /**
     * Generovanie hviezd hráča
     */
    generateUserStars(userStars) {
        let starsHtml = '';
        for (let i = 1; i <= 3; i++) {
            const earned = i <= userStars ? 'earned' : '';
            starsHtml += `<div class="user-star ${earned}"></div>`;
        }
        return starsHtml;
    }

    /**
     * Formátovanie času
     */
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Získanie názvu filtra
     */
    getFilterName(filter) {
        const names = {
            'all': 'Všetky levely',
            'banik': 'Baník',
            'pexeso': 'Pexeso',
            'mario': 'Mario'
        };
        return names[filter] || filter;
    }

    /**
     * Nastavenie event listenerov
     */
    setupEventListeners() {
        console.log('Nastavujem event listenery...');

        // Kliknutie na level
        this.levelsContainer.addEventListener('click', (e) => {
            const levelCard = e.target.closest('.level-card');
            if (levelCard) {
                const levelId = levelCard.dataset.levelId;
                this.handleLevelClick(levelId);
            }
        });

        // Filter tlačidlá
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filterType = e.currentTarget.dataset.type;
                this.setFilter(filterType);
            });
        });

        // Navigačné tlačidlá
        document.getElementById('worldInfoBtn').addEventListener('click', () => {
            this.showWorldInfo();
        });

        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showModal('worldSettingsModal');
        });

        // Modal event listenery
        this.setupModalListeners();
    }

    /**
     * Nastavenie modal event listenerov
     */
    setupModalListeners() {
        // Zatvorenie modalov - použijem konkrétnejšie selektory
        document.getElementById('closeLockModal').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.hideModal('lockedLevelModal');
        });

        document.getElementById('closeLockModalBtn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.hideModal('lockedLevelModal');
        });

        document.getElementById('closeLevelInfoModal').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.hideModal('levelInfoModal');
        });

        document.getElementById('closeLevelInfoModalBtn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.hideModal('levelInfoModal');
        });

        document.getElementById('closeSettingsModal').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.hideModal('worldSettingsModal');
        });

        document.getElementById('closeSettingsModalBtn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.hideModal('worldSettingsModal');
        });

        // Špecifické tlačidlá
        document.getElementById('goToPreviousLevel').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.goToPreviousLevel();
        });

        document.getElementById('playLevelBtn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.playLevel(this.selectedLevelId);
        });

        document.getElementById('saveSettingsBtn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.saveSettings();
        });

        document.getElementById('resetWorldProgress').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.resetWorldProgress();
        });

        // Zatvorenie modalu kliknutím mimo obsah - OPRAVENÉ
        document.addEventListener('click', (e) => {
            // Kontroluj iba ak je klik priamo na modal backdrop
            if (e.target.classList.contains('modal')) {
                this.hideAllModals();
            }
        });

        // ESC klávesa
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAllModals();
            }
        });
    }

    /**
     * Spracovanie kliknutia na level
     */
    handleLevelClick(levelId) {
        console.log(`Kliknutie na level: ${levelId}`);
        
        const level = this.worldLevels.find(l => l.id === levelId);
        if (!level) {
            console.error(`Level ${levelId} sa nenašiel`);
            return;
        }

        // Získaj pokrok levelu
        let levelProgress = null;
        if (window.progressManager) {
            levelProgress = window.progressManager.getLevelProgress(this.currentWorldId, levelId);
        }
        
        const isUnlocked = levelProgress ? levelProgress.isUnlocked : (level.levelNumber === 1 && this.currentWorldId === 'world_r');

        console.log(`Level ${levelId} je ${isUnlocked ? 'odomknutý' : 'zamknutý'}`);

        if (!isUnlocked) {
            this.showLockedLevelModal(level);
        } else {
            this.showLevelInfoModal(level);
        }
    }

    /**
     * Zobrazenie modalu pre zamknutý level
     */
    showLockedLevelModal(level) {
        const prevLevel = this.worldLevels.find(l => l.levelNumber === level.levelNumber - 1);
        
        document.getElementById('lockLevelMessage').textContent = 
            `Na odomknutie levelu "${level.name}" musíš dokončiť predchádzajúci level.`;
        
        if (prevLevel) {
            document.getElementById('levelRequirementInfo').innerHTML = `
                <div style="margin-top: 15px;">
                    <strong>Potrebuješ dokončiť:</strong><br>
                    Level ${prevLevel.levelNumber}: ${prevLevel.name}
                </div>
            `;
        }

        this.showModal('lockedLevelModal');
    }

    /**
     * Zobrazenie informačného modalu o leveli
     */
    showLevelInfoModal(level) {
        this.selectedLevelId = level.id;
        
        // Získaj pokrok levelu
        let levelProgress = null;
        if (window.progressManager) {
            levelProgress = window.progressManager.getLevelProgress(this.currentWorldId, level.id);
        }
        
        document.getElementById('levelInfoTitle').textContent = `Level ${level.levelNumber}: ${level.name}`;
        document.getElementById('levelNumberInfo').textContent = level.levelNumber;
        document.getElementById('levelNameInfo').textContent = level.name;
        document.getElementById('levelDescriptionInfo').textContent = level.description || 'Precvičuj výslovnosť a rozvíjaj svoje rečové schopnosti!';
        document.getElementById('levelGameType').textContent = this.getGameTypeName(level.gameType);
        document.getElementById('levelTypeIcon').src = `images/${this.getGameTypeIcon(level.gameType)}`;
        
        // Obtiažnosť
        document.getElementById('levelDifficulty').innerHTML = this.generateDifficultyStars(level.difficulty);
        
        // Hviezdy hráča
        const userStars = levelProgress ? levelProgress.stars : 0;
        document.getElementById('levelUserStars').innerHTML = `<div class="user-stars">${this.generateUserStars(userStars)}</div>`;
        
        // Najlepší čas
        const bestTime = levelProgress ? levelProgress.bestTime : null;
        document.getElementById('levelBestTime').textContent = bestTime ? this.formatTime(bestTime) : '--:--';
        
        // Slová na precvičovanie
        this.displayWordsPreview(level.words);

        this.showModal('levelInfoModal');
    }

    /**
     * Zobrazenie náhľadu slov
     */
    displayWordsPreview(words) {
        const wordsContainer = document.getElementById('wordsPreviewList');
        wordsContainer.innerHTML = '';
        
        words.forEach(word => {
            const wordTag = document.createElement('div');
            wordTag.className = 'word-tag';
            wordTag.textContent = word;
            wordsContainer.appendChild(wordTag);
        });
    }

    /**
     * Získanie názvu typu hry
     */
    getGameTypeName(gameType) {
        const names = {
            'banik': 'Baník',
            'pexeso': 'Pexeso',
            'mario': 'Mario'
        };
        return names[gameType] || gameType;
    }

    /**
     * Nastavenie filtra
     */
    setFilter(filterType) {
        this.currentFilter = filterType;
        
        // Aktualizuj aktívne tlačidlo
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-type="${filterType}"]`).classList.add('active');
        
        // Regeneruj levely
        this.generateLevels();
    }

    /**
     * Spustenie levelu
     */
    playLevel(levelId) {
        console.log(`Spúšťam level: ${levelId}`);
        
        const level = this.worldLevels.find(l => l.id === levelId);
        if (!level) return;

        // Ulož aktuálny level do localStorage
        localStorage.setItem('currentLevel', JSON.stringify({
            worldId: this.currentWorldId,
            levelId: levelId,
            timestamp: new Date().toISOString()
        }));

        this.hideAllModals();

        // Presmeruj na správnu hru
        if (typeof window.gameRouter !== 'undefined') {
            window.gameRouter.startLevel(this.currentWorldId, levelId);
        } else {
            // Fallback - použij jednoduchý routing
            this.redirectToGame(level.gameType, levelId);
        }
    }

    /**
     * Jednoduchý routing na hry
     */
    redirectToGame(gameType, levelId) {
        const gameUrls = {
            'banik': `game.html?level=${levelId}`,
            'pexeso': `pexeso.html?level=${levelId}`,
            'mario': `mario.html?level=${levelId}`
        };
        
        const url = gameUrls[gameType];
        if (url) {
            window.location.href = url;
        } else {
            console.error(`Neznámy typ hry: ${gameType}`);
            alert('Táto hra ešte nie je implementovaná!');
        }
    }

    /**
     * Prejsť na predchádzajúci level
     */
    goToPreviousLevel() {
        // Nájdi posledný odomknutý level
        const unlockedLevels = this.worldLevels.filter(level => {
            const progress = this.playerProgress.worlds[this.currentWorldId].levels[level.id];
            return progress && progress.isUnlocked;
        });

        if (unlockedLevels.length > 0) {
            const lastUnlocked = unlockedLevels[unlockedLevels.length - 1];
            this.hideAllModals();
            this.playLevel(lastUnlocked.id);
        }
    }

    /**
     * Zobrazenie informácií o svete
     */
    showWorldInfo() {
        alert(`Informácie o svete ${this.currentWorld.title}:\n\n${this.currentWorld.description}`);
    }

    /**
     * Uloženie nastavení
     */
    saveSettings() {
        const settings = {
            soundEnabled: document.getElementById('soundEnabled').checked,
            musicEnabled: document.getElementById('musicEnabled').checked,
            difficulty: document.getElementById('difficultyLevel').value
        };

        // Ulož do progressManagera
        if (window.progressManager) {
            window.progressManager.getProgress().settings = {
                ...window.progressManager.getProgress().settings,
                ...settings
            };
            window.progressManager.saveProgress();
        }

        this.hideAllModals();
        console.log('Nastavenia uložené:', settings);
    }

    /**
     * Resetovanie pokroku sveta
     */
    resetWorldProgress() {
        if (confirm(`Naozaj chceš resetovať všetok pokrok v svete "${this.currentWorld.title}"? Táto akcia sa nedá vrátiť späť!`)) {
            if (window.progressManager) {
                const worldProgress = window.progressManager.getProgress().worlds[this.currentWorldId];
                
                // Resetuj štatistiky sveta
                worldProgress.stars = 0;
                worldProgress.completedLevels = 0;
                worldProgress.bestTime = null;
                
                // Resetuj všetky levely okrem prvého
                Object.keys(worldProgress.levels).forEach(levelId => {
                    const level = worldProgress.levels[levelId];
                    const levelConfig = this.worldLevels.find(l => l.id === levelId);
                    
                    if (levelConfig && levelConfig.levelNumber === 1) {
                        // Prvý level zostane odomknutý
                        level.isUnlocked = true;
                        level.stars = 0;
                        level.completed = false;
                        level.bestTime = null;
                        level.attempts = 0;
                    } else {
                        // Ostatné levely sa zamknú
                        level.isUnlocked = false;
                        level.stars = 0;
                        level.completed = false;
                        level.bestTime = null;
                        level.attempts = 0;
                    }
                });
                
                window.progressManager.saveProgress();
                window.progressManager.updateOverallStatistics();
                
                // Aktualizuj UI
                this.updateNavigation();
                this.generateLevels();
                this.hideAllModals();
                
                alert('Pokrok sveta bol úspešne resetovaný!');
            }
        }
    }

    /**
     * Zobrazenie/skrytie loading obrazovky
     */
    showLoading(show) {
        if (show) {
            this.loadingScreen.classList.remove('hidden');
        } else {
            this.loadingScreen.classList.add('hidden');
        }
    }

    /**
     * Zobrazenie modalu
     */
    showModal(modalId) {
        console.log(`Zobrazujem modal: ${modalId}`);
        
        const modal = document.getElementById(modalId);
        if (modal) {
            // Najprv skry všetky ostatné modaly
            this.hideAllModals();
            
            // Potom zobraz požadovaný modal
            modal.style.display = 'block';
            modal.style.opacity = '0';
            
            // Animácia zobrazenia
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 10);
            
            console.log(`Modal ${modalId} zobrazený`);
        } else {
            console.error(`Modal ${modalId} sa nenašiel`);
        }
    }

    /**
     * Skrytie konkrétneho modalu
     */
    hideModal(modalId) {
        console.log(`Skrývam modal: ${modalId}`);
        
        const modal = document.getElementById(modalId);
        if (modal && modal.style.display === 'block') {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
            console.log(`Modal ${modalId} skrytý`);
        }
    }

    /**
     * Skrytie všetkých modalov
     */
    hideAllModals() {
        console.log('Skrývam všetky modaly');
        
        const modalIds = ['lockedLevelModal', 'levelInfoModal', 'worldSettingsModal'];
        modalIds.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal && modal.style.display === 'block') {
                modal.style.opacity = '0';
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            }
        });
    }

    /**
     * Zobrazenie chybovej hlášky
     */
    showError(message) {
        console.error('Chyba:', message);
        
        this.showLoading(false);
        
        this.levelsContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: white; padding: 40px;">
                <h2>Ups! Niečo sa pokazilo</h2>
                <p>${message}</p>
                <button onclick="location.reload()" style="
                    background: #4CAF50; 
                    color: white; 
                    border: none; 
                    padding: 12px 24px; 
                    border-radius: 8px; 
                    cursor: pointer;
                    font-size: 16px;
                ">
                    Skúsiť znova
                </button>
            </div>
        `;
    }
}

/**
 * Inicializácia po načítaní DOM
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM načítaný, inicializujem LevelSelector...');
    
    // Počkaj na načítanie konfiguračných súborov
    setTimeout(() => {
        new LevelSelector();
    }, 100);
});

/**
 * Debug funkcie
 */
window.debugLevelSelector = {
    unlockAllLevels: () => {
        if (window.progressManager) {
            const urlParams = new URLSearchParams(window.location.search);
            const worldId = urlParams.get('world') || 'world_r';
            const worldProgress = window.progressManager.getProgress().worlds[worldId];
            
            Object.keys(worldProgress.levels).forEach(levelId => {
                worldProgress.levels[levelId].isUnlocked = true;
            });
            
            window.progressManager.saveProgress();
            location.reload();
        }
    },
    
    completeLevel: (levelId, stars = 3) => {
        if (window.progressManager) {
            const urlParams = new URLSearchParams(window.location.search);
            const worldId = urlParams.get('world') || 'world_r';
            
            window.progressManager.updateLevelProgress(worldId, levelId, {
                stars: stars,
                completed: true,
                time: 120 // 2 minúty
            });
            
            location.reload();
        }
    }
};