/**
 * WORLDS MENU - JavaScript logika
 * Správa menu svetov, zobrazovanie pokroku a navigácia
 */

class WorldsMenu {
    constructor() {
        // Základné elementy
        this.worldsContainer = document.getElementById('worldsContainer');
        this.loadingScreen = document.getElementById('loadingScreen');
        this.totalStarsElement = document.getElementById('totalStars');
        this.completionPercentageElement = document.getElementById('completionPercentage');
        
        // Modal elementy
        this.lockedWorldModal = document.getElementById('lockedWorldModal');
        this.worldInfoModal = document.getElementById('worldInfoModal');
        
        // Dáta
        this.worlds = [];
        this.playerProgress = {};
        
        // Inicializácia
        this.init();
    }

    /**
     * Inicializácia menu svetov
     */
    async init() {
        try {
            console.log('Inicializujem worlds menu...');
            
            // Zobraz loading obrazovku
            this.showLoading(true);
            
            // Načítaj konfigurácie
            await this.loadConfigurations();
            
            // Načítaj pokrok hráča
            await this.loadPlayerProgress();
            
            // Aktualizuj stav odomknutých svetov
            this.updateWorldUnlockStatus();
            
            // Vygeneruj svety
            this.generateWorlds();
            
            // Nastav event listenery
            this.setupEventListeners();
            
            // Aktualizuj celkový pokrok
            this.updateOverallProgress();
            
            // Skry loading obrazovku
            this.showLoading(false);
            
            console.log('Worlds menu úspešne inicializované');
            
        } catch (error) {
            console.error('Chyba pri inicializácii worlds menu:', error);
            this.showError('Nepodarilo sa načítať menu svetov');
        }
    }

    /**
     * Načítanie konfiguračných súborov
     */
    async loadConfigurations() {
        console.log('Načítavam konfigurácie svetov...');
        
        // Načítaj svety z globálnej premennej (worlds.js)
        if (typeof getAllWorlds === 'function') {
            this.worlds = getAllWorlds();
            console.log(`Načítaných ${this.worlds.length} svetov`);
        } else {
            throw new Error('Konfigurácia svetov nie je dostupná');
        }
    }

    /**
     * Načítanie pokroku hráča z localStorage
     */
    async loadPlayerProgress() {
        console.log('Načítavam pokrok hráča...');
        
        try {
            // Pokús sa načítať uložený pokrok
            const savedProgress = localStorage.getItem('speechTherapyProgress');
            
            if (savedProgress) {
                this.playerProgress = JSON.parse(savedProgress);
                console.log('Pokrok hráča načítaný:', this.playerProgress);
            } else {
                // Vytvor prázdny pokrok pre nového hráča
                this.playerProgress = this.createEmptyProgress();
                console.log('Vytvorený nový pokrok pre hráča');
            }
            
        } catch (error) {
            console.error('Chyba pri načítaní pokroku:', error);
            this.playerProgress = this.createEmptyProgress();
        }
    }

    /**
     * Vytvorenie prázdneho pokroku pre nového hráča
     */
    createEmptyProgress() {
        const emptyProgress = {
            totalStars: 0,
            completedLevels: 0,
            totalLevels: 0,
            worlds: {},
            lastPlayed: null,
            createdAt: new Date().toISOString()
        };

        // Inicializuj pokrok pre každý svet
        this.worlds.forEach(world => {
            // Získaj skutočný počet levelov zo konfigurácie
            const actualLevels = typeof getWorldLevels === 'function' ? getWorldLevels(world.id) : [];
            const actualLevelCount = actualLevels.length;
            
            emptyProgress.worlds[world.id] = {
                isUnlocked: world.id === 'world_r', // Prvý svet (R) je vždy odomknutý
                stars: 0,
                completedLevels: 0,
                totalLevels: actualLevelCount, // Použij skutočný počet levelov
                bestTime: null,
                lastPlayed: null
            };
        });

        return emptyProgress;
    }

    /**
     * Aktualizácia stavu odomknutých svetov na základe pokroku
     */
    updateWorldUnlockStatus() {
        console.log('Aktualizujem stav odomknutých svetov...');
        
        this.worlds.forEach(world => {
            const worldProgress = this.playerProgress.worlds[world.id];
            
            if (world.id === 'world_r') {
                // Prvý svet je vždy odomknutý
                world.isUnlocked = true;
                worldProgress.isUnlocked = true;
            } else if (world.unlockRequirement) {
                // Skontroluj, či je splnená podmienka na odomknutie
                const requiredWorldId = world.unlockRequirement.worldId;
                const requiredStars = world.unlockRequirement.minStars;
                const requiredWorldProgress = this.playerProgress.worlds[requiredWorldId];
                
                if (requiredWorldProgress && requiredWorldProgress.stars >= requiredStars) {
                    world.isUnlocked = true;
                    worldProgress.isUnlocked = true;
                } else {
                    world.isUnlocked = false;
                    worldProgress.isUnlocked = false;
                }
            }
        });
    }

