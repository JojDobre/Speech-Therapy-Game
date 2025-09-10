/**
 * Konfigurácia levelov pre logopedickú hru
 * Každý level má svoje špecifické nastavenia, slová na precvičovanie a obtiažnosť
 * 
 * Štruktúra levelu:
 * - id: jedinečný identifikátor levelu
 * - worldId: ID sveta, do ktorého level patří
 * - levelNumber: poradové číslo levelu v rámci sveta (1-20)
 * - name: názov levelu
 * - gameType: typ hry ('banik', 'pexeso', 'mario')
 * - difficulty: obtiažnosť levelu (1-5)
 * - words: pole slov na precvičovanie v tomto leveli
 * - gameConfig: špecifické nastavenia pre daný typ hry
 * - unlockRequirement: podmienka na odomknutie levelu
 * - timeLimit: časový limit v sekundách (null = bez limitu)
 * - minStarsToPass: minimálny počet hviezd potrebný na prejdenie levelu
 */

const LEVELS_CONFIG = {
    // ===============================
    // SVET R - Písmeno R
    // ===============================
    world_r: [
        {
            id: 'r_001',
            worldId: 'world_r',
            levelNumber: 1,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['rak', 'ryba', 'ruka', 'rosa'],
            gameConfig: {
                diamonds: 2,
                golds: 5,
                crystals: 1,
                mapSize: { width: 16, height: 10 }
            },
            // NOVÝ OBJEKT positions - presné pozície všetkých itemov
            positions: {
                // Pozície diamantov (súradnice v grid-e, nie pixeloch)
                diamonds: [
                    { x: 3, y: 8 },  // diamant na pozícii 3,8
                    { x: 12, y: 7 }  // diamant na pozícii 12,7
                ],
                // Pozície zlatých predmetov
                golds: [
                    { x: 2, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 8 },   // gold na pozícii 7,8
                    { x: 14, y: 6 },   // gold na pozícii 14,6
                    { x: 9, y: 8 },
                    { x: 10, y: 8 },
                ],
                // Pozície kryštálov (kov v pôvodnom kóde)
                crystals: [
                    { x: 9, y: 7 }    // kryštál na pozícii 9,7
                ],
                // Pozícia hráča na začiatku levelu
                player: { x: 1, y: 1 }
            },
            unlockRequirement: null,
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: true
        },
        {
            id: 'r_003',
            worldId: 'world_r',
            levelNumber: 3,
            name: 'R v strede',
            gameType: 'pexeso',
            difficulty: 1,
            words: ['krava', 'tráva', 'prasa', 'breza', 'drevo', 'krása'],
            gameConfig: {
                pairs: 6, // počet párov v pexese
                gridSize: { rows: 3, cols: 4 } // rozloženie kariet
            },
            unlockRequirement: {
                levelId: 'r_001',
                minStars: 1
            },
            timeLimit: 180, // 3 minúty
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_002',
            worldId: 'world_r',
            levelNumber: 2,
            name: 'R na konci',
            gameType: 'banik',
            difficulty: 2,
            words: ['kôr', 'mor', 'dvôr', 'kúr', 'syr', 'mier'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 1,
                mapSize: { width: 16, height: 10 }
            },
            unlockRequirement: {
                levelId: 'r_002',
                minStars: 1
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_004',
            worldId: 'world_r',
            levelNumber: 4,
            name: 'Dvojité R',
            gameType: 'pexeso',
            difficulty: 2,
            words: ['koruna', 'barva', 'varenie', 'porota', 'gorila', 'kurča'],
            gameConfig: {
                pairs: 6,
                gridSize: { rows: 3, cols: 4 }
            },
            unlockRequirement: {
                levelId: 'r_003',
                minStars: 1
            },
            timeLimit: 150,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_005',
            worldId: 'world_r',
            levelNumber: 5,
            name: 'Mario a R',
            gameType: 'mario',
            difficulty: 2,
            words: ['robot', 'ruža', 'rieka', 'raketa', 'rýchlo', 'radosť'],
            gameConfig: {
                speechItems: 4, // počet predmetov vyžadujúcich rečové cvičenie
                coins: 6,       // počet mincí na zbieranie
                enemies: 2,     // počet nepriateľov
                platforms: 8    // počet platforiem
            },
            unlockRequirement: {
                levelId: 'r_004',
                minStars: 2
            },
            timeLimit: 240,
            minStarsToPass: 1,
            isUnlocked: false
        },
        // Pokračovanie pre ďalšie levely sveta R...
        {
            id: 'r_006',
            worldId: 'world_r',
            levelNumber: 6,
            name: 'R kombinace',
            gameType: 'banik',
            difficulty: 3,
            words: ['traktor', 'draček', 'príroda', 'program', 'krásny', 'pracovať'],
            gameConfig: {
                diamonds: 4,
                golds: 5,
                crystals: 2,
                mapSize: { width: 18, height: 12 }
            },
            unlockRequirement: {
                levelId: 'r_005',
                minStars: 2
            },
            timeLimit: null,
            minStarsToPass: 2,
            isUnlocked: false
        }
        // Tu by pokračovali ďalšie levely až po r_020...
    ],

    // ===============================
    // SVET L - Písmeno L
    // ===============================
    world_l: [
        {
            id: 'l_001',
            worldId: 'world_l',
            levelNumber: 1,
            name: 'Prvé L-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['lopta', 'luna', 'lev', 'les'], 
            gameConfig: {
                diamonds: 2,
                golds: 3,
                crystals: 1,
                mapSize: { width: 16, height: 10 }
            },
            unlockRequirement: null, // odomkne sa automaticky keď sa odomkne svet L
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: true
        },
        {
            id: 'l_002',
            worldId: 'world_l',
            levelNumber: 2,
            name: 'L v strede',
            gameType: 'pexeso',
            difficulty: 1,
            words: ['mlieko', 'slon', 'klíč', 'ľahký', 'blond', 'glóbus'],
            gameConfig: {
                pairs: 6,
                gridSize: { rows: 3, cols: 4 }
            },
            unlockRequirement: {
                levelId: 'l_001',
                minStars: 1
            },
            timeLimit: 180,
            minStarsToPass: 1,
            isUnlocked: false
        }
        // Tu by pokračovali ďalšie levely sveta L...
    ],

    // ===============================
    // SVET S - Písmeno S  
    // ===============================
    world_s: [
        {
            id: 's_001',
            worldId: 'world_s',
            levelNumber: 1,
            name: 'Sykavé S',
            gameType: 'banik',
            difficulty: 1,
            words: ['slnko', 'sova', 'syr', 'sok'],
            gameConfig: {
                diamonds: 2,
                golds: 3,
                crystals: 1,
                mapSize: { width: 16, height: 10 }
            },
            unlockRequirement: null,
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: true
        }
        // Tu by pokračovali ďalšie levely sveta S...
    ]

    // Tu by pokračovali konfigurácie pre všetky ostatné svety...
    // world_z, world_c, world_sh, world_zh, world_ch, world_d, world_t, world_n, world_k, world_g
};

/**
 * Funkcia na získanie všetkých levelov konkrétneho sveta
 * @param {string} worldId - ID sveta
 * @returns {Array} - pole levelov daného sveta
 */
function getWorldLevels(worldId) {
    return LEVELS_CONFIG[worldId] || [];
}

/**
 * Funkcia na získanie konkrétneho levelu
 * @param {string} levelId - ID levelu
 * @returns {Object|null} - konfigurácia levelu alebo null
 */
function getLevelConfig(levelId) {
    for (const worldId in LEVELS_CONFIG) {
        const level = LEVELS_CONFIG[worldId].find(level => level.id === levelId);
        if (level) return level;
    }
    return null;
}

/**
 * Funkcia na získanie levelu podľa sveta a čísla levelu
 * @param {string} worldId - ID sveta
 * @param {number} levelNumber - číslo levelu
 * @returns {Object|null} - konfigurácia levelu alebo null
 */
function getLevelByNumber(worldId, levelNumber) {
    const worldLevels = getWorldLevels(worldId);
    return worldLevels.find(level => level.levelNumber === levelNumber) || null;
}

/**
 * Funkcia na získanie nasledujúceho levelu
 * @param {string} currentLevelId - ID aktuálneho levelu
 * @returns {Object|null} - konfigurácia nasledujúceho levelu alebo null
 */
function getNextLevel(currentLevelId) {
    const currentLevel = getLevelConfig(currentLevelId);
    if (!currentLevel) return null;
    
    return getLevelByNumber(currentLevel.worldId, currentLevel.levelNumber + 1);
}

/**
 * Funkcia na získanie predchádzajúceho levelu
 * @param {string} currentLevelId - ID aktuálneho levelu
 * @returns {Object|null} - konfigurácia predchádzajúceho levelu alebo null
 */
function getPreviousLevel(currentLevelId) {
    const currentLevel = getLevelConfig(currentLevelId);
    if (!currentLevel || currentLevel.levelNumber === 1) return null;
    
    return getLevelByNumber(currentLevel.worldId, currentLevel.levelNumber - 1);
}

/**
 * Funkcia na kontrolu, či je level odomknutý
 * @param {string} levelId - ID levelu
 * @returns {boolean} - true ak je level odomknutý
 */
function isLevelUnlocked(levelId) {
    const level = getLevelConfig(levelId);
    return level ? level.isUnlocked : false;
}

/**
 * Funkcia na získanie počtu levelov v svete
 * @param {string} worldId - ID sveta
 * @returns {number} - počet levelov v svete
 */
function getWorldLevelCount(worldId) {
    return getWorldLevels(worldId).length;
}

/**
 * Funkcia na filtrovanie levelov podľa typu hry
 * @param {string} worldId - ID sveta
 * @param {string} gameType - typ hry ('banik', 'pexeso', 'mario')
 * @returns {Array} - pole levelov s daným typom hry
 */
function getLevelsByGameType(worldId, gameType) {
    return getWorldLevels(worldId).filter(level => level.gameType === gameType);
}

// Export pre použitie v iných súboroch
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LEVELS_CONFIG,
        getWorldLevels,
        getLevelConfig,
        getLevelByNumber,
        getNextLevel,
        getPreviousLevel,
        isLevelUnlocked,
        getWorldLevelCount,
        getLevelsByGameType
    };
}