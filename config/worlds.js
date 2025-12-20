/**
 * Konfigurácia svetov pre logopedickú hru
 * Každý svet reprezentuje jedno písmeno/hlásku na precvičovanie
 * 
 * Štruktúra sveta:
 * - id: jedinečný identifikátor sveta
 * - name: názov sveta (písmeno/hláska)
 * - title: popisný názov sveta
 * - description: krátky popis sveta
 * - color: hlavná farba sveta (pre UI)
 * - icon: ikona sveta (cesta k obrázku)
 * - difficulty: obtiažnosť (1-5, kde 5 je najťažšia)
 * - unlockRequirement: podmienka na odomknutie sveta
 * - totalLevels: celkový počet levelov v svete
 * - gameTypes: typy hier dostupné v tomto svete
 */

const WORLDS_CONFIG = [
    {
        id: 'world_r',
        name: 'R',
        title: 'R',
        description: 'Precvičuj výslovnosť písmena R s rôznymi slovami',
        color: '#FF6B6B', 
        icon: 'images/worlds/world_r.png',
        difficulty: 4,
        unlockRequirement: null, 
        totalLevels: 16,
        gameTypes: ['banik', 'pexeso', 'mario'], // typy hier dostupné v tomto svete
        isUnlocked: true // prvý svet je vždy odomknutý
    },
    {
        id: 'world_l',
        name: 'L',
        title: 'Svet písmena L',
        description: 'Nauč sa správne vyslovovať písmeno L',
        color: '#4ECDC4', 
        icon: 'images/worlds/world_l.png',
        difficulty: 3,
        unlockRequirement: null,
        totalLevels: 16,
        gameTypes: ['banik', 'pexeso'],
        isUnlocked: true
    },
    {
        id: 'world_s',
        name: 'S',
        title: 'Svet písmena S',
        description: 'Precvičuj sykavky s písmenom S',
        color: '#45B7D1', 
        icon: 'images/worlds/world_s.png',
        difficulty: 2,
        unlockRequirement: null,
        totalLevels: 16,
        gameTypes: ['banik', 'pexeso', 'mario'],
        isUnlocked: true
    },
    {
        id: 'world_ch',
        name: 'Č',
        title: 'Svet písmena Č',
        description: 'Čvachtaj s písmenom Č',
        color: '#74B9FF', 
        icon: 'images/worlds/world_ch.png',
        difficulty: 4,
        unlockRequirement: null,
        totalLevels: 8,
        gameTypes: ['banik', 'pexeso'],
        isUnlocked: true
    },
    {
        id: 'world_z',
        name: 'Z',
        title: 'Svet písmena Z',
        description: 'Zvládni buzivé písmeno Z',
        color: '#96CEB4', // svetlozelená
        icon: 'images/worlds/world_z.png',
        difficulty: 2,
        unlockRequirement: {
            worldId: 'world_s',
            minStars: 20
        },
        totalLevels: 15,
        gameTypes: ['banik', 'pexeso'],
        isUnlocked: true
    },
    {
        id: 'world_c',
        name: 'C',
        title: 'Svet písmena C',
        description: 'Precvičuj ostré písmeno C',
        color: '#FFEAA7', // žltá
        icon: 'images/worlds/world_c.png',
        difficulty: 3,
        unlockRequirement: {
            worldId: 'world_z',
            minStars: 22
        },
        totalLevels: 17,
        gameTypes: ['banik', 'pexeso'],
        isUnlocked: true
    },
    {
        id: 'world_sh',
        name: 'Š',
        title: 'Svet písmena Š',
        description: 'Šušti s písmenom Š',
        color: '#DDA0DD', // svetlofialová
        icon: 'images/worlds/world_sh.png',
        difficulty: 4,
        unlockRequirement: {
            worldId: 'world_c',
            minStars: 25
        },
        totalLevels: 19,
        gameTypes: ['banik', 'pexeso', 'mario'],
        isUnlocked: true
    },
    {
        id: 'world_zh',
        name: 'Ž',
        title: 'Svet písmena Ž',
        description: 'Žuži s písmenom Ž',
        color: '#FF9FF3', // ružová
        icon: 'images/worlds/world_zh.png',
        difficulty: 4,
        unlockRequirement: {
            worldId: 'world_sh',
            minStars: 28
        },
        totalLevels: 18,
        gameTypes: ['banik', 'pexeso'],
        isUnlocked: true
    },
    {
        id: 'world_d',
        name: 'Ď',
        title: 'Svet písmena Ď',
        description: 'Ďabaj s mäkkým písmenom Ď',
        color: '#FD79A8', // tmavoružová
        icon: 'images/worlds/world_d.png',
        difficulty: 5,
        unlockRequirement: {
            worldId: 'world_ch',
            minStars: 30
        },
        totalLevels: 16,
        gameTypes: ['banik', 'pexeso'],
        isUnlocked: true
    },
    {
        id: 'world_t',
        name: 'Ť',
        title: 'Svet písmena Ť',
        description: 'Ťukaj s mäkkým písmenom Ť',
        color: '#FDCB6E', // oranžová
        icon: 'images/worlds/world_t.png',
        difficulty: 5,
        unlockRequirement: {
            worldId: 'world_d',
            minStars: 25
        },
        totalLevels: 15,
        gameTypes: ['banik', 'pexeso'],
        isUnlocked: true
    },
    {
        id: 'world_n',
        name: 'Ň',
        title: 'Svet písmena Ň',
        description: 'Ňafaj s mäkkým písmenom Ň',
        color: '#A29BFE', // fialová
        icon: 'images/worlds/world_n.png',
        difficulty: 5,
        unlockRequirement: {
            worldId: 'world_t',
            minStars: 22
        },
        totalLevels: 15,
        gameTypes: ['banik', 'pexeso'],
        isUnlocked: true
    },
    {
        id: 'world_k',
        name: 'K',
        title: 'Svet písmena K',
        description: 'Klopkaj s písmenom K',
        color: '#00B894', // zelená
        icon: 'images/worlds/world_k.png',
        difficulty: 3,
        unlockRequirement: {
            worldId: 'world_n',
            minStars: 20
        },
        totalLevels: 16,
        gameTypes: ['banik', 'pexeso', 'mario'],
        isUnlocked: true
    },
    {
        id: 'world_g',
        name: 'G',
        title: 'Svet písmena G',
        description: 'Grgaj s písmenom G',
        color: '#E84393', // tmavoružová
        icon: 'images/worlds/world_g.png',
        difficulty: 3,
        unlockRequirement: {
            worldId: 'world_k',
            minStars: 24
        },
        totalLevels: 17,
        gameTypes: ['banik', 'pexeso', 'mario'],
        isUnlocked: true
    }
];

/**
 * Funkcia na získanie konfigurácie konkrétneho sveta
 * @param {string} worldId - ID sveta
 * @returns {Object|null} - konfigurácia sveta alebo null ak sa nenašiel
 */
function getWorldConfig(worldId) {
    return WORLDS_CONFIG.find(world => world.id === worldId) || null;
}

/**
 * Funkcia na získanie všetkých svetov
 * @returns {Array} - pole všetkých svetov
 */
function getAllWorlds() {
    return WORLDS_CONFIG;
}

/**
 * Funkcia na získanie odomknutých svetov
 * @returns {Array} - pole odomknutých svetov
 */
function getUnlockedWorlds() {
    return WORLDS_CONFIG.filter(world => world.isUnlocked);
}

/**
 * Funkcia na kontrolu, či je svet odomknutý
 * @param {string} worldId - ID sveta
 * @returns {boolean} - true ak je svet odomknutý
 */
function isWorldUnlocked(worldId) {
    const world = getWorldConfig(worldId);
    return world ? world.isUnlocked : false;
}

// Export pre použitie v iných súboroch
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        WORLDS_CONFIG,
        getWorldConfig,
        getAllWorlds,
        getUnlockedWorlds,
        isWorldUnlocked
    };
}