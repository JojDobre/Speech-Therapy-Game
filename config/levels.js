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
 * - pozicia na y min 6 maxx 15. x min 0 max 15
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
            name: 'Prvé R-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['rak', 'ryba', 'ruka'],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 1,
                speechExercises: 1,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 12, y: 7 }
                ],
                golds: [
                    { x: 2, y: 9 }, 
					{ x: 5, y: 10 }, 
                    { x: 10, y: 13 },
                ],
                crystals: [
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
            name: 'Prvé R-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['rak', 'ryba', 'ruka', 'rád', 'drak'],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 2,
				speechExercises: 1,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 6, y: 10 },
                ],
                golds: [
                    { x: 2, y: 9 },   
                    { x: 7, y: 8 },   
                    { x: 10, y: 8 }
                ],
                crystals: [
                    { x: 9, y: 7 },    
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
            name: 'Prvé R-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['rak', 'ryba', 'ruka', 'rosa', 'rád', 'drak'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 1,
				speechExercises: 1,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 8 },  
                    { x: 12, y: 7 },  
                    { x: 10, y: 12 }
                ],
                golds: [
                    { x: 2, y: 9 },   
                    { x: 7, y: 8 },   
                    { x: 14, y: 9 },   
                    { x: 9, y: 10 },
                    { x: 10, y: 12 }
                ],
                crystals: [
                    { x: 1, y: 15 }    
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
            name: 'Prvé R-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['rak', 'ryba', 'ruka', 'rosa', 'rád', 'drak', 'traktor'],
            gameConfig: {
                diamonds: 3,
                golds: 3,
                crystals: 2,
				speechExercises: 2,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 7 },  
                    { x: 9, y: 14 }
                ],
                golds: [
                    { x: 3, y: 9 },  
                    { x: 7, y: 8 },   
                    { x: 14, y: 6 }   
                ],
                crystals: [
					{ x: 4, y: 12 },
                    { x: 7, y: 11 }   
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
            difficulty: 2,
            words: ['ruka', 'rosa', 'rád', 'rok', 'drak', 'ráno'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 4,
				speechExercises: 2,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 13, y: 8 }, 
                    { x: 9, y: 10 },  
                    { x: 1, y: 14 }
                ],
                golds: [
                    { x: 0, y: 9 },
                    { x: 3, y: 10 },					
                    { x: 7, y: 8 }   
                ],
                crystals: [
                    { x: 2, y: 10 },
                    { x: 6, y: 12 },
                    { x: 14, y: 14 },					
                    { x: 8, y: 8 } 
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
            difficulty: 2,
            words: ['rok', 'rak', 'ruka', 'traktor', 'ryba', 'rádio', 'ráno'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 7 }, 
                    { x: 10, y: 7 },  
                    { x: 2, y: 14 }
                ],
                golds: [
                    { x: 1, y: 9 },
                    { x: 10, y: 10 },
                    { x: 6, y: 7 },
                    { x: 3, y: 15 },					
                    { x: 15, y: 12 }   
                ],
                crystals: [
                    { x: 7, y: 11 },   
                    { x: 10, y: 15 } 
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
            difficulty: 2,
            words: ['rok', 'rak', 'ruka', 'roh', 'ryba', 'rádio', 'ráno'],
            gameConfig: {
                diamonds: 2,
                golds: 2,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 10 },  
                    { x: 14, y: 14 }
                ],
                golds: [
                    { x: 5, y: 8 },   
                    { x: 7, y: 12 }  
                ],
                crystals: [   
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
            difficulty: 2,
            words: ['ryba', 'rádio', 'ráno', 'rakva', 'rámus'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 10, y: 6 }, 
                    { x: 6, y: 14 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 8, y: 12 },
                    { x: 1, y: 7 }
                ],
                crystals: [
                    { x: 9, y: 15 },    
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
            difficulty: 3,
            words: ['rádio', 'ráno', 'rakva', 'rámus', 'párik'],
            gameConfig: {
				diamonds: 3,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 },
                    { x: 2, y: 9 }
                ],
                golds: [
                    { x: 7, y: 11 },   
                    { x: 12, y: 12 },
                    { x: 0, y: 7 }
                ],
                crystals: [
                    { x: 9, y: 11 },    
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
            difficulty: 3,
            words: ['ryba', 'rádio', 'ráno', 'rakva', 'rámus', 'rýchly'],
            gameConfig: {
				diamonds: 4,
                golds: 6,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 6 },  
                    { x: 10, y: 14 },
                    { x: 6, y: 8 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 12, y: 12 },
                    { x: 1, y: 9 },
                    { x: 3, y: 8 },
                    { x: 5, y: 11 }
                ],
                crystals: [
                    { x: 14, y: 10 } 
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
            name: 'Prvé Rka',
            gameType: 'banik',
            difficulty: 3,
            words: ['rámus', 'rýchly', 'rakva', 'raketa'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 2,
				speechExercises: 3,
                listeningExercises: 1, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 15, y: 14 },  
					{ x: 12, y: 15 },  
                    { x: 3, y: 12 }
                ],
                golds: [
                    { x: 10, y: 9 },   
                    { x: 7, y: 11 },   
                    { x: 4, y: 15 },
                    { x: 5, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 13 },    
                    { x: 6, y: 7 } 
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
            difficulty: 3,
            words: ['ryba', 'rádio', 'ráno', 'rakva', 'rámus', 'rýchly', 'raketa'],
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 2, 
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 7 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 6, y: 9 },   
                    { x: 7, y: 11 },  
                    { x: 14, y: 12 },
                    { x: 4, y: 10 }
                ],
                crystals: [
                    { x: 9, y: 15 }    
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
            difficulty: 4,
            words: ['ryba', 'rádio', 'ráno', 'rakva', 'rámus', 'rýchly', 'raketa', 'rybár', 'králik'],
            gameConfig: {
                diamonds: 5,
                golds: 3,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 4, y: 12 },  // diamant na pozícii 3,8
                    { x: 9, y: 11 },
                    { x: 10, y: 14 },
                    { x: 5, y: 9 },
                    { x: 0, y: 10 }
                ],
                golds: [
                    { x: 14, y: 9 },   // gold na pozícii 2,9
                    { x: 7, y: 10 },   // gold na pozícii 7,8
                    { x: 2, y: 6 }
                ],
                crystals: [
                    { x: 3, y: 8 } 
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
            difficulty: 4,
            words: ['rámus', 'rýchly', 'raketa', 'rybár', 'králik'],
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 4,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 10 },  
                    { x: 10, y: 14 }
                ],
                golds: [
                    { x: 10, y: 10 },   
                    { x: 0, y: 12 },   
                    { x: 6, y: 13 },
                    { x: 14, y: 15 }
                ],
                crystals: [
                    { x: 9, y: 8 }    
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
            difficulty: 4,
            words: ['brána', 'pravda', 'mravec', 'raketa', 'drak'],
            gameConfig: {
                diamonds: 2,
                golds: 4,
                crystals: 1,
				speechExercises: 3,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 8 },  
                    { x: 10, y: 10 }
                ],
                golds: [
                    { x: 0, y: 11 },   
                    { x: 4, y: 9 },  
                    { x: 7, y: 15 },
                    { x: 15, y: 13 }
                ],
                crystals: [
                    { x: 13, y: 12 }
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
            difficulty: 5,
            words: ['brána', 'pravda', 'mravec', 'rybár', 'tráva', 'králik', 'ryba', 'rádio', 'ráno', 'rakva', 'rak', 'ruka', 'rosa', 'rád', 'drak'],
            gameConfig: {
                diamonds: 5,
                golds: 6,
                crystals: 2,
				speechExercises: 4,
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 0, y: 8 },
					{ x: 12, y: 10 },
					{ x: 9, y: 12 },
					{ x: 4, y: 13 },					
                    { x: 15, y: 15 }
                ],
                golds: [
                    { x: 1, y: 8 },
					{ x: 2, y: 15 },
					{ x: 5, y: 13 },					
                    { x: 7, y: 9 },   
                    { x: 6, y: 15 },
                    { x: 13, y: 7 }
                ],
                crystals: [
                    { x: 10, y: 11 },  
                    { x: 2, y: 10 } 
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'r_015',
                minStars: 20
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
            name: 'Prvé L-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['lano', 'lopta', 'list', 'les'],  // 4 slová pre začiatok
            gameConfig: {
                diamonds: 1,     // málo diamantov pre začiatok
                golds: 2,        // trochu viac goldov
                crystals: 1,     // jeden kryštál
                speechExercises: 1,
                listeningExercises: 1,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 8, y: 5 }  // diamant v strede mapy
                ],
                golds: [
                    { x: 3, y: 2 },   // gold vľavo hore
                    { x: 13, y: 8 }   // gold vpravo dole
                ],
                crystals: [
                    { x: 10, y: 4 }   // kryštál vpravo
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: null,
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: true
        },
        {
            id: 'l_002',
            worldId: 'world_l',
            levelNumber: 2,
            name: 'Ľahké L-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['lano', 'lopta', 'list', 'les', 'líška', 'lyžica'],  // 6 slov
            gameConfig: {
                diamonds: 2,
                golds: 3,
                crystals: 1,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 5, y: 3 },
                    { x: 11, y: 7 }
                ],
                golds: [
                    { x: 2, y: 5 },
                    { x: 8, y: 2 },
                    { x: 14, y: 9 }
                ],
                crystals: [
                    { x: 7, y: 6 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_001',
                minStars: 1
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_003',
            worldId: 'world_l',
            levelNumber: 3,
            name: 'Lavička a lúka',
            gameType: 'banik',
            difficulty: 1,
            words: ['lopta', 'list', 'líška', 'lyžica', 'lavička', 'lúka', 'ľalia'],  // 7 slov
            gameConfig: {
                diamonds: 3,
                golds: 3,
                crystals: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 4, y: 4 },
                    { x: 9, y: 8 },
                    { x: 13, y: 2 }
                ],
                golds: [
                    { x: 1, y: 7 },
                    { x: 6, y: 5 },
                    { x: 11, y: 3 }
                ],
                crystals: [
                    { x: 3, y: 9 },
                    { x: 14, y: 6 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_002',
                minStars: 2
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_004',
            worldId: 'world_l',
            levelNumber: 4,
            name: 'Lampa a lekár',
            gameType: 'banik',
            difficulty: 1,
            words: ['lopta', 'lúka', 'lavička', 'lyžica', 'ľalia', 'lampa',  'lekár'],  // 8 slov
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 2, y: 3 },
                    { x: 8, y: 7 },
                    { x: 12, y: 5 }
                ],
                golds: [
                    { x: 5, y: 2 },
                    { x: 7, y: 9 },
                    { x: 10, y: 6 },
                    { x: 14, y: 4 }
                ],
                crystals: [
                    { x: 4, y: 8 },
                    { x: 11, y: 1 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_003',
                minStars: 3
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_005',
            worldId: 'world_l',
            levelNumber: 5,
            name: 'Prvé opakovanie',  // opakovací level
            gameType: 'banik',
            difficulty: 2,
            words: ['lano', 'lopta', 'list', 'les', 'líška', 'lyžica', 'lavička', 'lúka', 'ľalia', 'lampa', 'lekár'],  // 12 slov - opakovanie
            gameConfig: {
                diamonds: 4,
                golds: 5,
                crystals: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 8 },
                    { x: 6, y: 6 },
                    { x: 10, y: 4 },
                    { x: 13, y: 8 }
                ],
                golds: [
                    { x: 1, y: 5 },
                    { x: 5, y: 9 },
                    { x: 8, y: 3 },
                    { x: 11, y: 7 },
                    { x: 14, y: 2 }
                ],
                crystals: [
                    { x: 7, y: 8 },
                    { x: 12, y: 1 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_004',
                minStars: 4
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_006',
            worldId: 'world_l',
            levelNumber: 6,
            name: 'Lavína a lietadlo',
            gameType: 'banik',
            difficulty: 2,
            words: ['lopta', 'lúka', 'lampa', 'lekár', 'líška', 'lavína', 'lietadlo', 'list', 'lev', 'lavička'],  // 10 slov
            gameConfig: {
                diamonds: 4,
                golds: 4,
                crystals: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 2, y: 6 },
                    { x: 7, y: 2 },
                    { x: 9, y: 9 },
                    { x: 14, y: 5 }
                ],
                golds: [
                    { x: 4, y: 3 },
                    { x: 6, y: 7 },
                    { x: 11, y: 4 },
                    { x: 13, y: 9 }
                ],
                crystals: [
                    { x: 1, y: 8 },
                    { x: 8, y: 5 },
                    { x: 12, y: 2 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_005',
                minStars: 5
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_007',
            worldId: 'world_l',
            levelNumber: 7,
            name: 'Leňochod a lízatko',
            gameType: 'banik',
            difficulty: 2,
            words: ['lopta', 'lúka', 'lavína', 'lietadlo', 'lev', 'lavička', 'leňochod', 'lupa', 'lúč', 'lízatko'],  // 10 slov
            gameConfig: {
                diamonds: 4,
                golds: 5,
                crystals: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 4 },
                    { x: 8, y: 8 },
                    { x: 10, y: 2 },
                    { x: 14, y: 7 }
                ],
                golds: [
                    { x: 1, y: 3 },
                    { x: 5, y: 6 },
                    { x: 7, y: 1 },
                    { x: 11, y: 9 },
                    { x: 13, y: 4 }
                ],
                crystals: [
                    { x: 6, y: 9 },
                    { x: 12, y: 6 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_006',
                minStars: 6
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_008',
            worldId: 'world_l',
            levelNumber: 8,
            name: 'Lyže a letisko',
            gameType: 'banik',
            difficulty: 2,
            words: ['lopta', 'lietadlo', 'lupa', 'lúč', 'lízatko', 'lavína', 'lyže', 'linka', 'letisko', 'lilka'],  // 10 slov
            gameConfig: {
                diamonds: 5,
                golds: 4,
                crystals: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 2, y: 2 },
                    { x: 5, y: 7 },
                    { x: 9, y: 4 },
                    { x: 12, y: 8 },
                    { x: 14, y: 1 }
                ],
                golds: [
                    { x: 3, y: 5 },
                    { x: 7, y: 3 },
                    { x: 10, y: 9 },
                    { x: 13, y: 6 }
                ],
                crystals: [
                    { x: 4, y: 9 },
                    { x: 8, y: 6 },
                    { x: 11, y: 2 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_007',
                minStars: 7
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_009',
            worldId: 'world_l',
            levelNumber: 9,
            name: 'Levanduľa a ľudina',
            gameType: 'banik',
            difficulty: 2,
            words: ['lopta', 'lúka', 'lietadlo', 'linka', 'lilka', 'levanduľa', 'list', 'lavína', 'lízatko', 'ľudina'],  // 10 slov
            gameConfig: {
                diamonds: 5,
                golds: 5,
                crystals: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 4 },
                    { x: 6, y: 2 },
                    { x: 8, y: 9 },
                    { x: 11, y: 5 },
                    { x: 14, y: 8 }
                ],
                golds: [
                    { x: 3, y: 7 },
                    { x: 5, y: 3 },
                    { x: 9, y: 6 },
                    { x: 12, y: 1 },
                    { x: 13, y: 9 }
                ],
                crystals: [
                    { x: 7, y: 7 },
                    { x: 10, y: 3 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_008',
                minStars: 8
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_010',
            worldId: 'world_l',
            levelNumber: 10,
            name: 'Veľké opakovanie',  // opakovací level - všetky slová z 1-9
            gameType: 'banik',
            difficulty: 3,
            words: ['lano', 'lopta', 'list', 'les', 'líška', 'lyžica', 'lavička', 'lúka', 'ľalia', 'lampa', 
                    'lúč', 'lekár', 'lavína', 'lietadlo', 'lev', 'leňochod', 'lupa', 'lízatko', 'lyže', 'linka', 
                    'letisko', 'lilka', 'levanduľa', 'ľudina'],  // 24 slov
            gameConfig: {
                diamonds: 6,
                golds: 6,
                crystals: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 2, y: 3 },
                    { x: 4, y: 8 },
                    { x: 7, y: 5 },
                    { x: 10, y: 2 },
                    { x: 12, y: 7 },
                    { x: 14, y: 4 }
                ],
                golds: [
                    { x: 1, y: 6 },
                    { x: 5, y: 1 },
                    { x: 6, y: 9 },
                    { x: 9, y: 4 },
                    { x: 11, y: 8 },
                    { x: 13, y: 3 }
                ],
                crystals: [
                    { x: 3, y: 5 },
                    { x: 8, y: 7 },
                    { x: 15, y: 9 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_009',
                minStars: 9
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_011',
            worldId: 'world_l',
            levelNumber: 11,
            name: 'Lyžiar a lektvar',
            gameType: 'banik',
            difficulty: 3,
            words: ['lopta', 'lúka', 'lietadlo', 'lavička', 'lupa', 'linka', 'lilka', 'levanduľa', 'lyžiar', 'lektvar'],  // 10 slov
            gameConfig: {
                diamonds: 5,
                golds: 5,
                crystals: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 1 },
                    { x: 6, y: 4 },
                    { x: 9, y: 8 },
                    { x: 11, y: 3 },
                    { x: 14, y: 6 }
                ],
                golds: [
                    { x: 2, y: 7 },
                    { x: 5, y: 5 },
                    { x: 8, y: 2 },
                    { x: 10, y: 9 },
                    { x: 13, y: 2 }
                ],
                crystals: [
                    { x: 4, y: 3 },
                    { x: 7, y: 6 },
                    { x: 12, y: 9 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_010',
                minStars: 10
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_012',
            worldId: 'world_l',
            levelNumber: 12,
            name: 'Laboratórium',
            gameType: 'banik',
            difficulty: 3,
            words: ['lopta', 'lúka', 'levanduľa', 'lektvar', 'lyžiar', 'laboratórium', 'lektor', 'lavína', 'lúčny', 'líška'],  // 10 slov
            gameConfig: {
                diamonds: 5,
                golds: 6,
                crystals: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 2 },
                    { x: 5, y: 8 },
                    { x: 8, y: 4 },
                    { x: 11, y: 7 },
                    { x: 13, y: 1 }
                ],
                golds: [
                    { x: 3, y: 6 },
                    { x: 4, y: 2 },
                    { x: 7, y: 9 },
                    { x: 9, y: 3 },
                    { x: 12, y: 5 },
                    { x: 14, y: 8 }
                ],
                crystals: [
                    { x: 6, y: 6 },
                    { x: 10, y: 1 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_011',
                minStars: 11
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_013',
            worldId: 'world_l',
            levelNumber: 13,
            name: 'Leporelo a lodička',
            gameType: 'banik',
            difficulty: 3,
            words: ['lopta', 'lúka', 'lektor', 'laboratórium', 'lúčny', 'levanduľa', 'leporelo', 'lodička', 'lízatko', 'lekáreň'],  // 10 slov
            gameConfig: {
                diamonds: 6,
                golds: 5,
                crystals: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 2, y: 5 },
                    { x: 5, y: 2 },
                    { x: 7, y: 8 },
                    { x: 10, y: 4 },
                    { x: 12, y: 9 },
                    { x: 15, y: 6 }
                ],
                golds: [
                    { x: 3, y: 3 },
                    { x: 6, y: 7 },
                    { x: 9, y: 1 },
                    { x: 11, y: 6 },
                    { x: 14, y: 3 }
                ],
                crystals: [
                    { x: 4, y: 9 },
                    { x: 8, y: 5 },
                    { x: 13, y: 7 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_012',
                minStars: 12
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_014',
            worldId: 'world_l',
            levelNumber: 14,
            name: 'Laborant a linkový',
            gameType: 'banik',
            difficulty: 3,
            words: ['lopta', 'lúka', 'leporelo', 'lodička', 'lekáreň', 'lavína', 'lektor', 'laborant', 'linkový', 'listnatý'],  // 10 slov
            gameConfig: {
                diamonds: 6,
                golds: 6,
                crystals: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 3 },
                    { x: 4, y: 7 },
                    { x: 7, y: 2 },
                    { x: 9, y: 9 },
                    { x: 12, y: 4 },
                    { x: 14, y: 8 }
                ],
                golds: [
                    { x: 2, y: 1 },
                    { x: 5, y: 5 },
                    { x: 8, y: 8 },
                    { x: 10, y: 3 },
                    { x: 11, y: 7 },
                    { x: 13, y: 2 }
                ],
                crystals: [
                    { x: 6, y: 3 },
                    { x: 15, y: 5 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_013',
                minStars: 13
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_015',
            worldId: 'world_l',
            levelNumber: 15,
            name: 'Tretie opakovanie',  // opakovací level - všetky slová z 1-14
            gameType: 'banik',
            difficulty: 4,
            words: ['lano', 'lopta', 'list', 'les', 'líška', 'lyžica', 'lavička', 'lúka', 'ľalia', 'lampa',
                    'lúč', 'lekár', 'lavína', 'lietadlo', 'lev', 'leňochod', 'lupa', 'lízatko', 'lyže', 'linka',
                    'letisko', 'lilka', 'levanduľa', 'ľudina', 'lyžiar', 'lektvar', 'laboratórium', 'lektor', 'lúčny',
                    'leporelo', 'lodička', 'lekáreň', 'laborant', 'linkový', 'listnatý'],  // 35 slov
            gameConfig: {
                diamonds: 7,
                golds: 7,
                crystals: 4,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 2, y: 2 },
                    { x: 4, y: 5 },
                    { x: 6, y: 8 },
                    { x: 8, y: 3 },
                    { x: 10, y: 6 },
                    { x: 12, y: 1 },
                    { x: 14, y: 9 }
                ],
                golds: [
                    { x: 1, y: 7 },
                    { x: 3, y: 4 },
                    { x: 5, y: 1 },
                    { x: 7, y: 6 },
                    { x: 9, y: 8 },
                    { x: 11, y: 3 },
                    { x: 13, y: 5 }
                ],
                crystals: [
                    { x: 2, y: 9 },
                    { x: 6, y: 2 },
                    { x: 10, y: 7 },
                    { x: 15, y: 4 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_014',
                minStars: 14
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_016',
            worldId: 'world_l',
            levelNumber: 16,
            name: 'Liter a lievik',
            gameType: 'banik',
            difficulty: 4,
            words: ['lopta', 'lúka', 'laborant', 'listnatý', 'linkový', 'levanduľa', 'liter', 'lievik', 'lampa', 'lopúch'],  // 10 slov
            gameConfig: {
                diamonds: 6,
                golds: 6,
                crystals: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 6 },
                    { x: 5, y: 3 },
                    { x: 8, y: 7 },
                    { x: 10, y: 2 },
                    { x: 12, y: 8 },
                    { x: 15, y: 1 }
                ],
                golds: [
                    { x: 2, y: 4 },
                    { x: 4, y: 9 },
                    { x: 7, y: 1 },
                    { x: 9, y: 5 },
                    { x: 11, y: 9 },
                    { x: 14, y: 6 }
                ],
                crystals: [
                    { x: 6, y: 5 },
                    { x: 10, y: 8 },
                    { x: 13, y: 3 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_015',
                minStars: 15
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        }
        /*{
            id: 'l_017',
            worldId: 'world_l',
            levelNumber: 17,
            name: 'Logopéd a lesník',
            gameType: 'banik',
            difficulty: 4,
            words: ['lopta', 'lúka', 'liter', 'lievik', 'lopúch', 'lekáreň', 'logopéd', 'listnatý', 'lavína', 'lavička'],  // 10 slov
            gameConfig: {
                diamonds: 7,
                golds: 5,
                crystals: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 5 },
                    { x: 4, y: 2 },
                    { x: 6, y: 9 },
                    { x: 8, y: 4 },
                    { x: 11, y: 7 },
                    { x: 13, y: 1 },
                    { x: 15, y: 8 }
                ],
                golds: [
                    { x: 3, y: 8 },
                    { x: 5, y: 4 },
                    { x: 9, y: 6 },
                    { x: 12, y: 3 },
                    { x: 14, y: 5 }
                ],
                crystals: [
                    { x: 2, y: 7 },
                    { x: 7, y: 3 },
                    { x: 10, y: 9 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_016',
                minStars: 16
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_018',
            worldId: 'world_l',
            levelNumber: 18,
            name: 'Lesník a ľudovosť',
            gameType: 'banik',
            difficulty: 4,
            words: ['lopta', 'lúka', 'logopéd', 'lopúch', 'liter', 'lievik', 'lesník', 'ľudovosť', 'laborant', 'linkový'],  // 10 slov
            gameConfig: {
                diamonds: 7,
                golds: 6,
                crystals: 4,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 2, y: 3 },
                    { x: 4, y: 6 },
                    { x: 7, y: 1 },
                    { x: 9, y: 8 },
                    { x: 11, y: 4 },
                    { x: 13, y: 9 },
                    { x: 15, y: 2 }
                ],
                golds: [
                    { x: 1, y: 8 },
                    { x: 3, y: 5 },
                    { x: 6, y: 7 },
                    { x: 8, y: 3 },
                    { x: 10, y: 6 },
                    { x: 14, y: 7 }
                ],
                crystals: [
                    { x: 5, y: 9 },
                    { x: 9, y: 2 },
                    { x: 12, y: 5 },
                    { x: 15, y: 6 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_017',
                minStars: 17
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_019',
            worldId: 'world_l',
            levelNumber: 19,
            name: 'Predposledný level',
            gameType: 'banik',
            difficulty: 4,
            words: ['lopta', 'lúka', 'logopéd', 'laborant', 'ľudovosť', 'liter', 'listnatý', 'levanduľa', 'lampa', 'lúčny'],  // 10 slov
            gameConfig: {
                diamonds: 8,
                golds: 6,
                crystals: 4,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 2 },
                    { x: 3, y: 7 },
                    { x: 5, y: 3 },
                    { x: 7, y: 9 },
                    { x: 9, y: 5 },
                    { x: 11, y: 1 },
                    { x: 13, y: 6 },
                    { x: 15, y: 4 }
                ],
                golds: [
                    { x: 2, y: 5 },
                    { x: 4, y: 8 },
                    { x: 6, y: 1 },
                    { x: 10, y: 7 },
                    { x: 12, y: 3 },
                    { x: 14, y: 9 }
                ],
                crystals: [
                    { x: 3, y: 3 },
                    { x: 8, y: 6 },
                    { x: 11, y: 8 },
                    { x: 14, y: 2 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_018',
                minStars: 18
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'l_020',
            worldId: 'world_l',
            levelNumber: 20,
            name: 'Veľké finále L',  // finálny level - všetky slová
            gameType: 'banik',
            difficulty: 5,
            words: ['lano', 'lopta', 'list', 'les', 'líška', 'lyžica', 'lavička', 'lúka', 'ľalia', 'lampa',
                    'lúč', 'lekár', 'lavína', 'lietadlo', 'lev', 'leňochod', 'lupa', 'lízatko', 'lyže', 'linka',
                    'letisko', 'lilka', 'levanduľa', 'ľudina', 'lyžiar', 'lektvar', 'laboratórium', 'lektor', 'lúčny',
                    'leporelo', 'lodička', 'lekáreň', 'laborant', 'linkový', 'listnatý', 'liter', 'lievik', 'lopúch',
                    'logopéd', 'lesník', 'ľudovosť'],  // 41 slov - všetky
            gameConfig: {
                diamonds: 10,
                golds: 8,
                crystals: 5,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 4 },
                    { x: 2, y: 8 },
                    { x: 4, y: 1 },
                    { x: 5, y: 6 },
                    { x: 7, y: 3 },
                    { x: 9, y: 7 },
                    { x: 10, y: 2 },
                    { x: 12, y: 9 },
                    { x: 13, y: 5 },
                    { x: 15, y: 7 }
                ],
                golds: [
                    { x: 2, y: 2 },
                    { x: 3, y: 6 },
                    { x: 6, y: 8 },
                    { x: 8, y: 1 },
                    { x: 9, y: 4 },
                    { x: 11, y: 6 },
                    { x: 14, y: 3 },
                    { x: 15, y: 9 }
                ],
                crystals: [
                    { x: 4, y: 4 },
                    { x: 6, y: 5 },
                    { x: 8, y: 9 },
                    { x: 11, y: 3 },
                    { x: 13, y: 8 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 'l_019',
                minStars: 19
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        }*/
    ],

    // ===============================
    // SVET S - Písmeno S  
    // ===============================
    world_s: [
        {
            id: 's_001',
            worldId: 'world_s',
            levelNumber: 1,
            name: 'Prvé S-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['slnko', 'sova', 'seno', 'soľ'],  // 4 slová pre začiatok
            gameConfig: {
                diamonds: 1,     // málo diamantov pre začiatok
                golds: 2,        // trochu viac goldov
                crystals: 1,     // jeden kryštál
                speechExercises: 1,  // 1 slovo na vyslovenie
                listeningExercises: 1, // 1 slovo na počúvanie
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 7, y: 4 }  // diamant v strede mapy
                ],
                golds: [
                    { x: 4, y: 3 },   // gold vľavo
                    { x: 12, y: 7 }   // gold vpravo
                ],
                crystals: [
                    { x: 9, y: 6 }   // kryštál vpravo
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: null,
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: true
        },
        {
            id: 's_002',
            worldId: 'world_s',
            levelNumber: 2,
            name: 'Suka a srdce',
            gameType: 'banik',
            difficulty: 1,
            words: ['slnko', 'sova', 'seno', 'soľ', 'suka', 'srdce'],  // 6 slov
            gameConfig: {
                diamonds: 2,
                golds: 3,
                crystals: 1,
                speechExercises: 1,  // stále 1 slovo
                listeningExercises: 1,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 6, y: 2 },
                    { x: 10, y: 8 }
                ],
                golds: [
                    { x: 3, y: 6 },
                    { x: 7, y: 4 },
                    { x: 13, y: 5 }
                ],
                crystals: [
                    { x: 11, y: 3 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_001',
                minStars: 1
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_003',
            worldId: 'world_s',
            levelNumber: 3,
            name: 'Stôl a silák',
            gameType: 'banik',
            difficulty: 1,
            words: ['slnko', 'sova', 'seno', 'srdce', 'soľ', 'stôl', 'silák'],  // 7 slov
            gameConfig: {
                diamonds: 2,
                golds: 3,
                crystals: 2,
                speechExercises: 2,  // zvyšujeme na 2 slová
                listeningExercises: 1,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 5, y: 5 },
                    { x: 12, y: 2 }
                ],
                golds: [
                    { x: 2, y: 8 },
                    { x: 8, y: 6 },
                    { x: 14, y: 4 }
                ],
                crystals: [
                    { x: 4, y: 3 },
                    { x: 10, y: 9 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_002',
                minStars: 2
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_004',
            worldId: 'world_s',
            levelNumber: 4,
            name: 'Sitko a sviečka',
            gameType: 'banik',
            difficulty: 1,
            words: ['slnko', 'stôl', 'silák', 'sova', 'seno', 'srdce', 'sitko', 'sviečka'],  // 8 slov
            gameConfig: {
                diamonds: 3,
                golds: 3,
                crystals: 2,
                speechExercises: 2,  // 2 slová
                listeningExercises: 2,  // zvyšujeme aj posluch
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 4 },
                    { x: 9, y: 7 },
                    { x: 13, y: 3 }
                ],
                golds: [
                    { x: 6, y: 8 },
                    { x: 11, y: 5 },
                    { x: 2, y: 2 }
                ],
                crystals: [
                    { x: 7, y: 2 },
                    { x: 14, y: 8 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_003',
                minStars: 3
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_005',
            worldId: 'world_s',
            levelNumber: 5,
            name: 'Prvé opakovanie',  // opakovací level
            gameType: 'banik',
            difficulty: 2,
            words: ['slnko', 'sova', 'seno', 'soľ', 'suka', 'srdce', 'stôl', 'silák', 'sitko', 'sviečka'],  // 10 slov
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 2,
                speechExercises: 3,  // zvyšujeme na 3 slová
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 4, y: 6 },
                    { x: 10, y: 3 },
                    { x: 15, y: 9 }
                ],
                golds: [
                    { x: 2, y: 4 },
                    { x: 7, y: 7 },
                    { x: 12, y: 1 },
                    { x: 5, y: 9 }
                ],
                crystals: [
                    { x: 8, y: 5 },
                    { x: 13, y: 7 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_004',
                minStars: 4
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_006',
            worldId: 'world_s',
            levelNumber: 6,
            name: 'Skala a smiech',
            gameType: 'banik',
            difficulty: 2,
            words: ['slnko', 'stôl', 'sitko', 'srdce', 'sviečka', 'skala', 'smiech', 'sneh', 'sliepka', 'slama'],  // 10 slov
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 3,
                speechExercises: 3,  // 3 slová
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 7 },
                    { x: 8, y: 2 },
                    { x: 14, y: 6 }
                ],
                golds: [
                    { x: 5, y: 4 },
                    { x: 9, y: 8 },
                    { x: 11, y: 2 },
                    { x: 2, y: 9 }
                ],
                crystals: [
                    { x: 6, y: 6 },
                    { x: 12, y: 4 },
                    { x: 4, y: 1 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_005',
                minStars: 5
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_007',
            worldId: 'world_s',
            levelNumber: 7,
            name: 'Sestra a sídlo',
            gameType: 'banik',
            difficulty: 2,
            words: ['slnko', 'sneh', 'smiech', 'skala', 'sliepka', 'slama', 'sestra', 'sídlo', 'sklo', 'sladkosť'],  // 10 slov
            gameConfig: {
                diamonds: 4,
                golds: 4,
                crystals: 2,
                speechExercises: 3,
                listeningExercises: 3,  // zvyšujeme posluch
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 2, y: 3 },
                    { x: 7, y: 9 },
                    { x: 11, y: 5 },
                    { x: 15, y: 2 }
                ],
                golds: [
                    { x: 4, y: 7 },
                    { x: 9, y: 3 },
                    { x: 13, y: 8 },
                    { x: 6, y: 1 }
                ],
                crystals: [
                    { x: 5, y: 5 },
                    { x: 10, y: 7 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_006',
                minStars: 6
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_008',
            worldId: 'world_s',
            levelNumber: 8,
            name: 'Sklo a stavba',
            gameType: 'banik',
            difficulty: 2,
            words: ['slnko', 'sklo', 'sestra', 'sladkosť', 'sídlo', 'smiech', 'srdce', 'sliepka', 'skala', 'stavba'],  // 10 slov
            gameConfig: {
                diamonds: 4,
                golds: 5,
                crystals: 3,
                speechExercises: 4,  // zvyšujeme na 4
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 5 },
                    { x: 8, y: 8 },
                    { x: 12, y: 3 },
                    { x: 14, y: 9 }
                ],
                golds: [
                    { x: 1, y: 7 },
                    { x: 5, y: 2 },
                    { x: 9, y: 6 },
                    { x: 11, y: 9 },
                    { x: 15, y: 4 }
                ],
                crystals: [
                    { x: 4, y: 4 },
                    { x: 7, y: 7 },
                    { x: 13, y: 1 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_007',
                minStars: 7
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_009',
            worldId: 'world_s',
            levelNumber: 9,
            name: 'Strom a stolička',
            gameType: 'banik',
            difficulty: 2,
            words: ['slnko', 'sklo', 'sladkosť', 'stavba', 'srdce', 'sneh', 'strom', 'sitko', 'stolička', 'sused'],  // 10 slov
            gameConfig: {
                diamonds: 4,
                golds: 5,
                crystals: 2,
                speechExercises: 4,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 2, y: 6 },
                    { x: 6, y: 3 },
                    { x: 10, y: 8 },
                    { x: 13, y: 2 }
                ],
                golds: [
                    { x: 4, y: 9 },
                    { x: 7, y: 5 },
                    { x: 9, y: 1 },
                    { x: 12, y: 6 },
                    { x: 15, y: 7 }
                ],
                crystals: [
                    { x: 5, y: 7 },
                    { x: 11, y: 4 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_008',
                minStars: 8
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_010',
            worldId: 'world_s',
            levelNumber: 10,
            name: 'Druhé opakovanie',  // veľké opakovanie
            gameType: 'banik',
            difficulty: 3,
            words: ['slnko', 'sova', 'seno', 'soľ', 'suka', 'srdce', 'stôl', 'silák', 'sitko', 'sviečka',
                    'skala', 'smiech', 'sneh', 'sliepka', 'slama', 'sestra', 'sídlo', 'sklo', 'sladkosť', 'stavba',
                    'strom', 'stolička', 'sused'],  // 23 slov
            gameConfig: {
                diamonds: 5,
                golds: 6,
                crystals: 3,
                speechExercises: 5,  // 5 slov na vyslovenie
                listeningExercises: 4,  // 4 slová na počúvanie
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 3 },
                    { x: 6, y: 7 },
                    { x: 9, y: 2 },
                    { x: 12, y: 5 },
                    { x: 15, y: 8 }
                ],
                golds: [
                    { x: 1, y: 5 },
                    { x: 4, y: 8 },
                    { x: 7, y: 4 },
                    { x: 10, y: 6 },
                    { x: 13, y: 9 },
                    { x: 14, y: 1 }
                ],
                crystals: [
                    { x: 5, y: 6 },
                    { x: 8, y: 9 },
                    { x: 11, y: 3 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_009',
                minStars: 9
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_011',
            worldId: 'world_s',
            levelNumber: 11,
            name: 'Sila a súťaž',
            gameType: 'banik',
            difficulty: 3,
            words: ['slnko', 'sneh', 'strom', 'sladkosť', 'sestra', 'stavba', 'sused', 'smiech', 'sila', 'súťaž'],  // 10 slov
            gameConfig: {
                diamonds: 4,
                golds: 5,
                crystals: 3,
                speechExercises: 5,  // viac rečových cvičení
                listeningExercises: 4,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 2, y: 4 },
                    { x: 7, y: 8 },
                    { x: 11, y: 1 },
                    { x: 14, y: 7 }
                ],
                golds: [
                    { x: 4, y: 2 },
                    { x: 6, y: 5 },
                    { x: 9, y: 9 },
                    { x: 12, y: 3 },
                    { x: 15, y: 6 }
                ],
                crystals: [
                    { x: 3, y: 9 },
                    { x: 8, y: 3 },
                    { x: 13, y: 5 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_010',
                minStars: 10
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_012',
            worldId: 'world_s',
            levelNumber: 12,
            name: 'Skriňa a siréna',
            gameType: 'banik',
            difficulty: 3,
            words: ['slnko', 'súťaž', 'sila', 'smiech', 'sestra', 'skriňa', 'stolička', 'sliepka', 'sviečka', 'siréna'],  // 10 slov
            gameConfig: {
                diamonds: 4,
                golds: 6,
                crystals: 2,
                speechExercises: 5,
                listeningExercises: 4,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 6 },
                    { x: 8, y: 4 },
                    { x: 10, y: 9 },
                    { x: 15, y: 2 }
                ],
                golds: [
                    { x: 1, y: 3 },
                    { x: 5, y: 7 },
                    { x: 7, y: 2 },
                    { x: 9, y: 5 },
                    { x: 12, y: 8 },
                    { x: 14, y: 4 }
                ],
                crystals: [
                    { x: 6, y: 9 },
                    { x: 11, y: 6 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_011',
                minStars: 11
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_013',
            worldId: 'world_s',
            levelNumber: 13,
            name: 'Socha a sen',
            gameType: 'banik',
            difficulty: 3,
            words: ['slnko', 'súťaž', 'siréna', 'stolička', 'skriňa', 'sladkosť', 'socha', 'sen', 'srdce', 'skokan'],  // 10 slov
            gameConfig: {
                diamonds: 5,
                golds: 5,
                crystals: 3,
                speechExercises: 6,  // zvyšujeme na 6
                listeningExercises: 5,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 2, y: 2 },
                    { x: 5, y: 8 },
                    { x: 9, y: 3 },
                    { x: 12, y: 7 },
                    { x: 14, y: 5 }
                ],
                golds: [
                    { x: 3, y: 5 },
                    { x: 7, y: 6 },
                    { x: 10, y: 1 },
                    { x: 13, y: 9 },
                    { x: 15, y: 3 }
                ],
                crystals: [
                    { x: 4, y: 7 },
                    { x: 8, y: 8 },
                    { x: 11, y: 4 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_012',
                minStars: 12
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_014',
            worldId: 'world_s',
            levelNumber: 14,
            name: 'Skokan a svetlo',
            gameType: 'banik',
            difficulty: 3,
            words: ['slnko', 'sen', 'skriňa', 'skokan', 'siréna', 'súťaž', 'srdce', 'socha', 'stavba', 'svetlo'],  // 10 slov
            gameConfig: {
                diamonds: 5,
                golds: 6,
                crystals: 2,
                speechExercises: 6,
                listeningExercises: 5,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 1, y: 4 },
                    { x: 6, y: 2 },
                    { x: 8, y: 7 },
                    { x: 11, y: 9 },
                    { x: 13, y: 3 }
                ],
                golds: [
                    { x: 3, y: 8 },
                    { x: 5, y: 5 },
                    { x: 7, y: 1 },
                    { x: 10, y: 5 },
                    { x: 12, y: 6 },
                    { x: 15, y: 8 }
                ],
                crystals: [
                    { x: 4, y: 3 },
                    { x: 14, y: 1 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_013',
                minStars: 13
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_015',
            worldId: 'world_s',
            levelNumber: 15,
            name: 'Tretie opakovanie',  // opakovací level
            gameType: 'banik',
            difficulty: 4,
            words: ['slnko', 'sova', 'seno', 'soľ', 'suka', 'srdce', 'stôl', 'silák', 'sitko', 'sviečka',
                    'skala', 'smiech', 'sneh', 'sliepka', 'slama', 'sestra', 'sídlo', 'sklo', 'sladkosť', 'stavba',
                    'strom', 'stolička', 'sused', 'sila', 'súťaž', 'skriňa', 'siréna', 'socha', 'sen', 'skokan',
                    'svetlo'],  // 31 slov
            gameConfig: {
                diamonds: 6,
                golds: 7,
                crystals: 4,
                speechExercises: 7,  // 7 slov
                listeningExercises: 6,  // 6 slov
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 2, y: 5 },
                    { x: 4, y: 8 },
                    { x: 7, y: 3 },
                    { x: 10, y: 7 },
                    { x: 12, y: 2 },
                    { x: 15, y: 9 }
                ],
                golds: [
                    { x: 1, y: 2 },
                    { x: 3, y: 7 },
                    { x: 6, y: 4 },
                    { x: 8, y: 9 },
                    { x: 9, y: 1 },
                    { x: 13, y: 6 },
                    { x: 14, y: 3 }
                ],
                crystals: [
                    { x: 5, y: 1 },
                    { x: 7, y: 8 },
                    { x: 11, y: 5 },
                    { x: 15, y: 7 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_014',
                minStars: 14
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 's_016',
            worldId: 'world_s',
            levelNumber: 16,
            name: 'Slanina a sladký',
            gameType: 'banik',
            difficulty: 4,
            words: ['slnko', 'svetlo', 'súťaž', 'sen', 'siréna', 'sneh', 'sliepka', 'smiech', 'slanina', 'sladký'],  // 10 slov
            gameConfig: {
                diamonds: 5,
                golds: 6,
                crystals: 3,
                speechExercises: 7,
                listeningExercises: 6,
                mapSize: { width: 16, height: 10 }
            },
            positions: {
                diamonds: [
                    { x: 3, y: 4 },
                    { x: 6, y: 7 },
                    { x: 9, y: 2 },
                    { x: 11, y: 8 },
                    { x: 14, y: 5 }
                ],
                golds: [
                    { x: 2, y: 6 },
                    { x: 5, y: 3 },
                    { x: 8, y: 5 },
                    { x: 10, y: 9 },
                    { x: 12, y: 1 },
                    { x: 15, y: 4 }
                ],
                crystals: [
                    { x: 4, y: 9 },
                    { x: 7, y: 1 },
                    { x: 13, y: 7 }
                ],
                player: { x: 1, y: 1 }
            },
            unlockRequirement: {
                levelId: 's_015',
                minStars: 15
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
    ],

    // ===============================
    // SVET Č - Písmeno Č  
    // ===============================
    world_ch: [
        {
            id: 'ch_001',
            worldId: 'world_ch',
            levelNumber: 1,
            name: 'Prvé Č-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['čaj', 'čas', 'čap', 'čip'],
            gameConfig: {
                diamonds: 2,
                golds: 5,
                crystals: 3,
                speechExercises: 1,
                listeningExercises: 1, 
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
            id: 'ch_002',
            worldId: 'world_ch',
            levelNumber: 2,
            name: 'Prvé Č-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['čap', 'čiapka', 'čaj', 'česť', 'čip'],
            gameConfig: {
                diamonds: 3,
                golds: 3,
                crystals: 2,
                speechExercises: 2,
                listeningExercises: 1, 
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
                levelId: 'ch_001',
                minStars: 1
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'ch_003',
            worldId: 'world_ch',
            levelNumber: 3,
            name: 'Prvé Č-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['čip', 'čaj', 'čas', 'čap', 'čiapka'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 1,
                speechExercises: 2,
                listeningExercises: 1, 
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
                levelId: 'ch_002',
                minStars: 2
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'ch_004',
            worldId: 'world_ch',
            levelNumber: 4,
            name: 'Prvé Č-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['čiapka', 'čaj', 'čip', 'čas', 'česť'], 
            gameConfig: {
                diamonds: 4,
                golds: 3,
                crystals: 1,
                speechExercises: 2,
                listeningExercises: 1, 
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
                levelId: 'ch_003',
                minStars: 3
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'ch_005',
            worldId: 'world_ch',
            levelNumber: 5,
            name: 'Prvé R-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['čaj', 'čip', 'čap', 'česť', 'čiapka', 'čudo', 'čas', 'čelo'], 
            gameConfig: {
                diamonds: 4,
                golds: 2,
                crystals: 2,
                speechExercises: 3,
                listeningExercises: 1, 
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
                levelId: 'ch_004',
                minStars: 4
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'ch_006',
            worldId: 'world_ch',
            levelNumber: 6,
            name: 'Prvé Č-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['čelo', 'čiapka', 'čap', 'čiara', 'česať', 'čudo', 'čip', 'čaj'], 
            gameConfig: {
                diamonds: 4,
                golds: 2,
                crystals: 2,
                speechExercises: 2,
                listeningExercises: 1, 
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
                levelId: 'ch_005',
                minStars: 5
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'ch_007',
            worldId: 'world_ch',
            levelNumber: 6,
            name: 'Prvé Č-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['čelo', 'čiapka', 'čajník', 'čerta', 'česať'], 
            gameConfig: {
                diamonds: 2,
                golds: 2,
                crystals: 2,
                speechExercises: 2,
                listeningExercises: 1, 
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
                levelId: 'ch_006',
                minStars: 5
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'ch_008',
            worldId: 'world_ch',
            levelNumber: 6,
            name: 'Prvé Č-čka',
            gameType: 'banik',
            difficulty: 1,
            words: ['čitateľ', 'čerešňa', 'čarodej', 'čajník', 'čarovný'],
            gameConfig: {
                diamonds: 2,
                golds: 2,
                crystals: 2,
                speechExercises: 2,
                listeningExercises: 1, 
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
                levelId: 'ch_007',
                minStars: 5
            },
            timeLimit: null,
            minStarsToPass: 1,
            isUnlocked: false
        },
		
		
    ],

    // ===============================
    // SVET Z - Písmeno Z
    // ===============================
    world_z: [
        {
            id: 'z_001',
            worldId: 'world_z',
            levelNumber: 1,
            name: 'Prvé Z-ka',
            gameType: 'banik',
            difficulty: 1,
            words: ['zima', 'zub', 'zajac'],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 1,
                speechExercises: 1,
                listeningExercises: 1,
                mapSize: { width: 16, height: 10 }
            },
            positions: { /* BEZ ZMIEN */ },
            unlockRequirement: null,
            minStarsToPass: 1,
            isUnlocked: true
        },
        {
            id: 'z_002',
            worldId: 'world_z',
            levelNumber: 2,
            name: 'Začíname so Z',
            gameType: 'banik',
            difficulty: 1,
            words: ['zajac', 'zub', 'zima', 'zvon'],
            gameConfig: {
                diamonds: 1,
                golds: 3,
                crystals: 2,
                speechExercises: 1,
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: { /* BEZ ZMIEN */ },
            unlockRequirement: { levelId: 'z_001', minStars: 1 },
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'z_003',
            worldId: 'world_z',
            levelNumber: 3,
            name: 'Z na začiatku',
            gameType: 'banik',
            difficulty: 1,
            words: ['zebra', 'zajac', 'zvon', 'zima'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 1,
                speechExercises: 1,
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: { /* BEZ ZMIEN */ },
            unlockRequirement: { levelId: 'z_002', minStars: 2 },
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'z_004',
            worldId: 'world_z',
            levelNumber: 4,
            name: 'Z v slovách',
            gameType: 'banik',
            difficulty: 1,
            words: ['zámok', 'zebra', 'zvon', 'zlatý'],
            gameConfig: {
                diamonds: 3,
                golds: 3,
                crystals: 2,
                speechExercises: 2,
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: { /* BEZ ZMIEN */ },
            unlockRequirement: { levelId: 'z_003', minStars: 3 },
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'z_005',
            worldId: 'world_z',
            levelNumber: 5,
            name: 'Z-čka v akcii',
            gameType: 'banik',
            difficulty: 2,
            words: ['zajtra', 'zámok', 'zlatý', 'zima'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 4,
                speechExercises: 2,
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: { /* BEZ ZMIEN */ },
            unlockRequirement: { levelId: 'z_004', minStars: 4 },
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'z_006',
            worldId: 'world_z',
            levelNumber: 6,
            name: 'Z v strede',
            gameType: 'banik',
            difficulty: 2,
            words: ['koza', 'slza', 'nozík', 'jazyk'],
            gameConfig: {
                diamonds: 3,
                golds: 5,
                crystals: 2,
                speechExercises: 3,
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: { /* BEZ ZMIEN */ },
            unlockRequirement: { levelId: 'z_005', minStars: 5 },
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'z_007',
            worldId: 'world_z',
            levelNumber: 7,
            name: 'Z v rôznych pozíciách',
            gameType: 'banik',
            difficulty: 2,
            words: ['zebra', 'slza', 'jazdec', 'zvonček'],
            gameConfig: {
                diamonds: 2,
                golds: 2,
                crystals: 1,
                speechExercises: 4,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: { /* BEZ ZMIEN */ },
            unlockRequirement: { levelId: 'z_006', minStars: 6 },
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'z_008',
            worldId: 'world_z',
            levelNumber: 8,
            name: 'Dlhšie slová so Z',
            gameType: 'banik',
            difficulty: 2,
            words: ['zmrzlina', 'zvonček', 'záhradník'],
            gameConfig: {
                diamonds: 3,
                golds: 4,
                crystals: 1,
                speechExercises: 4,
                listeningExercises: 3,
                mapSize: { width: 16, height: 10 }
            },
            positions: { /* BEZ ZMIEN */ },
            unlockRequirement: { levelId: 'z_007', minStars: 7 },
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'z_009',
            worldId: 'world_z',
            levelNumber: 9,
            name: 'Z – istota',
            gameType: 'banik',
            difficulty: 3,
            words: ['záhradník', 'zmrzlina', 'zvedavý'],
            gameConfig: {
                diamonds: 3,
                golds: 3,
                crystals: 1,
                speechExercises: 3,
                listeningExercises: 1,
                mapSize: { width: 16, height: 10 }
            },
            positions: { /* BEZ ZMIEN */ },
            unlockRequirement: { levelId: 'z_008', minStars: 10 },
            minStarsToPass: 1,
            isUnlocked: false
        },
        {
            id: 'z_010',
            worldId: 'world_z',
            levelNumber: 10,
            name: 'Majster Z',
            gameType: 'banik',
            difficulty: 3,
            words: ['zmrzlina', 'zvedavý', 'záhrada', 'zvonček'],
            gameConfig: {
                diamonds: 4,
                golds: 6,
                crystals: 1,
                speechExercises: 3,
                listeningExercises: 2,
                mapSize: { width: 16, height: 10 }
            },
            positions: { /* BEZ ZMIEN */ },
            unlockRequirement: { levelId: 'z_009', minStars: 11 },
            minStarsToPass: 1,
            isUnlocked: false
        }
    ]

    
	
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