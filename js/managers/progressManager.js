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
        console.log(`Aktualizujem pokrok levelu ${levelId} v svete ${worldId}:`, levelData);
        
        const worldProgress = this.progress.worlds[worldId];
        if (!worldProgress) {
            console.error(`Svet ${worldId} neexistuje v pokroku`);
            return false;
        }

        // Ak level ešte neexistuje, inicializuj ho
        if (!worldProgress.levels[levelId]) {
            worldProgress.levels[levelId] = {
                isUnlocked: false,
                stars: 0,
                bestTime: null,
                attempts: 0,
                completed: false,
                lastPlayed: null,
                totalPoints: 0,
                maxPoints: 0,
                percentage: 0
            };
        }

        const levelProgress = worldProgress.levels[levelId];
        
        // Aktualizuj dáta levelu - VYLEPŠENÉ UKLADANIE
        if (levelData.stars !== undefined) {
            // Ulož len ak sú hviezdy lepšie ako predtým
            if (levelData.stars > levelProgress.stars) {
                levelProgress.stars = levelData.stars;
                console.log(`Nové hviezdy: ${levelData.stars} (predtým: ${levelProgress.stars})`);
            }
        }
        
        if (levelData.time !== undefined) {
            if (!levelProgress.bestTime || levelData.time < levelProgress.bestTime) {
                levelProgress.bestTime = levelData.time;
                console.log(`Nový najlepší čas: ${levelData.time}s`);
            }
        }
        
        if (levelData.completed !== undefined) {
            const wasCompleted = levelProgress.completed;
            levelProgress.completed = levelData.completed;
            
            if (levelData.completed && !wasCompleted) {
                console.log(`Level ${levelId} dokončený prvýkrát!`);
            }
        }
        
        // NOVÉ: Ulož dodatočné štatistiky
        if (levelData.points !== undefined) {
            levelProgress.totalPoints = Math.max(levelProgress.totalPoints, levelData.points);
        }
        
        if (levelData.maxPoints !== undefined) {
            levelProgress.maxPoints = levelData.maxPoints;
        }
        
        if (levelData.percentage !== undefined) {
            levelProgress.percentage = Math.max(levelProgress.percentage, levelData.percentage);
        }
        
        // Aktualizuj základné info
        levelProgress.attempts++;
        levelProgress.lastPlayed = new Date().toISOString();
        
        // Aktualizuj štatistiky sveta
        this.updateWorldStatistics(worldId);
        
        // VYLEPŠENÉ: Skontroluj odomknutie ďalších levelov/svetov
        this.checkUnlocks(worldId, levelId, levelData);
        
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
        
        const unlocked = {
            levels: [],
            worlds: []
        };
        
        // 1. Odomkni ďalší level v rovnakom svete (ak existuje)
        const nextLevelUnlocked = this.unlockNextLevel(worldId, completedLevelId);
        if (nextLevelUnlocked) {
            unlocked.levels.push(nextLevelUnlocked);
        }
        
        // 2. Skontroluj odomknutie nových svetov
        const newWorlds = this.checkWorldUnlocks();
        unlocked.worlds.push(...newWorlds);
        
        // 3. Informuj o odomknutom obsahu
        if (unlocked.levels.length > 0 || unlocked.worlds.length > 0) {
            this.showUnlockNotifications(unlocked);
        }
        
        return unlocked;
    }

    /**
     * Odomknutie ďalšieho levelu v svete
     */
    unlockNextLevel(worldId, currentLevelId) {
        try {
        // Získaj konfiguráciu aktuálneho levelu
        if (typeof getLevelConfig !== 'function') {
            console.warn('Funkcia getLevelConfig nie je dostupná');
            return null;
        }
        
        const currentLevel = getLevelConfig(currentLevelId);
        if (!currentLevel) {
            console.warn(`Konfigurácia levelu ${currentLevelId} sa nenašla`);
            return null;
        }
        
        // OPRAVENÉ: Použij správny formát ID podľa existujúcej konfigurácie
        // Namiesto hardcoded formátu, nájdi všetky levely sveta a vybra ďalší
        if (typeof getWorldLevels === 'function') {
            const worldLevels = getWorldLevels(worldId);
            
            // Nájdi index aktuálneho levelu
            const currentIndex = worldLevels.findIndex(level => level.id === currentLevelId);
            
            if (currentIndex === -1) {
                console.warn(`Aktuálny level ${currentLevelId} sa nenašiel v zozname levelov`);
                return null;
            }
            
            // Skontroluj či existuje ďalší level
            if (currentIndex + 1 >= worldLevels.length) {
                console.log(`Ďalší level neexistuje - koniec sveta ${worldId}`);
                return null;
            }
            
            // Získaj ďalší level
            const nextLevel = worldLevels[currentIndex + 1];
            console.log(`Našiel som ďalší level: ${nextLevel.id} (${nextLevel.name})`);
            
            // Získaj alebo vytvor pokrok ďalšieho levelu
            const nextLevelProgress = this.getLevelProgress(worldId, nextLevel.id);
            
            if (nextLevelProgress && !nextLevelProgress.isUnlocked) {
                nextLevelProgress.isUnlocked = true;
                console.log(`✅ Odomknutý ďalší level: ${nextLevel.name} (${nextLevel.id})`);
                
                this.saveProgress();
                return nextLevel;
            } else if (nextLevelProgress && nextLevelProgress.isUnlocked) {
                console.log(`Level ${nextLevel.id} je už odomknutý`);
                return nextLevel;
            }
        }
        
        return null;
        
    } catch (error) {
        console.error('Chyba pri odomykaní ďalšieho levelu:', error);
        return null;
    }
    }

    /**
     * Kontrola odomknutia svetov
     */
    checkWorldUnlocks() {
        const unlockedWorlds = [];
            
            try {
                if (typeof getAllWorlds !== 'function') {
                    console.warn('Funkcia getAllWorlds nie je dostupná');
                    return unlockedWorlds;
                }
                
                const worlds = getAllWorlds();
                
                worlds.forEach(world => {
                    // Preskočí svety, ktoré sú už odomknuté
                    if (this.progress.worlds[world.id].isUnlocked) {
                        return;
                    }
                    
                    // Skontroluj podmienky odomknutia
                    if (world.unlockRequirement) {
                        const requiredWorldId = world.unlockRequirement.worldId;
                        const requiredStars = world.unlockRequirement.minStars || 0;
                        const requiredLevels = world.unlockRequirement.minCompletedLevels || 0;
                        
                        const requiredWorldProgress = this.progress.worlds[requiredWorldId];
                        
                        if (requiredWorldProgress) {
                            const hasEnoughStars = requiredWorldProgress.stars >= requiredStars;
                            const hasEnoughLevels = requiredWorldProgress.completedLevels >= requiredLevels;
                            
                            if (hasEnoughStars && hasEnoughLevels) {
                                // Odomkni svet
                                this.progress.worlds[world.id].isUnlocked = true;
                                
                                // Odomkni prvý level nového sveta
                                if (typeof getWorldLevels === 'function') {
                                    const firstLevel = getWorldLevels(world.id)[0];
                                    if (firstLevel) {
                                        this.progress.worlds[world.id].levels[firstLevel.id] = {
                                            isUnlocked: true,
                                            stars: 0,
                                            bestTime: null,
                                            attempts: 0,
                                            completed: false,
                                            lastPlayed: null,
                                            totalPoints: 0,
                                            maxPoints: 0,
                                            percentage: 0
                                        };
                                    }
                                }
                                
                                console.log(`✅ Odomknutý nový svet: ${world.name} (${world.id})`);
                                unlockedWorlds.push(world);
                            } else {
                                console.log(`Svet ${world.id} ešte nie je odomknutý: potrebné ${requiredStars} hviezd (má ${requiredWorldProgress.stars}) a ${requiredLevels} levelov (má ${requiredWorldProgress.completedLevels})`);
                            }
                        }
                    }
                });
                
                if (unlockedWorlds.length > 0) {
                    this.saveProgress();
                }
                
            } catch (error) {
                console.error('Chyba pri kontrole odomknutia svetov:', error);
            }
            
            return unlockedWorlds;
    }

    /**
     * Zobrazenie notifikácie o odomknutí
     */
    showUnlockNotification(type, item) {
        const messages = {
            'level': `🔓 Odomknutý nový level: ${item.name}!`,
            'world': `🌟 Odomknutý nový svet: ${item.name}!`
        };
        
        const message = messages[type] || `Odomknuté: ${item.name}`;
        
        console.log(message);
        
        // Môžeš pridať toast notifikáciu, alert alebo upraviť UI
        // Napríklad jednoduchý timeout alert:
        setTimeout(() => {
            if (typeof createUnlockToast === 'function') {
                createUnlockToast(message, type);
            } else {
                // Fallback - console log (môže sa nahradiť lepším UI)
                console.log(`UI Notifikácia: ${message}`);
            }
        }, 500);
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

    /**
     * Zobrazenie notifikácií o odomknutí
     */
    showUnlockNotifications(unlocked) {
        console.log('🎉 === ODOMKNUTÝ NOVÝ OBSAH ===');
        
        // Oznám odomknuté levely
        unlocked.levels.forEach(level => {
            console.log(`🔓 Nový level: ${level.name} (${level.id})`);
            this.showUnlockNotification('level', level);
        });
        
        // Oznám odomknuté svety
        unlocked.worlds.forEach(world => {
            console.log(`🌟 Nový svet: ${world.name} (${world.id})`);
            this.showUnlockNotification('world', world);
        });
    }


    /**
 * NOVÁ FUNKCIA: Získanie detailného pokroku sveta
 */
getDetailedWorldProgress(worldId) {
    const worldProgress = this.getWorldProgress(worldId);
    if (!worldProgress) return null;
    
    const levels = worldProgress.levels;
    const levelStats = {
        total: 0,
        completed: 0,
        unlocked: 0,
        locked: 0,
        starsBreakdown: { 0: 0, 1: 0, 2: 0, 3: 0 }
    };
    
    Object.values(levels).forEach(level => {
        levelStats.total++;
        
        if (level.isUnlocked) levelStats.unlocked++;
        else levelStats.locked++;
        
        if (level.completed) levelStats.completed++;
        
        levelStats.starsBreakdown[level.stars]++;
    });
    
    return {
        ...worldProgress,
        levelStats,
        completionPercentage: levelStats.total > 0 ? 
            Math.round((levelStats.completed / levelStats.total) * 100) : 0
    };
}

/**
 * NOVÁ FUNKCIA: Debug funkcie pre testovacie účely
 */
debugUnlockLevel(worldId, levelId) {
    console.log(`Debug: Odomykam level ${levelId} v svete ${worldId}`);
    
    const levelProgress = this.getLevelProgress(worldId, levelId);
    if (levelProgress) {
        levelProgress.isUnlocked = true;
        this.saveProgress();
        console.log(`✅ Level ${levelId} bol manuálne odomknutý`);
        return true;
    }
    
    console.error(`❌ Level ${levelId} sa nenašiel`);
    return false;
}

debugCompleteLevel(worldId, levelId, stars = 3) {
    console.log(`Debug: Dokončujem level ${levelId} s ${stars} hviezdami`);
    
    const success = this.updateLevelProgress(worldId, levelId, {
        stars: stars,
        completed: true,
        time: 120, // 2 minúty
        points: stars * 3,
        maxPoints: 9,
        percentage: (stars / 3) * 100
    });
    
    if (success) {
        console.log(`✅ Level ${levelId} bol manuálne dokončený s ${stars} hviezdami`);
    }
    
    return success;
}

debugUnlockWorld(worldId) {
    console.log(`Debug: Odomykam svet ${worldId}`);
    
    if (this.progress.worlds[worldId]) {
        this.progress.worlds[worldId].isUnlocked = true;
        
        // Odomkni prvý level
        if (typeof getWorldLevels === 'function') {
            const firstLevel = getWorldLevels(worldId)[0];
            if (firstLevel) {
                this.debugUnlockLevel(worldId, firstLevel.id);
            }
        }
        
        this.saveProgress();
        console.log(`✅ Svet ${worldId} bol manuálne odomknutý`);
        return true;
    }
    
    console.error(`❌ Svet ${worldId} sa nenašiel`);
    return false;
}

/**
 * NOVÁ FUNKCIA: Štatistiky pre debug a admin panel
 */
getProgressStatistics() {
    const stats = this.getStatistics();
    
    // Pridaj detailné štatistiky svetov
    const worldStats = {};
    Object.keys(this.progress.worlds).forEach(worldId => {
        worldStats[worldId] = this.getDetailedWorldProgress(worldId);
    });
    
    return {
        ...stats,
        worlds: worldStats,
        lastUpdated: this.progress.lastUpdated,
        createdAt: this.progress.createdAt
    };
}

}


// Vytvor globálnu inštanciu
window.progressManager = new ProgressManager();

// Export pre Node.js (ak je potrebný)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressManager;
}





