    /**
     * Generovanie HTML pre svety
     */
    generateWorlds() {
        console.log('Generujem HTML pre svety...');
        
        this.worldsContainer.innerHTML = '';

        this.worlds.forEach(world => {
            const worldElement = this.createWorldElement(world);
            this.worldsContainer.appendChild(worldElement);
        });
    }

    /**
     * Vytvorenie HTML elementu pre jeden svet
     */
    createWorldElement(world) {
        const worldProgress = this.playerProgress.worlds[world.id];
        const completionPercentage = worldProgress.totalLevels > 0 
            ? Math.round((worldProgress.completedLevels / worldProgress.totalLevels) * 100)
            : 0;

        // Vytvor hlavný kontajner
        const worldCard = document.createElement('div');
        worldCard.className = 'world-card';
        worldCard.dataset.worldId = world.id;
        
        // Pridaj triedy podľa stavu
        if (!world.isUnlocked) {
            worldCard.classList.add('locked');
        }
        if (completionPercentage === 100) {
            worldCard.classList.add('completed');
        }

        // Nastav farbu pozadia
        worldCard.style.setProperty('--world-color', world.color);

        worldCard.innerHTML = `
            <div class="world-icon" style="background-color: ${world.color}">
                <img src="${world.icon}" alt="${world.name}" onerror="this.style.display='none'">
                <div class="world-letter">${world.name}</div>
            </div>
            
            <div class="world-name">${world.title}</div>
            <div class="world-description">${world.description}</div>
            
            <div class="world-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${completionPercentage}%"></div>
                </div>
                <div class="progress-text">${worldProgress.completedLevels}/${worldProgress.totalLevels} levelov</div>
            </div>
            
            <div class="world-stats">
                <div class="stat">
                    <div class="stat-value">${worldProgress.stars}</div>
                    <div>Hviezdy</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${completionPercentage}%</div>
                    <div>Dokončené</div>
                </div>
                <div class="stat">
                    <div class="difficulty-stars">
                        ${this.generateDifficultyStars(world.difficulty)}
                    </div>
                    <div>Obtiažnosť</div>
                </div>
            </div>
            
            ${!world.isUnlocked ? '<div class="locked-indicator">🔒</div>' : ''}
        `;

        return worldCard;
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
     * Nastavenie event listenerov
     */
    setupEventListeners() {
        console.log('Nastavujem event listenery...');

        // Kliknutie na svet
        this.worldsContainer.addEventListener('click', (e) => {
            const worldCard = e.target.closest('.world-card');
            if (worldCard) {
                const worldId = worldCard.dataset.worldId;
                this.handleWorldClick(worldId);
            }
        });

        // Zatvorenie modalov
        document.getElementById('closeModal').addEventListener('click', () => {
            this.hideModal('lockedWorldModal');
        });

        document.getElementById('closeModalBtn').addEventListener('click', () => {
            this.hideModal('lockedWorldModal');
        });

        document.getElementById('closeInfoModal').addEventListener('click', () => {
            this.hideModal('worldInfoModal');
        });

        document.getElementById('closeInfoModalBtn').addEventListener('click', () => {
            this.hideModal('worldInfoModal');
        });

        // Tlačidlá v modaloch
        document.getElementById('goToPreviousWorld').addEventListener('click', () => {
            this.goToPreviousWorld();
        });

        document.getElementById('enterWorldBtn').addEventListener('click', () => {
            const worldId = this.currentSelectedWorld;
            if (worldId) {
                this.enterWorld(worldId);
            }
        });

        // Zatvorenie modalu kliknutím mimo obsah
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target.id);
            }
        });

        // ESC klávesa na zatvorenie modalu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModal('lockedWorldModal');
                this.hideModal('worldInfoModal');
            }
        });
    }

    /**
     * Spracovanie kliknutia na svet
     */
    handleWorldClick(worldId) {
        console.log(`Kliknutie na svet: ${worldId}`);
        
        const world = this.worlds.find(w => w.id === worldId);
        if (!world) return;

        if (!world.isUnlocked) {
            // Zobraz modal pre zamknutý svet
            this.showLockedWorldModal(world);
        } else {
            // Zobraz informácie o svete
            this.showWorldInfoModal(world);
        }
    }

    /**
     * Zobrazenie modalu pre zamknutý svet
     */
    showLockedWorldModal(world) {
        const requirement = world.unlockRequirement;
        const requiredWorld = this.worlds.find(w => w.id === requirement.worldId);
        const currentStars = this.playerProgress.worlds[requirement.worldId]?.stars || 0;
        
        document.getElementById('lockMessage').textContent = 
            `Na odomknutie sveta "${world.title}" potrebuješ aspoň ${requirement.minStars} hviezd zo sveta "${requiredWorld.title}".`;
        
        document.getElementById('requirementInfo').innerHTML = `
            <div style="margin-top: 15px;">
                <strong>Tvoj pokrok:</strong><br>
                ${currentStars}/${requirement.minStars} hviezd zo sveta "${requiredWorld.title}"<br>
                <div style="margin-top: 10px; font-size: 12px; color: rgba(255,255,255,0.8);">
                    Chýba ti ešte ${Math.max(0, requirement.minStars - currentStars)} hviezd
                </div>
            </div>
        `;

        this.showModal('lockedWorldModal');
    }

    /**
     * Zobrazenie informačného modalu o svete
     */
    showWorldInfoModal(world) {
        this.currentSelectedWorld = world.id;
        const worldProgress = this.playerProgress.worlds[world.id];
        
        // Získaj skutočný počet levelov
        const actualLevels = typeof getWorldLevels === 'function' ? getWorldLevels(world.id) : [];
        const actualLevelCount = actualLevels.length;
        const maxPossibleStars = actualLevelCount * 3; // 3 hviezdy na level

        document.getElementById('worldInfoTitle').textContent = world.title;
        document.getElementById('worldInfoIcon').src = world.icon;
        document.getElementById('worldInfoLetter').textContent = world.name;
        document.getElementById('worldInfoDescription').textContent = world.description;
        document.getElementById('worldInfoLevels').textContent = 
            `${worldProgress.completedLevels}/${actualLevelCount}`;
        document.getElementById('worldInfoStars').textContent = 
            `${worldProgress.stars}/${maxPossibleStars}`;
        
        // Hviezdy obtiažnosti
        document.getElementById('worldInfoDifficulty').innerHTML = 
            this.generateDifficultyStars(world.difficulty);

        this.showModal('worldInfoModal');
    }

    /**
     * Vstup do vybraného sveta
     */
    enterWorld(worldId) {
        console.log(`Vstupujem do sveta: ${worldId}`);
        
        // Ulož posledne hraný svet
        this.playerProgress.lastPlayed = worldId;
        this.playerProgress.worlds[worldId].lastPlayed = new Date().toISOString();
        this.saveProgress();
        
        // Presmeruj na level selector
        window.location.href = `level-selector.html?world=${worldId}`;
    }

    /**
     * Prejsť na predchádzajúci (odomknutý) svet
     */
    goToPreviousWorld() {
        const unlockedWorlds = this.worlds.filter(w => w.isUnlocked);
        if (unlockedWorlds.length > 0) {
            const lastUnlockedWorld = unlockedWorlds[unlockedWorlds.length - 1];
            this.hideModal('lockedWorldModal');
            this.enterWorld(lastUnlockedWorld.id);
        }
    }

    /**
     * Aktualizácia celkového pokroku hráča
     */
    updateOverallProgress() {
        let totalStars = 0;
        let totalCompletedLevels = 0;
        let totalLevels = 0;

        Object.values(this.playerProgress.worlds).forEach(worldProgress => {
            totalStars += worldProgress.stars;
            totalCompletedLevels += worldProgress.completedLevels;
            totalLevels += worldProgress.totalLevels;
        });

        const completionPercentage = totalLevels > 0 
            ? Math.round((totalCompletedLevels / totalLevels) * 100) 
            : 0;

        // Aktualizuj UI
        this.totalStarsElement.textContent = totalStars;
        this.completionPercentageElement.textContent = `${completionPercentage}%`;

        // Ulož do pokroku
        this.playerProgress.totalStars = totalStars;
        this.playerProgress.completedLevels = totalCompletedLevels;
        this.playerProgress.totalLevels = totalLevels;
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
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            // Animácia
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 10);
        }
    }

    /**
     * Skrytie modalu
     */
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    /**
     * Uloženie pokroku do localStorage
     */
    saveProgress() {
        try {
            localStorage.setItem('speechTherapyProgress', JSON.stringify(this.playerProgress));
            console.log('Pokrok úspešne uložený');
        } catch (error) {
            console.error('Chyba pri ukladaní pokroku:', error);
        }
    }

    /**
     * Zobrazenie chybovej hlášky
     */
    showError(message) {
        console.error('Chyba:', message);
        
        // Skry loading a zobraz chybovú hlášku
        this.showLoading(false);
        
        this.worldsContainer.innerHTML = `
            <div style="text-align: center; color: white; padding: 40px;">
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
    console.log('DOM načítaný, inicializujem WorldsMenu...');
    
    // Počkaj chvíľu na načítanie konfiguračných súborov
    setTimeout(() => {
        new WorldsMenu();
    }, 100);
});

/**
 * Debug funkcie (pre testovacie účely)
 */
window.debugWorldsMenu = {
    resetProgress: () => {
        localStorage.removeItem('speechTherapyProgress');
        location.reload();
    },
    
    unlockAllWorlds: () => {
        const progress = JSON.parse(localStorage.getItem('speechTherapyProgress') || '{}');
        if (progress.worlds) {
            Object.keys(progress.worlds).forEach(worldId => {
                progress.worlds[worldId].isUnlocked = true;
                progress.worlds[worldId].stars = 60; // Daj veľa hviezd
            });
            localStorage.setItem('speechTherapyProgress', JSON.stringify(progress));
            location.reload();
        }
    },
    
    showProgress: () => {
        console.log('Aktuálny pokrok:', JSON.parse(localStorage.getItem('speechTherapyProgress') || '{}'));
    }
};