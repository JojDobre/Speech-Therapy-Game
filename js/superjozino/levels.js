class Level {
    constructor(width, platforms, specialBlocks = [], enemies = [], gaps = [], walls = [], coins = [], checkpoints = [], diamonds = [], endPoint) {
        this.width = width;
        this.platforms = platforms;
        this.specialBlocks = specialBlocks;
        this.enemies = enemies;
        this.gaps = gaps;
        this.walls = walls;
        this.coins = coins;
        this.checkpoints = checkpoints;
        this.diamonds = diamonds; 
        this.endPoint = endPoint;
        this.collected = 0;
        this.totalCoins = coins.length;
        this.collectedSpecialItems = [];
    }
}

const LEVELS = {
    1: {
        name: "Baníkova výprava",
        unlocked: true,
        stars: 0,
        completion: 0,
        data: new Level(
            6000, // šírka levelu
            [
                // Základná zem s medzerami
                { x: 0, y: 750, width: 800, height: 50, type: 'ground' },
                { x: 1000, y: 750, width: 600, height: 50, type: 'ground' },
                { x: 1800, y: 750, width: 500, height: 50, type: 'ground' },
                { x: 2500, y: 750, width: 700, height: 50, type: 'ground' },
                { x: 3400, y: 750, width: 600, height: 50, type: 'ground' },
                { x: 4200, y: 750, width: 800, height: 50, type: 'ground' },
                { x: 5200, y: 750, width: 800, height: 50, type: 'ground' },

                // Platformy
                // Sekcia 1
                { x: 200, y: 600, width: 150, height: 20, type: 'platform' },
                { x: 400, y: 500, width: 150, height: 20, type: 'platform' },
                { x: 600, y: 400, width: 150, height: 20, type: 'platform' },
                
                // Sekcia 2
                { x: 1100, y: 550, width: 200, height: 20, type: 'platform' },
                { x: 1400, y: 450, width: 150, height: 20, type: 'platform' },
                
                // Sekcia 3
                { x: 1900, y: 600, width: 150, height: 20, type: 'platform' },
                { x: 2100, y: 500, width: 150, height: 20, type: 'platform' },
                { x: 2300, y: 400, width: 150, height: 20, type: 'platform' },
                
                // Sekcia 4
                { x: 2600, y: 550, width: 200, height: 20, type: 'platform' },
                { x: 2900, y: 450, width: 200, height: 20, type: 'platform' },
                { x: 3200, y: 350, width: 200, height: 20, type: 'platform' },
                
                // Sekcia 5
                { x: 3500, y: 600, width: 150, height: 20, type: 'platform' },
                { x: 3800, y: 500, width: 150, height: 20, type: 'platform' },
                
                // Sekcia 6
                { x: 4300, y: 550, width: 200, height: 20, type: 'platform' },
                { x: 4600, y: 450, width: 200, height: 20, type: 'platform' },
                { x: 4900, y: 350, width: 200, height: 20, type: 'platform' },
                
                // Záverečná sekcia
                { x: 5300, y: 600, width: 150, height: 20, type: 'platform' },
                { x: 5500, y: 500, width: 150, height: 20, type: 'platform' },
                { x: 5700, y: 400, width: 150, height: 20, type: 'platform' }
            ],
            
            // Špeciálne bloky
            [
                { x: 300, y: 400, width: 50, height: 50, type: 'special', hit: false, itemType: 'powerup' },
                { x: 1200, y: 300, width: 50, height: 50, type: 'special', hit: false, itemType: 'extraLife' },
                { x: 2700, y: 350, width: 50, height: 50, type: 'special', hit: false, itemType: 'powerup' },
                { x: 4400, y: 300, width: 50, height: 50, type: 'special', hit: false, itemType: 'extraLife' }
            ],
            
            // Nepriatelia
            [
                // Sekcia 1
                { x: 400, y: 700, width: 50, height: 50, startX: 400, endX: 650, speed: 2, direction: 1 },
                
                // Sekcia 2
                { x: 1200, y: 700, width: 50, height: 50, startX: 1100, endX: 1400, speed: 3, direction: 1 },
                
                // Sekcia 3
                { x: 1900, y: 700, width: 50, height: 50, startX: 1900, endX: 2150, speed: 2.5, direction: 1 },
                
                // Sekcia 4
                { x: 2700, y: 700, width: 50, height: 50, startX: 2800, endX: 3000, speed: 1, direction: 1 },
                { x: 3200, y: 300, width: 50, height: 50, startX: 3200, endX: 3350, speed: 0.5, direction: 1 },
                
                // Sekcia 5
                { x: 3600, y: 700, width: 50, height: 50, startX: 3600, endX: 3900, speed: 3.5, direction: 1 },
                
                // Sekcia 6
                { x: 4400, y: 700, width: 50, height: 50, startX: 4400, endX: 4800, speed: 3, direction: 1 },
                { x: 4900, y: 300, width: 25, height: 25, startX: 4900, endX: 5000, speed: 4, direction: 1 }
            ],
            
            // Medzery (gaps)
            [
                { x: 800, y: 750, width: 200, height: 50 },
                { x: 1600, y: 750, width: 200, height: 50 },
                { x: 2300, y: 750, width: 200, height: 50 },
                { x: 3200, y: 750, width: 200, height: 50 },
                { x: 4000, y: 750, width: 200, height: 50 },
                { x: 5000, y: 750, width: 200, height: 50 }
            ],
            
            // Steny
            [
                { x: 700, y: 650, width: 30, height: 100 },
                { x: 1500, y: 600, width: 30, height: 150 },
                { x: 2200, y: 550, width: 30, height: 200 },
                { x: 3300, y: 500, width: 30, height: 250 },
                { x: 4100, y: 600, width: 30, height: 150 },
                { x: 5100, y: 650, width: 30, height: 100 }
            ],
            
            // Normálne mince
            [
                // Sekcia 1
                new Coin(250, 550),
                new Coin(300, 550),
                new Coin(450, 450),
                new Coin(500, 450),
                new Coin(650, 350),
                new Coin(700, 350),
                
                // Sekcia 2
                new Coin(1150, 500),
                new Coin(1200, 500),
                new Coin(1250, 500),
                new Coin(1450, 400),
                new Coin(1500, 400),
                
                // Sekcia 3
                new Coin(1950, 550),
                new Coin(2000, 550),
                new Coin(2150, 450),
                new Coin(2200, 450),
                new Coin(2350, 350),
                new Coin(2400, 350),
                
                // Sekcia 4
                new Coin(2650, 500),
                new Coin(2700, 500),
                new Coin(2950, 400),
                new Coin(3000, 400),
                new Coin(3250, 300),
                new Coin(3300, 300),
                
                // Sekcia 5
                new Coin(3550, 550),
                new Coin(3600, 550),
                new Coin(3850, 450),
                new Coin(3900, 450),
                
                // Sekcia 6
                new Coin(4350, 500),
                new Coin(4400, 500),
                new Coin(4650, 400),
                new Coin(4700, 400),
                new Coin(4950, 300),
                new Coin(5000, 300),
                
                // Záverečná sekcia
                new Coin(5350, 550),
                new Coin(5400, 550),
                new Coin(5550, 450),
                new Coin(5600, 450),
                new Coin(5750, 350),
                new Coin(5800, 350)
            ],
            
            // Checkpointy
            [
                {
                    x: 100,
                    y: 686,
                    width: 64,
                    height: 64,
                    active: true,
                    flagHeight: 30,
                    isStart: true
                },
                {
                    x: 1300,
                    y: 686,
                    width: 64,
                    height: 64,
                    active: false,
                    flagHeight: 30
                },
                {
                    x: 3000,
                    y: 686,
                    width: 64,
                    height: 64,
                    active: false,
                    flagHeight: 30
                },
                {
                    x: 4500,
                    y: 686,
                    width: 64,
                    height: 64,
                    active: false,
                    flagHeight: 30
                }
            ],
            
            // Diamond mince (špeciálne mince s rečovými cvičeniami)
            [
                new Coin(800, 300, 'blueDiamond'),
                new Coin(2500, 400, 'silver'),
                new Coin(4000, 350, 'blueDiamond'),
                new Coin(5500, 300, 'blueDiamond')
            ],
            
            // Koncový bod
            { 
                x: 5800, 
                y: 558,      // ⬅️ Upravené aby stál na zemi (750 - 128 = 622)
                width: 192,   // ⬅️ Rovnaká šírka ako checkpoint
                height: 320, // ⬅️ DVOJNÁSOBNÁ VÝŠKA (2x vyšší ako checkpoint)
                isFinish: true
            }
        )
    }
};