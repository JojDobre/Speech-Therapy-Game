/**
 * PROGRESS MANAGER
 * Správa pokroku hráča, ukladanie a načítavanie dát
 */

class ProgressManager {
    constructor() {
        this.STORAGE_KEY = 'speechTherapyProgress';
        this.progress = null;
        this.init();
    }

    /**
     * Inicializácia progress managera
     */
    init() {
        console.log('Inicializujem ProgressManager...');
        this.loadProgress();
        
        // Ak neexistuje pokrok, vytvor nový
        if (!this.progress) {
            this.createNewProgress();
        }
        
        console.log('ProgressManager inicializovaný');
    }

    /**
     * Načítanie pokroku z localStorage
     */
    loadProgress() {
        try {
            const savedData = localStorage.getItem(this.STORAGE_KEY);
            if (savedData) {
                this.progress = JSON.parse(savedData);
                console.log('Pokrok načítaný z localStorage');
                return true;
            }
        } catch (error) {
            console.error('Chyba pri načítaní pokroku:', error);
        }
        return false;
    }

    /**
     * Vytvorenie nového pokroku pre hráča
     */
    createNewProgress() {
        console.log('Vytváram nový pokrok pre hráča...');
        
        this.progress = {
            version: '1.0',
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            totalStars: 0,
            totalCompletedLevels: 0,
            totalPlayTime: 0, // v sekundách
            worlds: {},
            settings: {
                soundEnabled: true,
                musicEnabled: true,
                difficulty: 'normal'
            },
            achievements: [],
            statistics: {
                totalWordsSpoken: 0,
                correctPronunciations: 0,
                incorrectPronunciations: 0,
                gamesPlayed: 0,
                favoriteGameType: null
            }
        };

        // Inicializuj pokrok pre všetky svety
        if (typeof getAllWorlds === 'function') {
            const worlds = getAllWorlds();
            worlds.forEach(world => {
                this.progress.worlds[world.id] = {
                    isUnlocked: world.id === 'world_r', // Prvý svet je odomknutý
                    stars: 0,
                    completedLevels: 0,
                    totalLevels: world.totalLevels,
                    bestTime: null,
                    lastPlayed: null,
                    levels: {} // Pokrok jednotlivých levelov
                };

                // Inicializuj prázdny objekt pre levely - budú sa inicializovať dynamicky
                this.progress.worlds[world.id].levels = {};
            });
        }

        this.saveProgress();
        console.log('Nový pokrok vytvorený a uložený');
    }

