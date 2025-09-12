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
            words: ['rak', 'ryba', 'ruka'],
            gameConfig: {
                diamonds: 2,
                golds: 5,
                crystals: 3,
                speechExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 8 },  // diamant na pozícii 3,8
                    { x: 12, y: 7 }  // diamant na pozícii 12,7
                ],
                golds: [
                    { x: 2, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 8 },   // gold na pozícii 7,8
                    { x: 14, y: 6 },   // gold na pozícii 14,6
                    { x: 9, y: 8 },
                    { x: 10, y: 13 }
                ],
                crystals: [
                    { x: 9, y: 12 },    // kryštál na pozícii 9,7
                    { x: 3, y: 12 },
                    { x: 11, y: 9 }  
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: null,
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: true
        },
        {
            id: 'r_002',
            worldId: 'world_r',
            levelNumber: 2,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['rak', 'ryba', 'ruka', 'rád', 'rok'],
            gameConfig: {
                diamonds: 3,
                golds: 3,
                crystals: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 8 },  // diamant na pozícii 3,8
                    { x: 12, y: 7 },  // diamant na pozícii 12,7
                    { x: 7, y: 13 }
                ],
                golds: [
                    { x: 2, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 8 },   // gold na pozícii 7,8
                    { x: 10, y: 8 }
                ],
                crystals: [
                    { x: 9, y: 7 },    // kryštál na pozícii 9,7
                    { x: 10, y: 12 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_001',
                minStars: 1
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_003',
            worldId: 'world_r',
            levelNumber: 3,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['rak', 'ryba', 'ruka', 'rosa', 'rád', 'rok'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 1,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 8 },  // diamant na pozícii 3,8
                    { x: 12, y: 7 },  // diamant na pozícii 12,7
                    { x: 10, y: 12 }
                ],
                golds: [
                    { x: 2, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 8 },   // gold na pozícii 7,8
                    { x: 14, y: 6 },   // gold na pozícii 14,6
                    { x: 9, y: 8 },
                    { x: 10, y: 8 }
                ],
                crystals: [
                    { x: 9, y: 7 }    // kryštál na pozícii 9,7
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_002',
                minStars: 2
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_004',
            worldId: 'world_r',
            levelNumber: 4,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['rak', 'ryba', 'ruka', 'rosa', 'rád', 'rok', 'roh'],
            gameConfig: {
                diamonds: 4,
                golds: 3,
                crystals: 1,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 4, y: 8 },  // diamant na pozícii 3,8
                    { x: 10, y: 7 },  // diamant na pozícii 12,7
                    { x: 4, y: 12 },
                    { x: 9, y: 14 }
                ],
                golds: [
                    { x: 3, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 8 },   // gold na pozícii 7,8
                    { x: 14, y: 6 }   // gold na pozícii 14,6
                ],
                crystals: [
                    { x: 7, y: 11 }    // kryštál na pozícii 9,7
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_003',
                minStars: 3
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_005',
            worldId: 'world_r',
            levelNumber: 5,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['ruka', 'rosa', 'rád', 'rok', 'roh', 'ráno'],
            gameConfig: {
                diamonds: 4,
                golds: 2,
                crystals: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 6, y: 4 },  // diamant na pozícii 3,8
                    { x: 9, y: 7 },  // diamant na pozícii 12,7
                    { x: 2, y: 10 },
                    { x: 1, y: 14 }
                ],
                golds: [
                    { x: 3, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 8 }   // gold na pozícii 7,8
                ],
                crystals: [
                    { x: 7, y: 11 },    // kryštál na pozícii 9,7
                    { x: 3, y: 6 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_004',
                minStars: 4
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_006',
            worldId: 'world_r',
            levelNumber: 6,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['rok', 'rak', 'ruka', 'roh', 'ryba', 'rádio', 'ráno'],
            gameConfig: {
                diamonds: 4,
                golds: 2,
                crystals: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 5 },  // diamant na pozícii 3,8
                    { x: 4, y: 7 },  // diamant na pozícii 12,7
                    { x: 6, y: 10 },
                    { x: 2, y: 14 }
                ],
                golds: [
                    { x: 10, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 12 }   // gold na pozícii 7,8
                ],
                crystals: [
                    { x: 7, y: 11 },    // kryštál na pozícii 9,7
                    { x: 10, y: 6 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_005',
                minStars: 5
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_007',
            worldId: 'world_r',
            levelNumber: 7,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['rok', 'rak', 'ruka', 'roh', 'ryba', 'rádio', 'ráno'],
            gameConfig: {
                diamonds: 4,
                golds: 2,
                crystals: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 5 },  // diamant na pozícii 3,8
                    { x: 4, y: 7 },  // diamant na pozícii 12,7
                    { x: 6, y: 10 },
                    { x: 2, y: 14 }
                ],
                golds: [
                    { x: 3, y: 8 },   // gold na pozícii 2,9
                    { x: 7, y: 12 }   // gold na pozícii 7,8
                ],
                crystals: [
                    { x: 7, y: 11 },    // kryštál na pozícii 9,7
                    { x: 10, y: 9 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_006',
                minStars: 6
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_008',
            worldId: 'world_r',
            levelNumber: 8,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['ryba', 'rádio', 'ráno', 'rakva', 'rámus'],
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 6 },  // diamant na pozícii 3,8
                    { x: 6, y: 14 }
                ],
                golds: [
                    { x: 10, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 11 },   // gold na pozícii 7,8
                    { x: 8, y: 12 },
                    { x: 1, y: 5 }
                ],
                crystals: [
                    { x: 9, y: 11 },    // kryštál na pozícii 9,7
                    { x: 14, y: 8 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_007',
                minStars: 7
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_009',
            worldId: 'world_r',
            levelNumber: 9,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['rádio', 'ráno', 'rakva', 'rámus', 'párik'],
            gameConfig: {
                diamonds: 3,
                golds: 3,
                crystals: 1,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 6 },  // diamant na pozícii 3,8
                    { x: 10, y: 14 },
                    { x: 2, y: 9 }
                ],
                golds: [
                    { x: 7, y: 11 },   // gold na pozícii 7,8
                    { x: 12, y: 12 },
                    { x: 1, y: 5 }
                ],
                crystals: [
                    { x: 9, y: 11 },    // kryštál na pozícii 9,7
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_008',
                minStars: 10
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_010',
            worldId: 'world_r',
            levelNumber: 10,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['ryba', 'rádio', 'ráno', 'rakva', 'rámus', 'rýchly'],
            gameConfig: {
                diamonds: 4,
                golds: 6,
                crystals: 1,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 6 },  // diamant na pozícii 3,8
                    { x: 10, y: 14 },
                    { x: 6, y: 5 },
                    { x: 2, y: 10 }
                ],
                golds: [
                    { x: 10, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 11 },   // gold na pozícii 7,8
                    { x: 12, y: 12 },
                    { x: 1, y: 5 },
                    { x: 3, y: 8 },
                    { x: 7, y: 4 }
                ],
                crystals: [
                    { x: 14, y: 6 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_009',
                minStars: 11
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_011',
            worldId: 'world_r',
            levelNumber: 11,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['rámus', 'rýchly', 'rakva', 'raketa'],
            gameConfig: {
                diamonds: 2,
                golds: 2,
                crystals: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 6 },  // diamant na pozícii 3,8
                    { x: 3, y: 12 }
                ],
                golds: [
                    { x: 10, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 11 },   // gold na pozícii 7,8
                    { x: 1, y: 10 },
                    { x: 1, y: 5 }
                ],
                crystals: [
                    { x: 9, y: 11 },    // kryštál na pozícii 9,7
                    { x: 6, y: 6 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_010',
                minStars: 12
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_012',
            worldId: 'world_r',
            levelNumber: 12,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['ryba', 'rádio', 'ráno', 'rakva', 'rámus', 'rýchly', 'raketa'],
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 6 },  // diamant na pozícii 3,8
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 10, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 11 },   // gold na pozícii 7,8
                    { x: 12, y: 12 },
                    { x: 1, y: 5 }
                ],
                crystals: [
                    { x: 9, y: 11 }    // kryštál na pozícii 9,7
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_011',
                minStars: 13
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_013',
            worldId: 'world_r',
            levelNumber: 13,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['ryba', 'rádio', 'ráno', 'rakva', 'rámus', 'rýchly', 'raketa', 'rybár', 'králik'],
            gameConfig: {
                diamonds: 5,
                golds: 3,
                crystals: 1,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 4, y: 12 },  // diamant na pozícii 3,8
                    { x: 9, y: 10 },
                    { x: 10, y: 14 },
                    { x: 5, y: 2 },
                    { x: 2, y: 10 }
                ],
                golds: [
                    { x: 10, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 10 },   // gold na pozícii 7,8
                    { x: 2, y: 6 }
                ],
                crystals: [
                    { x: 3, y: 6 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_012',
                minStars: 14
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_014',
            worldId: 'world_r',
            levelNumber: 14,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['rámus', 'rýchly', 'raketa', 'rybár', 'králik'],
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 6 },  // diamant na pozícii 3,8
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 10, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 11 },   // gold na pozícii 7,8
                    { x: 12, y: 12 },
                    { x: 1, y: 5 }
                ],
                crystals: [
                    { x: 9, y: 11 }    
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_013',
                minStars: 15
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_015',
            worldId: 'world_r',
            levelNumber: 15,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['brána', 'pravda', 'mravec'],
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 6 },  // diamant na pozícii 3,8
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 8, y: 10 },   // gold na pozícii 2,9
                    { x: 7, y: 11 },   // gold na pozícii 7,8
                    { x: 4, y: 6 },
                    { x: 2, y: 5 }
                ],
                crystals: [
                    { x: 2, y: 4 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_014',
                minStars: 16
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'r_016',
            worldId: 'world_r',
            levelNumber: 16,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['brána', 'pravda', 'mravec', 'rybár', 'tráva', 'králik', 'ryba'],
            gameConfig: {
                diamonds: 4,
                golds: 2,
                crystals: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 4, y: 6 },  // diamant na pozícii 3,8
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 10, y: 10 },   // gold na pozícii 2,9
                    { x: 7, y: 11 },   // gold na pozícii 7,8
                    { x: 6, y: 12 },
                    { x: 3, y: 7 }
                ],
                crystals: [
                    { x: 10, y: 11 },    // kryštál na pozícii 9,7
                    { x: 2, y: 6 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_015',
                minStars: 17
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
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