    /**
     * Uloženie pokroku do localStorage
     */
    saveProgress() {
        try {
            this.progress.lastUpdated = new Date().toISOString();
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.progress));
            console.log('Pokrok uložený');
            return true;
        } catch (error) {
            console.error('Chyba pri ukladaní pokroku:', error);
            return false;
        }
    }

    /**
     * Získanie celkového pokroku
     */
    getProgress() {
        return this.progress;
    }

    /**
     * Získanie pokroku konkrétneho sveta
     */
    getWorldProgress(worldId) {
        return this.progress.worlds[worldId] || null;
    }

    /**
     * Získanie pokroku konkrétneho levelu (s automatickou inicializáciou)
     */
    getLevelProgress(worldId, levelId) {
        const worldProgress = this.getWorldProgress(worldId);
        if (!worldProgress) return null;
        
        // Ak level neexistuje v pokroku, inicializuj ho
        if (!worldProgress.levels[levelId]) {
            this.initializeLevelProgress(worldId, levelId);
        }
        
        return worldProgress.levels[levelId] || null;
    }

    /**
     * Inicializácia pokroku pre konkrétny level
     */
    initializeLevelProgress(worldId, levelId) {
        console.log(`Inicializujem pokrok pre level ${levelId} v svete ${worldId}`);
        
        const worldProgress = this.progress.worlds[worldId];
        if (!worldProgress) {
            console.error(`Svet ${worldId} neexistuje v pokroku`);
            return false;
        }

        // Získaj konfiguráciu levelu
        let levelConfig = null;
        if (typeof getLevelConfig === 'function') {
            levelConfig = getLevelConfig(levelId);
        }

        if (!levelConfig) {
            console.error(`Konfigurácia levelu ${levelId} sa nenašla`);
            return false;
        }

        // Vytvor pokrok pre level
        worldProgress.levels[levelId] = {
            isUnlocked: this.shouldLevelBeUnlocked(worldId, levelConfig),
            stars: 0,
            bestTime: null,
            attempts: 0,
            completed: false,
            lastPlayed: null
        };

        this.saveProgress();
        return true;
    }

    /**
     * Kontrola, či má byť level odomknutý
     */
    shouldLevelBeUnlocked(worldId, levelConfig) {
        // Prvý level v prvom svete je vždy odomknutý
        if (worldId === 'world_r' && levelConfig.levelNumber === 1) {
            return true;
        }

        // Prvý level v každom svete je odomknutý ak je svet odomknutý
        if (levelConfig.levelNumber === 1) {
            return this.progress.worlds[worldId].isUnlocked;
        }

        // Ostatné levely sú zamknuté dokým sa nedokončí predchádzajúci
        return false;
    }

    /**
     * Inicializácia všetkých levelov pre svet (voliteľná funkcia)
     */
    initializeAllLevelsForWorld(worldId) {
        console.log(`Inicializujem všetky levely pre svet ${worldId}`);
        
        if (typeof getWorldLevels === 'function') {
            const levels = getWorldLevels(worldId);
            levels.forEach(level => {
                if (!this.progress.worlds[worldId].levels[level.id]) {
                    this.initializeLevelProgress(worldId, level.id);
                }
            });
        }
    }

    /**
     * Aktualizácia pokroku levelu
     */
    updateLevelProgress(worldId, levelId, levelData) {
        console.log(`Aktualizujem pokrok levelu ${levelId} v svete ${worldId}`);
        
        const worldProgress = this.progress.worlds[worldId];
        if (!worldProgress) {
            console.error(`Svet ${worldId} neexistuje v pokroku`);
            return false;
        }

        if (!worldProgress.levels[levelId]) {
            worldProgress.levels[levelId] = {
                isUnlocked: false,
                stars: 0,
                bestTime: null,
                attempts: 0,
                completed: false,
                lastPlayed: null
            };
        }

        const levelProgress = worldProgress.levels[levelId];
        
        // Aktualizuj dáta levelu
        if (levelData.stars !== undefined) {
            levelProgress.stars = Math.max(levelProgress.stars, levelData.stars);
        }
        
        if (levelData.time !== undefined) {
            if (!levelProgress.bestTime || levelData.time < levelProgress.bestTime) {
                levelProgress.bestTime = levelData.time;
            }
        }
        
        if (levelData.completed !== undefined) {
            levelProgress.completed = levelData.completed;
        }
        
        levelProgress.attempts++;
        levelProgress.lastPlayed = new Date().toISOString();
        
        // Aktualizuj štatistiky sveta
        this.updateWorldStatistics(worldId);
        
        // Skontroluj odomknutie ďalších levelov/svetov
        this.checkUnlocks(worldId, levelId);
        
        // Aktualizuj celkové štatistiky
        this.updateOverallStatistics();
        
        this.saveProgress();
        return true;
    }

    /**
     * Aktualizácia štatistík sveta
     */
    updateWorldStatistics(worldId) {
        const worldProgress = this.progress.worlds[worldId];
        const levels = worldProgress.levels;
        
        // Spočítaj hviezdy a dokončené levely
        let totalStars = 0;
        let completedLevels = 0;
        
        Object.values(levels).forEach(level => {
            totalStars += level.stars;
            if (level.completed) {
                completedLevels++;
            }
        });
        
        worldProgress.stars = totalStars;
        worldProgress.completedLevels = completedLevels;
        worldProgress.lastPlayed = new Date().toISOString();
    }

    /**
     * Aktualizácia celkových štatistík
     */
    updateOverallStatistics() {
        let totalStars = 0;
        let totalCompletedLevels = 0;
        
        Object.values(this.progress.worlds).forEach(world => {
            totalStars += world.stars;
            totalCompletedLevels += world.completedLevels;
        });
        
        this.progress.totalStars = totalStars;
        this.progress.totalCompletedLevels = totalCompletedLevels;
    }

    /**
     * Kontrola odomknutia nových levelov/svetov
     */
    checkUnlocks(worldId, completedLevelId) {
        console.log(`Kontrolujem odomknutia po dokončení ${completedLevelId}`);
        
        // Odomkni ďalší level v rovnakom svete
        this.unlockNextLevel(worldId, completedLevelId);
        
        // Skontroluj odomknutie nových svetov
        this.checkWorldUnlocks();
    }

    /**
     * Odomknutie ďalšieho levelu v svete
     */
    unlockNextLevel(worldId, currentLevelId) {
        if (typeof getNextLevel === 'function') {
            const nextLevel = getNextLevel(currentLevelId);
            if (nextLevel && nextLevel.worldId === worldId) {
                const nextLevelProgress = this.getLevelProgress(worldId, nextLevel.id);
                if (nextLevelProgress && !nextLevelProgress.isUnlocked) {
                    nextLevelProgress.isUnlocked = true;
                    console.log(`Odomknutý ďalší level: ${nextLevel.id}`);
                }
            }
        }
    }

    /**
     * Kontrola odomknutia svetov
     */
    checkWorldUnlocks() {
        if (typeof getAllWorlds === 'function') {
            const worlds = getAllWorlds();
            
            worlds.forEach(world => {
                if (world.unlockRequirement && !this.progress.worlds[world.id].isUnlocked) {
                    const requiredWorldId = world.unlockRequirement.worldId;
                    const requiredStars = world.unlockRequirement.minStars;
                    const requiredWorldProgress = this.progress.worlds[requiredWorldId];
                    
                    if (requiredWorldProgress && requiredWorldProgress.stars >= requiredStars) {
                        this.progress.worlds[world.id].isUnlocked = true;
                        
                        // Odomkni prvý level nového sveta
                        if (typeof getWorldLevels === 'function') {
                            const firstLevel = getWorldLevels(world.id)[0];
                            if (firstLevel) {
                                this.progress.worlds[world.id].levels[firstLevel.id].isUnlocked = true;
                            }
                        }
                        
                        console.log(`Odomknutý nový svet: ${world.id}`);
                        
                        // Tu by sa mohla zobraziť notifikácia o odomknutí
                        this.showUnlockNotification('world', world);
                    }
                }
            });
        }
    }

    /**
     * Zobrazenie notifikácie o odomknutí
     */
    showUnlockNotification(type, item) {
        // TODO: Implementovať notifikačný systém
        console.log(`Odomknuté: ${type} - ${item.name || item.title}`);
    }

    /**
     * Resetovanie pokroku (pre testovacie účely)
     */
    resetProgress() {
        console.log('Resetujem pokrok hráča...');
        localStorage.removeItem(this.STORAGE_KEY);
        this.createNewProgress();
    }

    /**
     * Export pokroku (pre zálohovanie)
     */
    exportProgress() {
        return JSON.stringify(this.progress, null, 2);
    }

    /**
     * Import pokroku (pre obnovenie zo zálohy)
     */
    importProgress(progressData) {
        try {
            const imported = JSON.parse(progressData);
            this.progress = imported;
            this.saveProgress();
            console.log('Pokrok úspešne importovaný');
            return true;
        } catch (error) {
            console.error('Chyba pri importe pokroku:', error);
            return false;
        }
    }

    /**
     * Získanie štatistík pre analýzu
     */
    getStatistics() {
        return {
            totalStars: this.progress.totalStars,
            totalCompletedLevels: this.progress.totalCompletedLevels,
            totalPlayTime: this.progress.totalPlayTime,
            worldsUnlocked: Object.values(this.progress.worlds).filter(w => w.isUnlocked).length,
            averageStarsPerLevel: this.progress.totalCompletedLevels > 0 
                ? (this.progress.totalStars / this.progress.totalCompletedLevels).toFixed(2) 
                : 0,
            ...this.progress.statistics
        };
    }
}

// Vytvor globálnu inštanciu
window.progressManager = new ProgressManager();

// Export pre Node.js (ak je potrebný)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressManager;
}