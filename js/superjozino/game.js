/**
 * ANIMATION MANAGER
 * Správa animácií postavy - načítavanie a prehrávanie frame-ov
 */
class AnimationManager {
    constructor() {
        // Cesta k sprite-om
        this.basePath = 'images/superjozino/assets/player/keyframes/yellow_hat/';
        
        // Definícia animácií a počtu frame-ov
        this.animations = {
            idle: { frames: 20, speed: 15 },      // 000-019, pomalšie
            walk: { frames: 8, speed: 10 },      // 000-007
            run: { frames: 8, speed: 6 },        // 000-007, rýchlejšie
            jump: { frames: 10, speed: 8 },      // 000-009
            falling: { frames: 10, speed: 8 }    // 000-009
        };
        
        // Načítané obrázky
        this.images = {};
        
        // Aktuálny stav animácie
        this.currentAnimation = 'idle';
        this.currentFrame = 0;
        this.frameCounter = 0;
        this.direction = 'right'; // 'left', 'right', 'front'
        
        // Načítanie všetkých sprite-ov
        this.loadAllSprites();
    }
    
    /**
     * Načítanie všetkých sprite frame-ov
     */
    loadAllSprites() {
        console.log('🎨 Načítavam sprite-y postavy...');
        
        for (let animName in this.animations) {
            this.images[animName] = [];
            const frameCount = this.animations[animName].frames;
            
            for (let i = 0; i < frameCount; i++) {
                const img = new Image();
                // Formát názvu: __yellow_hat_idle_000.png
                const frameNumber = i.toString().padStart(3, '0');
                img.src = `${this.basePath}__yellow_hat_${animName}_${frameNumber}.png`;
                
                this.images[animName].push(img);
                
                // Log pre prvý frame každej animácie (pre debugging)
                if (i === 0) {
                    img.onload = () => {
                        console.log(`✅ Načítaná animácia: ${animName} (${frameCount} frame-ov)`);
                    };
                    img.onerror = () => {
                        console.error(`❌ Chyba pri načítaní: ${img.src}`);
                    };
                }
            }
        }
    }
    
    /**
     * Nastavenie animácie
     * @param {string} animationName - Názov animácie (idle, walk, run, jump, falling)
     */
    setAnimation(animationName) {
        if (this.currentAnimation !== animationName) {
            this.currentAnimation = animationName;
            this.currentFrame = 0;
            this.frameCounter = 0;
        }
    }
    
    /**
     * Nastavenie smeru
     * @param {string} direction - 'left', 'right', 'front'
     */
    setDirection(direction) {
        this.direction = direction;
    }
    
    /**
     * Update animácie (volať v game loop-e)
     */
    update() {
        const anim = this.animations[this.currentAnimation];
        if (!anim) return;
        
        this.frameCounter++;
        
        // Keď uplynie dosť frame-ov, prejdi na ďalší sprite
        if (this.frameCounter >= anim.speed) {
            this.frameCounter = 0;
            this.currentFrame++;
            
            // Loop animácie
            if (this.currentFrame >= anim.frames) {
                this.currentFrame = 0;
            }
        }
    }
    
    /**
     * Vykreslenie aktuálneho frame-u
     * @param {CanvasRenderingContext2D} ctx - Canvas kontext
     * @param {number} x - X pozícia
     * @param {number} y - Y pozícia
     * @param {number} width - Šírka
     * @param {number} height - Výška
     */
    draw(ctx, x, y, width, height) {
        const frameImage = this.images[this.currentAnimation]?.[this.currentFrame];
        
        if (!frameImage || !frameImage.complete) {
            ctx.fillStyle = 'red';
            ctx.fillRect(x, y, width, height);
            return;
        }
        
        ctx.save();
        
        // ⭐ PRIDAJ TOTO - vypne anti-aliasing
        ctx.imageSmoothingEnabled = false;
        
        // Ak ide doľava, zrkadlovo otočíme sprite
        if (this.direction === 'left') {
            ctx.translate(x + width, y);
            ctx.scale(-1, 1);
            ctx.drawImage(frameImage, 0, 0, width, height);
        } else {
            ctx.drawImage(frameImage, x, y, width, height);
        }
        
        ctx.restore();
    }
}

/**
 * COIN ANIMATION MANAGER
 * Správa animácií odmien - mince, diamanty
 */
class CoinAnimationManager {
    constructor() {
        // Cesta k obrázkom odmien
        this.basePath = 'images/superjozino/assets/treasure/';
        
        // Definícia typov odmien
        this.coinTypes = {
            // 💛 Normálne mince
            gold: {
                folder: 'Gold Coin',
                frames: 4,
                speed: 20
            },
            
            // 🥈 Strieborné mince - posluchové cvičenia (TODO: overiť cestu)
            silver: {
                folder: 'Silver Coin',
                frames: 4,
                speed: 20
            },
            
            // 💙 Modrý diamant - rečové cvičenia
            blueDiamond: {
                folder: 'Blue Diamond',
                frames: 4,
                speed: 12
            },
            
            // 💚 Zelený diamant - bonusový predmet (power-up)
            greenDiamond: {
                folder: 'Green Diamond',
                frames: 4,
                speed: 20
            },
            
            // ❤️ Červený diamant - bonusový predmet (extra život)
            redDiamond: {
                folder: 'Red Diamond',
                frames: 4,
                speed: 20
            }
        };
        
        // Načítané obrázky
        this.images = {};
        
        // Globálny frame counter (všetky mince sa animujú synchronizovane)
        this.globalFrame = 0;
        this.frameCounter = 0;
        
        // Načítanie všetkých sprite-ov
        this.loadAllSprites();
    }
    
    /**
     * Načítanie všetkých sprite frame-ov
     */
    loadAllSprites() {
        console.log('💰 Načítavam sprite-y odmien...');
        
        for (let typeName in this.coinTypes) {
            const coinType = this.coinTypes[typeName];
            this.images[typeName] = [];
            
            for (let i = 1; i <= coinType.frames; i++) {
                const img = new Image();
                // Formát: 01.png, 02.png, 03.png, 04.png
                const frameNumber = i.toString().padStart(2, '0');
                img.src = `${this.basePath}${coinType.folder}/${frameNumber}.png`;
                
                this.images[typeName].push(img);
                
                // Log pre prvý frame každého typu (pre debugging)
                if (i === 1) {
                    img.onload = () => {
                        console.log(`✅ Načítaná odmena: ${typeName} (${coinType.frames} frame-ov)`);
                    };
                    img.onerror = () => {
                        console.error(`❌ Chyba pri načítaní: ${img.src}`);
                    };
                }
            }
        }
    }
    
    /**
     * Update animácie (volať v game loop-e)
     */
    update() {
        this.frameCounter++;
        
        // Všetky mince používajú rovnakú rýchlosť animácie
        if (this.frameCounter >= 20) { // speed z coinTypes
            this.frameCounter = 0;
            this.globalFrame++;
            
            // Loop animácie (4 frame-y: 0,1,2,3,0,1,2,3...)
            if (this.globalFrame >= 4) {
                this.globalFrame = 0;
            }
        }
    }
    
    /**
     * Vykreslenie odmeny
     * @param {CanvasRenderingContext2D} ctx - Canvas kontext
     * @param {string} type - Typ odmeny ('gold', 'blueDiamond', 'greenDiamond', 'redDiamond')
     * @param {number} x - X pozícia
     * @param {number} y - Y pozícia
     * @param {number} size - Veľkosť (šírka/výška)
     */
    draw(ctx, type, x, y, size) {
        const frameImage = this.images[type]?.[this.globalFrame];
        
        if (!frameImage || !frameImage.complete) {
            // Placeholder ak sprite ešte nie je načítaný
            ctx.fillStyle = type === 'gold' ? '#FFD700' : '#00FFFF';
            ctx.beginPath();
            ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
            ctx.fill();
            return;
        }
        
        // Vypni anti-aliasing pre pixel-perfect rendering
        ctx.imageSmoothingEnabled = false;
        
        // Zachovanie aspect ratio (pôvodných proporcií obrázka)
        const imgWidth = frameImage.naturalWidth || frameImage.width;
        const imgHeight = frameImage.naturalHeight || frameImage.height;
        const aspectRatio = imgWidth / imgHeight;
        
        let drawWidth = size;
        let drawHeight = size;
        
        // Ak obrázok nie je štvorec, zachováme proporcie
        if (aspectRatio > 1) {
            // Širší ako vyšší
            drawHeight = size / aspectRatio;
        } else if (aspectRatio < 1) {
            // Vyšší ako širší
            drawWidth = size * aspectRatio;
        }
        
        // Vycentruj obrázok
        const offsetX = (size - drawWidth) / 2;
        const offsetY = (size - drawHeight) / 2;
        
        // Vykresli animovaný sprite so zachovanými proporciami
        ctx.drawImage(frameImage, x + offsetX, y + offsetY, drawWidth, drawHeight);
    }
}

/**
 * CHECKPOINT ANIMATION MANAGER
 * Správa animácií checkpointov - neaktívny, aktivácia, idle
 */
class CheckpointAnimationManager {
    constructor() {
        // Cesta k obrázkom checkpointov
        this.basePath = 'images/superjozino/assets/checkpoint/';
        
        // Sprite sheety (veľké obrázky s frame-mi)
        this.spriteSheets = {
            noflag: null,      // Jednoduchý obrázok (stĺpik bez vlajky)
            flag: null,        // 1664x64px (26 frame-ov po 64px)
            idleflag: null     // 640x64px (10 frame-ov po 64px)
        };
        
        // Definícia animácií
        this.animations = {
            inactive: {
                spriteSheet: 'noflag',
                frames: 1,
                speed: 0  // Žiadna animácia
            },
            activating: {
                spriteSheet: 'flag',
                frames: 26,
                frameWidth: 64,
                speed: 3,  // Rýchla animácia aktivácie
                loop: false  // Prehráva sa len raz
            },
            idle: {
                spriteSheet: 'idleflag',
                frames: 10,
                frameWidth: 64,
                speed: 8,  // Pomalšia idle animácia
                loop: true
            }
        };
        
        // Načítanie sprite sheetov
        this.loadSprites();
    }
    
    /**
     * Načítanie všetkých sprite sheetov
     */
    loadSprites() {
        console.log('🚩 Načítavam sprite-y checkpointov...');
        
        // Načítaj noflag
        this.spriteSheets.noflag = new Image();
        this.spriteSheets.noflag.src = `${this.basePath}noflag.png`;
        this.spriteSheets.noflag.onload = () => {
            console.log('✅ Načítaný checkpoint: noflag');
        };
        
        // Načítaj flag (aktivácia)
        this.spriteSheets.flag = new Image();
        this.spriteSheets.flag.src = `${this.basePath}flag.png`;
        this.spriteSheets.flag.onload = () => {
            console.log('✅ Načítaný checkpoint: flag (26 frame-ov)');
        };
        
        // Načítaj idleflag
        this.spriteSheets.idleflag = new Image();
        this.spriteSheets.idleflag.src = `${this.basePath}idleflag.png`;
        this.spriteSheets.idleflag.onload = () => {
            console.log('✅ Načítaný checkpoint: idleflag (10 frame-ov)');
        };
    }
    
    /**
     * Update animácie checkpointu
     * @param {Object} checkpoint - Checkpoint objekt
     */
    updateCheckpoint(checkpoint) {
        // Inicializuj animačné vlastnosti ak neexistujú
        if (!checkpoint.animState) {
            // Prvý checkpoint (isStart) a finish začínajú ako idle
            if (checkpoint.isStart || checkpoint.isFinish) {
                checkpoint.animState = 'idle';
            } else {
                checkpoint.animState = 'inactive';
            }
            checkpoint.animFrame = 0;
            checkpoint.animCounter = 0;
        }
        
        const anim = this.animations[checkpoint.animState];
        if (!anim || anim.frames <= 1) return;
        
        checkpoint.animCounter++;
        
        // Posun na ďalší frame
        if (checkpoint.animCounter >= anim.speed) {
            checkpoint.animCounter = 0;
            checkpoint.animFrame++;
            
            // Koniec animácie
            if (checkpoint.animFrame >= anim.frames) {
                if (anim.loop) {
                    // Loop animácia (idle)
                    checkpoint.animFrame = 0;
                } else {
                    // Animácia sa prehráva len raz (activating)
                    checkpoint.animFrame = anim.frames - 1; // Zostaň na poslednom frame
                    checkpoint.animState = 'idle'; // Prejdi do idle stavu
                    checkpoint.animFrame = 0;
                }
            }
        }
    }
    
    /**
     * Aktivácia checkpointu (spustenie animácie)
     * @param {Object} checkpoint - Checkpoint objekt
     */
    activateCheckpoint(checkpoint) {
        if (checkpoint.animState !== 'inactive') return;
        
        console.log('🚩 Aktivujem checkpoint!');
        checkpoint.animState = 'activating';
        checkpoint.animFrame = 0;
        checkpoint.animCounter = 0;
    }
    
    /**
     * Vykreslenie checkpointu
     * @param {CanvasRenderingContext2D} ctx - Canvas kontext
     * @param {Object} checkpoint - Checkpoint objekt
     */
    draw(ctx, checkpoint) {
        // Inicializuj animačný stav ak neexistuje
        if (!checkpoint.animState) {
            // Prvý checkpoint (isStart) začína ako idle, ostatné ako inactive
            if (checkpoint.isStart || checkpoint.isFinish) {
                checkpoint.animState = 'idle';
            } else {
                checkpoint.animState = checkpoint.active ? 'idle' : 'inactive';
            }
            checkpoint.animFrame = 0;
            checkpoint.animCounter = 0;
        }
        
        const anim = this.animations[checkpoint.animState];
        const spriteSheet = this.spriteSheets[anim.spriteSheet];
        
        if (!spriteSheet || !spriteSheet.complete) {
            // Placeholder - starý spôsob vykreslenia
            this.drawOldStyle(ctx, checkpoint);
            return;
        }
        
        // Vypni anti-aliasing
        ctx.imageSmoothingEnabled = false;
        
        // Výpočet pozície frame-u v sprite sheete
        let sourceX = 0;
        if (anim.frames > 1) {
            sourceX = checkpoint.animFrame * anim.frameWidth;
        }
        
        // Vypočítaj veľkosť vykreslenia
        const drawWidth = checkpoint.width || 64;
        const drawHeight = checkpoint.height || 64;
        
        // Pre finish flag môžeme upraviť pozíciu aby bol vyššie
        let drawY = checkpoint.y;
        if (checkpoint.isFinish) {
            // Posun Y hore aby vlajka bola vyššie (ale collision box zostane rovnaký)
            drawY = checkpoint.y - (drawHeight - 64) / 2;
        }
        
        // Vykresli checkpoint
        ctx.drawImage(
            spriteSheet,
            sourceX, 0,              // Pozícia v sprite sheete
            anim.frameWidth || 64, 64,  // Veľkosť frame-u v sprite sheete
            checkpoint.x,
            drawY,
            drawWidth,   // Veľkosť na canvase
            drawHeight
        );
    }
    
    /**
     * Starý štýl vykreslenia (fallback)
     */
    drawOldStyle(ctx, checkpoint) {
        // Kreslenie stožiaru vlajky
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(
            checkpoint.x,
            checkpoint.y,
            checkpoint.width,
            checkpoint.height
        );

        // Kreslenie vlajky
        ctx.beginPath();
        ctx.fillStyle = checkpoint.isStart ? '#00FF00' : (checkpoint.active ? '#FF0000' : '#800000');
        
        if (checkpoint.active) {
            // Vztýčená vlajka
            ctx.moveTo(checkpoint.x, checkpoint.y);
            ctx.lineTo(checkpoint.x + 30, checkpoint.y + 15);
            ctx.lineTo(checkpoint.x, checkpoint.y + 30);
        } else {
            // Spustená vlajka
            ctx.moveTo(checkpoint.x, checkpoint.y + checkpoint.height - 30);
            ctx.lineTo(checkpoint.x + 30, checkpoint.y + checkpoint.height - 15);
            ctx.lineTo(checkpoint.x, checkpoint.y + checkpoint.height);
        }
        ctx.fill();
    }
}


class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = 800;
        this.height = 800;
        
        // Herné vlastnosti
        this.gravity = 0.1;
        this.friction = 0.7;
        this.maxFallSpeed = 8; 
        this.currentLevel = 1;
        this.gameState = 'playing'; // 'playing', 'paused', 'completed'
        this.lives = 3;
        this.isInvulnerable = false;
        this.invulnerableTime = 2000; // 2 sekundy nezraniteľnosti po zásahu
        this.lastCheckpoint = null;

        // Mince a diamanty
        this.collectedCoins = 0;
        this.totalCoins = 0;
        this.collectedDiamonds = 0;
        this.requiredDiamonds = this.currentLevelData?.diamonds?.length || 4;

        // debug mód
        this.debug = false;
        this.debugInfo = document.getElementById('debugInfo');
        this.setupDebugControls();
        this.lastTime = 0;
        this.fps = 0;


        // Inicializácia hráča
        // Inicializácia hráča
        this.player = {
            x: 100,
            y: 100,
            
            // COLLISION BOX - skutočná veľkosť pre kolízie (menšia!)
            width: 32,      // Šírka collision boxu (užší)
            height: 64,     // Výška collision boxu (vyšší, ale menší ako sprite)
            
            // SPRITE - veľkosť obrázka (väčší pre vizuál)
            spriteWidth: 96,   // Šírka sprite-u
            spriteHeight: 96,  // Výška sprite-u
            
            // OFFSET - posun sprite-u relatívne k collision boxu
            spriteOffsetX: -32,  // Posun doľava aby bol sprite centrovaný (96-32)/2 = 32
            spriteOffsetY: -22,  // Posun hore aby nohy boli na spodku collision boxu
            
            velocityX: 0,
            velocityY: 0,
            speed: 3,
            jumpForce: -7,
            isJumping: false
        };
        this.animationManager = new AnimationManager();
        this.coinAnimationManager = new CoinAnimationManager();
        this.checkpointAnimationManager = new CheckpointAnimationManager();


        // Kamera
        this.camera = {
            x: 0,
            y: 0
        };

        
        // ==========================================
        // NAČÍTANIE SPRITE SHEETOV
        // ==========================================

        // Terrain sprite sheet (obsahuje zem, platformy, bloky)
        this.terrainSprite = new Image();
        this.terrainSprite.src = 'images/superjozino/assets/terrain.png';
        this.terrainSprite.loaded = false;

        // Event listener pre načítanie sprite sheetu
        this.terrainSprite.onload = () => {
            this.terrainSprite.loaded = true;
            console.log('✅ Terrain sprite sheet načítaný');
        };

        this.terrainSprite.onerror = () => {
            console.error('❌ Chyba pri načítaní terrain sprite sheetu!');
            console.error('Skontroluj cestu: images/superjozino/assets/terrain.png');
        };

        // Definícia tile-ov v sprite sheete (súradnice a rozmery)
        this.tiles = {
            ground: {
                x: 98,      // Pozícia X v sprite sheete
                y: 2,       // Pozícia Y v sprite sheete
                width: 45,  // Šírka tile-u
                height: 45  // Výška tile-u
            },
            // Platformy (4 typy)
            platform1: {
                x: 193,     // Začiatok x
                y: 2,       // Začiatok y
                width: 46,  // Šírka (239 - 193)
                height: 13  // Výška (15 - 2)
            },
            platform2: {
                x: 193,     // Začiatok x
                y: 16,      // Začiatok y
                width: 14,  // Šírka (207 - 193)
                height: 14  // Výška (30 - 16)
            },
            platform3: {
                x: 209,     // Začiatok x
                y: 16,      // Začiatok y
                width: 30,  // Šírka (239 - 209)
                height: 30  // Výška (46 - 16)
            },
            platform4: {
                x: 242,     // Začiatok x
                y: 2,       // Začiatok y
                width: 14,  // Šírka (256 - 242)
                height: 44  // Výška (46 - 2)
            }
        };

        // Speech UI
        this.createSpeechUI();

        // Načítanie levelu
        this.loadLevel(this.currentLevel);

        // animacia smrti
        this.deathAnimation = {
            active: false,
            timer: 0,
            duration: 1000, // 1 sekunda na animáciu smrti
            type: null // 'gap' alebo 'enemy'
        };

        // Ovládanie
        this.keys = {};
        this.setupControls();

        // Spustenie hernej slučky
        this.gameLoop();
    }

    setupDebugControls() {
        const toggleBtn = document.getElementById('toggleDebug');
        toggleBtn.addEventListener('click', () => {
            this.debug = !this.debug;
            toggleBtn.textContent = `Debug Mode: ${this.debug ? 'ON' : 'OFF'}`;
        });

        // Pridáme aj klávesovú skratku 'D'
        window.addEventListener('keydown', (e) => {
            if (e.code === 'KeyD') {
                this.debug = !this.debug;
                toggleBtn.textContent = `Debug Mode: ${this.debug ? 'ON' : 'OFF'}`;
            }
        });
    }

    createSpeechUI() {
        // Vytvorenie modálneho okna pre rečové cvičenia
        this.speechModal = document.createElement('div');
        this.speechModal.className = 'speech-modal';
        this.speechModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        
        document.body.appendChild(this.speechModal);
    }

    showSpeechResult(success) {
        const modal = document.querySelector('.speech-content');
        const resultMessage = modal.querySelector('.result-message');
        const recordButton = document.getElementById('startRecording');

        if (success) {
            resultMessage.textContent = 'Správne!';
            resultMessage.style.color = '#4CAF50';
            modal.classList.add('correct-answer');
            setTimeout(() => {
                modal.classList.remove('correct-answer');
                this.hideSpeechExercise();
                this.gameState = 'playing';
            }, 1500);
        } else {
            exercise.attempts++;
            resultMessage.textContent = 'Nesprávne, skús znova.';
            resultMessage.style.color = '#f44336';
            modal.classList.add('wrong-answer');
            
            // Aktualizácia počtu pokusov
            modal.querySelector('.attempts-info').textContent = `Počet pokusov: ${exercise.attempts}/5`;

            setTimeout(() => {
                modal.classList.remove('wrong-answer');
            }, 500);

            // Kontrola maximálneho počtu pokusov
            if (exercise.attempts >= 5) {
                resultMessage.textContent = 'Dosiahol si maximálny počet pokusov.';
                recordButton.disabled = true;
                recordButton.style.opacity = '0.5';
                
                // Pridanie tlačidla na zatvorenie
                const closeButton = document.createElement('button');
                closeButton.className = 'button';
                closeButton.style.marginTop = '10px';
                closeButton.textContent = 'Zavrieť';
                closeButton.onclick = () => {
                    this.hideSpeechExercise();
                    this.gameState = 'playing';
                };
                modal.appendChild(closeButton);
            }
        }
    }

    showSpeechExercise(exercise) {
        this.speechModal.innerHTML = `
            <div class="speech-content">
                <h2>${exercise.word}</h2>
                <img src="${exercise.imageUrl}" alt="${exercise.word}" style="max-width: 200px; margin-bottom: 20px;">
                <div class="attempts-info">Počet pokusov: ${exercise.attempts}/5</div>
                <button id="startRecording" class="button">
                    Začať nahrávanie
                </button>
                <div class="result-message" style="margin-top: 10px; min-height: 20px;"></div>
            </div>
        `;
        this.speechModal.style.display = 'flex';
        
        // Pridanie event listenera pre tlačidlo nahrávania
        document.getElementById('startRecording').addEventListener('click', () => {
            this.startSpeechRecognition(exercise);
        });
    }

    hideSpeechExercise() {
        this.speechModal.style.display = 'none';
    }


    showGameOver() {
        const modalContent = `
            <div class="game-over-content">
                <h2>Game Over</h2>
                <p>Zozbierané mince: ${this.collectedCoins}/${this.totalCoins}</p>
                <p>Zozbierané diamanty: ${this.collectedDiamonds}/${this.requiredDiamonds}</p>
                <div class="game-over-buttons">
                    <button class="button" onclick="location.reload()">Späť do menu</button>
                    <button class="button" id="restartLevel">Reštartovať level</button>
                </div>
            </div>
        `;
        
        this.speechModal.innerHTML = modalContent;
        this.speechModal.style.display = 'flex';
        this.speechModal.className = 'modal game-over-modal';

        document.getElementById('restartLevel').addEventListener('click', () => {
            this.restartLevel();
        });
    }

    async startSpeechRecognition(exercise) {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.lang = 'sk-SK';
            recognition.interimResults = false;
            
            const recordButton = document.getElementById('startRecording');
            recordButton.disabled = true;
            recordButton.textContent = 'Počúvam...';
            
            recognition.onresult = (event) => {
                const result = event.results[0][0].transcript.toLowerCase();
                
                if (result.includes(exercise.word.toLowerCase())) {
                    exercise.completed = true;
                    this.collectedDiamonds++;
                    this.showSpeechResult(true, exercise);
                } else {
                    this.showSpeechResult(false, exercise);
                }
                
                recordButton.disabled = false;
                recordButton.textContent = 'Začať nahrávanie';
            };
            
            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                recordButton.disabled = false;
                recordButton.textContent = 'Začať nahrávanie';
                
                const resultMessage = document.querySelector('.result-message');
                resultMessage.textContent = 'Nastala chyba pri rozpoznávaní. Skús znova.';
                resultMessage.style.color = '#f44336';
            };
            
            recognition.onend = () => {
                recordButton.disabled = false;
                recordButton.textContent = 'Začať nahrávanie';
            };
            
            recognition.start();
        }
    }

    handleCheckpoints() {
        for (let checkpoint of this.currentLevelData.checkpoints) {
            if (!checkpoint.active && this.checkCollision(this.player, checkpoint)) {
                this.activateCheckpoint(checkpoint);
            }
        }
    }

    handleWallCollisions() {
        for (let wall of this.currentLevelData.walls) {
            const nextPositionX = {
                x: this.player.x + this.player.velocityX,
                y: this.player.y,
                width: this.player.width,
                height: this.player.height
            };

            const nextPositionY = {
                x: this.player.x,
                y: this.player.y + this.player.velocityY,
                width: this.player.width,
                height: this.player.height
            };

            // Horizontálna kolízia
            if (this.checkCollision(nextPositionX, wall)) {
                if (this.player.velocityX > 0) {
                    this.player.x = wall.x - this.player.width;
                } else if (this.player.velocityX < 0) {
                    this.player.x = wall.x + wall.width;
                }
                this.player.velocityX = 0;
            }

            // Vertikálna kolízia
            if (this.checkCollision(nextPositionY, wall)) {
                if (this.player.velocityY > 0) { // Padá dole
                    this.player.y = wall.y - this.player.height;
                    this.player.velocityY = 0;
                    this.player.isJumping = false;
                } else if (this.player.velocityY < 0) { // Skáče hore
                    this.player.y = wall.y + wall.height;
                    this.player.velocityY = 0;
                }
            }
        }
    }

    activateCheckpoint(checkpoint) {
        // Deaktivujeme predchádzajúci checkpoint
        if (this.lastCheckpoint && this.lastCheckpoint !== checkpoint) {
            this.lastCheckpoint.active = false;
            // Resetuj animáciu predchádzajúceho checkpointu
            this.lastCheckpoint.animState = 'inactive';
            this.lastCheckpoint.animFrame = 0;
        }

        // Aktivujeme nový checkpoint
        checkpoint.active = true;
        this.lastCheckpoint = checkpoint;

        // Spustíme animáciu aktivácie
        this.checkpointAnimationManager.activateCheckpoint(checkpoint);
        
        console.log('🚩 Checkpoint aktivovaný!');
        // TODO: Pridať zvukový efekt
    }

    respawnAtCheckpoint() {
        if (this.lastCheckpoint) {
            this.player.x = this.lastCheckpoint.x;
            this.player.y = this.lastCheckpoint.y - this.player.height;
        } else {
            // Ak nie je žiadny checkpoint, začneme od začiatku levelu
            this.player.x = 100;
            this.player.y = 100;
        }
        this.player.velocityX = 0;
        this.player.velocityY = 0;
        this.player.isJumping = false;
        this.isInvulnerable = true;
        
        // Krátka doba nezraniteľnosti po respawne
        setTimeout(() => {
            this.isInvulnerable = false;
        }, this.invulnerableTime);
    }


    drawDebugInfo() {
        if (!this.debug) return;
    
        this.ctx.save();
        this.ctx.translate(-this.camera.x, 0);

        this.drawDebugGrid();
        this.drawCollisionBoxes();
        this.drawObjectInfo();
        this.ctx.restore();
        this.drawFixedDebugInfo();

        this.ctx.strokeStyle = 'cyan';
        for (let diamond of this.currentLevelData.diamonds) {
            if (!diamond.collected) {
                this.ctx.strokeRect(
                    diamond.x,
                    diamond.y,
                    diamond.width,
                    diamond.height
                );
            }
        }  

    }

    drawDebugGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;

        // Vertikálne čiary
        for (let x = 0; x < this.currentLevelData.width; x += 100) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }

        // Horizontálne čiary
        for (let y = 0; y < this.height; y += 100) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.currentLevelData.width, y);
            this.ctx.stroke();
        }
    }

    drawCollisionBoxes() {
        // Hráč
        this.ctx.strokeStyle = 'red';
        this.ctx.strokeRect(
            this.player.x, 
            this.player.y, 
            this.player.width, 
            this.player.height
        );

        // Platformy
        this.ctx.strokeStyle = 'yellow';
        for (let platform of this.currentLevelData.platforms) {
            this.ctx.strokeRect(
                platform.x,
                platform.y,
                platform.width,
                platform.height
            );
        }

        // Nepriatelia
        this.ctx.strokeStyle = 'purple';
        for (let enemy of this.currentLevelData.enemies) {
            this.ctx.strokeRect(
                enemy.x,
                enemy.y,
                enemy.width,
                enemy.height
            );
            
            // Trasa nepriateľa
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.moveTo(enemy.startX, enemy.y + enemy.height/2);
            this.ctx.lineTo(enemy.endX, enemy.y + enemy.height/2);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }

        // Mince
        this.ctx.strokeStyle = 'gold';
        for (let coin of this.currentLevelData.coins) {
            if (!coin.collected) {
                this.ctx.strokeRect(
                    coin.x,
                    coin.y,
                    coin.width,
                    coin.height
                );
            }
        }
    }

    drawObjectInfo() {
        this.ctx.font = '12px monospace';
        this.ctx.fillStyle = 'white';

        // Informácie o hráčovi
        this.ctx.fillText(
            `x: ${Math.round(this.player.x)} y: ${Math.round(this.player.y)}`,
            this.player.x,
            this.player.y - 20
        );
        this.ctx.fillText(
            `vx: ${this.player.velocityX.toFixed(2)} vy: ${this.player.velocityY.toFixed(2)}`,
            this.player.x,
            this.player.y - 35
        );
    }

    drawFixedDebugInfo() {
        // Aktualizácia debug panelu
        if (this.debugInfo) {
            this.debugInfo.innerHTML = `
                <div>FPS: ${Math.round(this.fps || 0)}</div>
                <div>Camera X: ${Math.round(this.camera.x)}</div>
                <div>Player State: ${this.player.isJumping ? 'Jumping' : 'Grounded'}</div>
                <div>Game State: ${this.gameState}</div>
                <div>Lives: ${this.lives}</div>
                <div>Coins: ${this.collectedCoins}/${this.totalCoins}</div>
                <div>Diamonds: ${this.collectedDiamonds}/${this.requiredDiamonds}</div>
            `;
        }
    }
    
    loadLevel(levelNumber) {
        if (!LEVELS[levelNumber]) {
            console.error('Level neexistuje!');
            return;
        }

        this.currentLevelData = LEVELS[levelNumber].data;
        this.player.x = 100;
        this.player.y = 100;
        this.player.velocityX = 0;
        this.player.velocityY = 0;
        
        // Počítanie celkového počtu mincí a diamantov
        this.totalCoins = this.currentLevelData.coins.length;
        this.collectedCoins = 0;
        this.collectedDiamonds = 0;
        this.requiredDiamonds = this.currentLevelData.diamonds.length;
    }


    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    handleSpecialBlockCollision() {
        for (let block of this.currentLevelData.specialBlocks) {
            if (!block.hit && this.checkCollision(this.player, block)) {
                // Zberie sa pri akomkoľvek kontakte (nie len pri skoku zdola)
                block.hit = true;
                this.collectSpecialItem(block.itemType);
                
                // Zvukový efekt alebo animácia (TODO)
                console.log(`✨ Získaný bonus: ${block.itemType}`);
            }
        }
    }

    collectSpecialItem(type) {
        switch(type) {
            case 'powerup':
                // 💚 Zelený diamant - Power-up
                // TODO: Implementovať power-up efekt (napr. dočasná nezraniteľnosť, rýchlejší beh...)
                console.log('💚 Power-up aktivovaný!');
                // Dočasne pridáme body
                if (!this.score) this.score = 0;
                this.score += 1000;
                break;
                
            case 'extraLife':
                // ❤️ Červený diamant - Extra život
                this.lives++;
                console.log(`❤️ Extra život! Teraz máš ${this.lives} životov.`);
                break;
        }
        
        // Ulož do collected items
        if (!this.currentLevelData.collectedSpecialItems) {
            this.currentLevelData.collectedSpecialItems = [];
        }
        this.currentLevelData.collectedSpecialItems.push(type);
    }

    handleEnemyCollisions() {
        if (this.isInvulnerable) return;

        for (let enemy of this.currentLevelData.enemies) {
            if (this.checkCollision(this.player, enemy)) {
                this.hitByEnemy();
            }
        }
    }

    handleCoinCollection() {
        // Zbieranie normálnych mincí (gold, silver)
        for (let coin of this.currentLevelData.coins) {
            if (!coin.collected && this.checkCollision(this.player, coin)) {
                coin.collected = true;
                
                if (coin.type === 'gold') {
                    // Normálna zlatá minca
                    this.collectedCoins++;
                    // TODO: Pridať zvuk zbierania mince
                    
                } else if (coin.type === 'silver') {
                    // Strieborná minca - posluchové cvičenie
                    if (!coin.listeningExercise.completed) {
                        this.gameState = 'listening';
                        // TODO: Spustiť posluchové cvičenie
                        console.log('🎧 Posluchové cvičenie!');
                        coin.listeningExercise.completed = true;
                        this.collectedCoins++;
                    }
                }
            }
        }

        // Zbieranie diamantov (blue, green, red)
        for (let diamond of this.currentLevelData.diamonds) {
            if (!diamond.collected && this.checkCollision(this.player, diamond)) {
                diamond.collected = true;
                
                if (diamond.type === 'blueDiamond') {
                    // Modrý diamant - rečové cvičenie
                    if (!diamond.speechExercise.completed) {
                        this.gameState = 'speech';
                        this.showSpeechExercise(diamond.speechExercise);
                        this.collectedDiamonds++;
                    }
                    
                } else if (diamond.type === 'greenDiamond') {
                    // Zelený diamant - power-up
                    this.collectSpecialItem('powerup');
                    console.log('💚 Power-up získaný!');
                    // TODO: Implementovať power-up efekt
                    
                } else if (diamond.type === 'redDiamond') {
                    // Červený diamant - extra život
                    this.collectSpecialItem('extraLife');
                    console.log('❤️ Extra život získaný!');
                }
            }
        }
    }

    async handleDiamondCollection(coin) {
        if (!coin.collected) {
            this.gameState = 'speech';
            this.showSpeechExercise(coin.speechExercise);
        }
    }

    showLevelComplete() {
        const coinPercentage = (this.collectedCoins / this.totalCoins) * 100;
        const stars = coinPercentage >= 90 ? 3 : coinPercentage >= 60 ? 2 : 1;
        
        const modalContent = `
            <div class="level-complete-content">
                <h2>Level ${this.currentLevel} dokončený!</h2>
                <div class="stars">
                    ${Array(stars).fill('⭐').join('')}
                </div>
                <p>Zozbierané mince: ${this.collectedCoins}/${this.totalCoins} (${coinPercentage.toFixed(1)}%)</p>
                <p>Zozbierané diamanty: ${this.collectedDiamonds}/${this.requiredDiamonds}</p>
                <h3>Rečové cvičenia:</h3>
                ${this.currentLevelData.diamonds
                    .map(diamond => `
                        <p>${diamond.speechExercise.word}: ${diamond.speechExercise.attempts} pokusov</p>
                    `).join('')}
                <div class="game-over-buttons">
                    <button class="button" onclick="location.reload()">Späť do menu</button>
                    <button class="button" id="nextLevel">Ďalší level</button>
                </div>
            </div>
        `;
        
        this.speechModal.innerHTML = modalContent;
        this.speechModal.style.display = 'flex';
        this.speechModal.className = 'modal level-complete-modal';
    }

    handlePlatformCollisions() {
        const player = {
            x: this.player.x,
            y: this.player.y + this.player.velocityY,
            width: this.player.width,
            height: this.player.height
        };

        for (let block of this.currentLevelData.specialBlocks) {
            if (!block.hit && 
                this.player.velocityY < 0 && 
                this.checkCollision({
                    x: this.player.x,
                    y: this.player.y,
                    width: this.player.width,
                    height: this.player.height
                }, block)) {
                block.hit = true;
                this.collectSpecialItem(block.itemType);
            }
        }

        for (let platform of this.currentLevelData.platforms) {
            if (this.checkCollision(player, platform)) {
                if (this.player.velocityY > 0) { // Padá dole
                    this.player.y = platform.y - this.player.height;
                    this.player.velocityY = 0;
                    this.player.isJumping = false;
                } else if (this.player.velocityY < 0) { // Skáče hore
                    this.player.y = platform.y + platform.height;
                    this.player.velocityY = 0;
                }
                return true;
            }
        }
        return false;
    }

    checkLevelCompletion() {
        if (this.checkCollision(this.player, this.currentLevelData.endPoint)) {
            this.gameState = 'completed';
            this.completeLevel();
        }
    }

    completeLevel() {
        const level = LEVELS[this.currentLevel];
        const completion = (this.currentLevelData.collected / this.currentLevelData.totalCoins) * 100;
        
        // Výpočet hviezd
        let stars = 0;
        if (completion >= 90) stars = 3;
        else if (completion >= 60) stars = 2;
        else if (completion >= 30) stars = 1;

        // Uloženie progresu
        level.stars = Math.max(level.stars, stars);
        level.completion = Math.max(level.completion, completion);

        // Odomknutie ďalšieho levelu
        if (LEVELS[this.currentLevel + 1] && stars === 3) {
            LEVELS[this.currentLevel + 1].unlocked = true;
        }

        // Tu môžeme pridať zobrazenie výsledkovej obrazovky
        console.log(`Level ${this.currentLevel} dokončený! Hviezdy: ${stars}, Completion: ${completion}%`);
    }

    setupControls() {
        // Klávesnica
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Mobilné ovládanie
        const leftBtn = document.getElementById('leftBtn');
        const rightBtn = document.getElementById('rightBtn');
        const jumpBtn = document.getElementById('jumpBtn');

        leftBtn.addEventListener('touchstart', () => this.keys['ArrowLeft'] = true);
        leftBtn.addEventListener('touchend', () => this.keys['ArrowLeft'] = false);
        rightBtn.addEventListener('touchstart', () => this.keys['ArrowRight'] = true);
        rightBtn.addEventListener('touchend', () => this.keys['ArrowRight'] = false);
        jumpBtn.addEventListener('touchstart', () => this.keys['Space'] = true);
        jumpBtn.addEventListener('touchend', () => this.keys['Space'] = false);
    }

    updateCamera() {
        // Sledovanie hráča kamerou
        const targetX = this.player.x - this.width / 3; // kamera sleduje hráča v prvej tretine obrazovky
        
        // Plynulý pohyb kamery
        this.camera.x += (targetX - this.camera.x) * 0.1;

        // Obmedzenia kamery
        if (this.camera.x < 0) this.camera.x = 0;
        if (this.camera.x > this.currentLevelData.width - this.width) {
            this.camera.x = this.currentLevelData.width - this.width;
        }
        
        // KRITICKÉ: Zaokrúhli kameru na celé pixely (eliminuje biele čiary)
        this.camera.x = Math.round(this.camera.x);
        this.camera.y = Math.round(this.camera.y);
    }

    hitByEnemy() {
        this.lives--;
        this.isInvulnerable = true;
        setTimeout(() => {
            this.isInvulnerable = false;
        }, this.invulnerableTime);

        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.respawnAtCheckpoint();
        }
    }

    updateEnemies() {
        for (let enemy of this.currentLevelData.enemies) {
            // Pohyb nepriateľa
            enemy.x += enemy.speed * enemy.direction;

            // Zmena smeru pri dosiahnutí hraníc
            if (enemy.x <= enemy.startX) {
                enemy.direction = 1;
            } else if (enemy.x >= enemy.endX) {
                enemy.direction = -1;
            }
        }
    }

    startDeathAnimation(type) {
        this.deathAnimation.active = true;
        this.deathAnimation.timer = 0;
        this.deathAnimation.type = type;
        this.lives--;
    }

    checkGapCollision() {
        for (let gap of this.currentLevelData.gaps) {
            if (this.checkCollision(this.player, gap)) {
                if (!this.deathAnimation.active) {
                    this.startDeathAnimation('gap');
                }
                return true;
            }
        }
        return false;
    }

    updateDeathAnimation(deltaTime) {
        if (!this.deathAnimation.active) return;

        this.deathAnimation.timer += deltaTime;

        if (this.deathAnimation.type === 'gap') {
            // Padanie do diery
            this.player.velocityY += this.gravity;
            this.player.y += this.player.velocityY;
        }

        // Keď hráč spadne dostatočne hlboko alebo uplynie čas animácie
        if (this.player.y > this.height + 100 || this.deathAnimation.timer >= this.deathAnimation.duration) {
            this.deathAnimation.active = false;
            if (this.lives <= 0) {
                this.gameOver();
            } else {
                this.respawnAtCheckpoint();
            }
        }
    }

    gameOver() {
        this.gameState = 'gameOver';
        
        // Vytvorenie game over obrazovky
        const modalContent = `
            <div style="background: white; padding: 20px; border-radius: 10px; text-align: center;">
                <h2>Game Over</h2>
                <p>Zozbierané mince: ${this.collectedCoins}/${this.totalCoins}</p>
                <p>Zozbierané diamanty: ${this.collectedDiamonds}/${this.requiredDiamonds}</p>
                <button onclick="location.reload()" style="padding: 10px 20px; margin: 5px;">Späť do menu</button>
                <button id="restartLevel" style="padding: 10px 20px; margin: 5px;">Reštartovať level</button>
            </div>
        `;
        
        this.speechModal.innerHTML = modalContent;
        this.speechModal.style.display = 'flex';

        // Pridanie event listenera pre reštart levelu
        document.getElementById('restartLevel').addEventListener('click', () => {
            this.restartLevel();
        });
    }

    restartLevel() {
        // Reset všetkých potrebných vlastností
        this.lives = 3;
        this.collectedCoins = 0;
        this.collectedDiamonds = 0;
        this.lastCheckpoint = null;
        this.isInvulnerable = false;
        this.deathAnimation.active = false;
        
        // Znovu načítanie levelu
        this.loadLevel(this.currentLevel);
        
        // Skrytie modálneho okna
        this.speechModal.style.display = 'none';
        
        // Obnovenie hry
        this.gameState = 'playing';
    }

    update(timestamp) {
        if (this.gameState !== 'playing') return;

        const deltaTime = timestamp - (this.lastTimestamp || timestamp);
        this.lastTimestamp = timestamp;

        if (this.deathAnimation.active) {
            this.updateDeathAnimation(deltaTime);
            return;
        }

        // Pohyb hráča
        if (this.keys['ArrowLeft']) {
            this.player.velocityX = -this.player.speed;
        }
        if (this.keys['ArrowRight']) {
            this.player.velocityX = this.player.speed;
        }
        if (this.keys['Space'] && !this.player.isJumping) {
            this.player.velocityY = this.player.jumpForce;
            this.player.isJumping = true;
        }

        // Aplikácia fyziky
        this.player.velocityY += this.gravity;

        // Obmedzenie maximálnej rýchlosť padania (terminal velocity)
        if (this.player.velocityY > this.maxFallSpeed) {
            this.player.velocityY = this.maxFallSpeed;
        }

        this.player.velocityX *= this.friction;

        // Aktualizácia pozície a kolízie
        this.handleWallCollisions();
        this.handlePlatformCollisions();

        // Aktualizácia pozície
        this.player.x += this.player.velocityX;
        this.player.y += this.player.velocityY;

        // Kontrola dokončenia levelu
        this.checkLevelCompletion();

        // Aktualizácia nepriateľov
        this.updateEnemies();

        // Ostatné kontroly
        this.handleSpecialBlockCollision();
        this.handleEnemyCollisions();
        this.handleCheckpoints();
        this.checkGapCollision();
        this.handleCoinCollection();

        // Kontrola dokončenia levelu
        const coinPercentage = (this.collectedCoins / this.totalCoins) * 100;
        const hasAllDiamonds = this.collectedDiamonds >= this.requiredDiamonds;
        
        if (coinPercentage >= 80 && hasAllDiamonds && 
            this.checkCollision(this.player, this.currentLevelData.endPoint)) {
            this.showLevelComplete();
        }

        // Hranice levelu (nie obrazovky)
        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x + this.player.width > this.currentLevelData.width) {
            this.player.x = this.currentLevelData.width - this.player.width;
        }



        // === ANIMÁCIE POSTAVY ===
        // Určenie smeru
        if (this.player.velocityX > 0.1) {
            this.animationManager.setDirection('right');
        } else if (this.player.velocityX < -0.1) {
            this.animationManager.setDirection('left');
        }

        // Určenie animácie podľa stavu
        if (this.player.isJumping && this.player.velocityY < 0) {
            // Skáče hore
            this.animationManager.setAnimation('jump');
        } else if (this.player.velocityY > 1) {
            // Padá dole
            this.animationManager.setAnimation('falling');
        } else if (Math.abs(this.player.velocityX) > 2) {
            // Beží
            this.animationManager.setAnimation('run');
        } else if (Math.abs(this.player.velocityX) > 0.1) {
            // Chodí
            this.animationManager.setAnimation('walk');
        } else {
            // Stojí
            this.animationManager.setAnimation('idle');
        }

        // Update animácie
        this.animationManager.update();
        // Update animácií odmien (mince, diamanty)
        this.coinAnimationManager.update();

        for (let checkpoint of this.currentLevelData.checkpoints) {
            this.checkpointAnimationManager.updateCheckpoint(checkpoint);
        }

        // Update animácie finish flag
        if (this.currentLevelData.endPoint) {
            this.checkpointAnimationManager.updateCheckpoint(this.currentLevelData.endPoint);
        }


        // Aktualizácia pozície kamery
        this.updateCamera();
    }



    /**
     * Vykreslenie jedného tile-u zo sprite sheetu
     * @param {string} tileName - Názov tile-u (napr. 'ground')
     * @param {number} x - X pozícia kde vykresliť
     * @param {number} y - Y pozícia kde vykresliť
     * @param {number} width - Šírka výsledného tile-u
     * @param {number} height - Výška výsledného tile-u
     */
    drawTile(tileName, x, y, width, height) {
        // Skontroluj, či je sprite sheet načítaný
        if (!this.terrainSprite.loaded) {
            // Ak ešte nie je načítaný, vykresli placeholder (farebný obdĺžnik)
            this.ctx.fillStyle = '#8B4513'; // Hnedá farba
            this.ctx.fillRect(x, y, width, height);
            return;
        }

        // Získaj definíciu tile-u
        const tile = this.tiles[tileName];
        if (!tile) {
            console.error(`Tile "${tileName}" neexistuje v definícii!`);
            return;
        }

        // Vykresli tile zo sprite sheetu
        // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        // sx, sy = pozícia v sprite sheete
        // sWidth, sHeight = veľkosť v sprite sheete
        // dx, dy = pozícia na canvase
        // dWidth, dHeight = veľkosť na canvase
        this.ctx.drawImage(
            this.terrainSprite,     // Sprite sheet
            tile.x,                 // X v sprite sheete
            tile.y,                 // Y v sprite sheete
            tile.width,             // Šírka v sprite sheete
            tile.height,            // Výška v sprite sheete
            x,                      // X na canvase
            y,                      // Y na canvase
            width,                  // Šírka na canvase
            height                  // Výška na canvase
        );
    }

    /**
     * Vykreslenie veľkej plochy tile-om (opakovaním)
     * Používa sa pre zem, dlhé platformy atď.
     * @param {string} tileName - Názov tile-u
     * @param {number} x - Začiatočná X pozícia
     * @param {number} y - Začiatočná Y pozícia
     * @param {number} width - Celková šírka plochy
     * @param {number} height - Celková výška plochy
     */
    drawTiledArea(tileName, x, y, width, height) {
        const tile = this.tiles[tileName];
        if (!tile) {
            console.error(`Tile "${tileName}" neexistuje!`);
            return;
        }

        // Vypočítaj, koľko tile-ov potrebujeme v X a Y smere
        const tilesX = Math.ceil(width / tile.width);
        const tilesY = Math.ceil(height / tile.height);

        // Vykresli tile-y v mriežke s malým prekrytím (eliminuje čierne čiary)
        for (let row = 0; row < tilesY; row++) {
            for (let col = 0; col < tilesX; col++) {
                // Zaokrúhli pozície na celé pixely (zabráni sub-pixel renderingu)
                const tileX = Math.floor(x + (col * tile.width));
                const tileY = Math.floor(y + (row * tile.height));
                
                // Vypočítaj skutočnú veľkosť tile-u (posledné tile-y môžu byť orezané)
                let tileWidth = tile.width;
                let tileHeight = tile.height;
                
                // Pre posledný tile v rade - orez šírku
                if (col === tilesX - 1 && (x + width) < (tileX + tile.width)) {
                    tileWidth = Math.ceil(x + width - tileX);
                }
                
                // Pre posledný tile v stĺpci - orez výšku
                if (row === tilesY - 1 && (y + height) < (tileY + tile.height)) {
                    tileHeight = Math.ceil(y + height - tileY);
                }
                
                // Pridaj 1px prekrytie okrem posledných tile-ov (eliminuje čierne čiary)
                const drawWidth = (col < tilesX - 1) ? tileWidth + 1 : tileWidth;
                const drawHeight = (row < tilesY - 1) ? tileHeight + 1 : tileHeight;
                
                // Vykresli tile
                this.drawTile(tileName, tileX, tileY, drawWidth, drawHeight);
            }
        }
    }

    /**
 * Vykreslenie zeme - horizontálne opakuje tile, vertikálne natiahne
 * @param {string} tileName - Názov tile-u
 * @param {number} x - X pozícia
 * @param {number} y - Y pozícia
 * @param {number} width - Celková šírka
 * @param {number} height - Celková výška (tile sa natiahne na túto výšku)
 */
drawGroundTerrain(tileName, x, y, width, height) {
    // Skontroluj, či je sprite načítaný
    if (!this.terrainSprite.loaded) {
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(x, y, width, height);
        return;
    }

    const tile = this.tiles[tileName];
    if (!tile) {
        console.error(`Tile "${tileName}" neexistuje!`);
        return;
    }

    // Vypočítaj koľko tile-ov potrebujeme v ŠÍRKE (horizontálne opakujeme)
    const tilesX = Math.ceil(width / tile.width);

    // V ŠÍRKE opakujeme tile-y, v VÝŠKE jeden tile natiahneme
    for (let col = 0; col < tilesX; col++) {
        const tileX = Math.floor(x + (col * tile.width));
        
        // Šírka tile-u (posledný môže byť orezaný)
        let tileWidth = tile.width;
        if (col === tilesX - 1 && (x + width) < (tileX + tile.width)) {
            tileWidth = Math.ceil(x + width - tileX);
        }

        // Pridaj 1px prekrytie okrem posledného tile-u (eliminuje vertikálne čiary)
        const drawWidth = (col < tilesX - 1) ? tileWidth + 1 : tileWidth;

        // Vykresli tile - šírka sa opakuje, výška sa natiahne
        this.ctx.drawImage(
            this.terrainSprite,     // Sprite sheet
            tile.x,                 // X v sprite sheete
            tile.y,                 // Y v sprite sheete
            tile.width,             // Šírka v sprite sheete (celá šírka tile-u)
            tile.height,            // Výška v sprite sheete (celá výška tile-u)
            tileX,                  // X na canvase
            y,                      // Y na canvase
            drawWidth,              // Šírka na canvase (opakuje sa)
            height                  // Výška na canvase (NATIAHNE SA na celú výšku!)
        );
    }
}

/**
 * Vykreslenie platformy - horizontálne opakuje tile, vertikálne natiahne
 * @param {string} tileName - Názov platformy (platform1, platform2, platform3, platform4)
 * @param {number} x - X pozícia
 * @param {number} y - Y pozícia
 * @param {number} width - Celková šírka
 * @param {number} height - Celková výška
 */
drawPlatform(tileName, x, y, width, height) {
    // Skontroluj, či je sprite načítaný
    if (!this.terrainSprite.loaded) {
        this.ctx.fillStyle = '#CD853F';
        this.ctx.fillRect(x, y, width, height);
        return;
    }

    const tile = this.tiles[tileName];
    if (!tile) {
        console.error(`Tile "${tileName}" neexistuje!`);
        return;
    }

    // Vypočítaj koľko tile-ov potrebujeme v ŠÍRKE
    const tilesX = Math.ceil(width / tile.width);

    // V ŠÍRKE opakujeme tile-y, v VÝŠKE natiahnutie
    for (let col = 0; col < tilesX; col++) {
        const tileX = Math.floor(x + (col * tile.width));
        
        // Šírka tile-u (posledný môže byť orezaný)
        let tileWidth = tile.width;
        if (col === tilesX - 1 && (x + width) < (tileX + tile.width)) {
            tileWidth = Math.ceil(x + width - tileX);
        }

        // Pridaj 1px prekrytie okrem posledného tile-u
        const drawWidth = (col < tilesX - 1) ? tileWidth + 1 : tileWidth;

        // Vykresli tile
        this.ctx.drawImage(
            this.terrainSprite,     // Sprite sheet
            tile.x,                 // X v sprite sheete
            tile.y,                 // Y v sprite sheete
            tile.width,             // Šírka v sprite sheete
            tile.height,            // Výška v sprite sheete
            tileX,                  // X na canvase
            y,                      // Y na canvase
            drawWidth,              // Šírka na canvase
            height                  // Výška na canvase (natiahne sa)
        );
    }
}






    draw() {
        // Vyčistenie canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Uloženie kontextu pred transformáciou
        this.ctx.save();
        
        // Posun všetkého podľa pozície kamery
        this.ctx.translate(-this.camera.x, 0);

        // Vykreslenie pozadia (voliteľné)
        this.ctx.fillStyle = '#87CEEB'; // svetlomodrá obloha
        this.ctx.fillRect(this.camera.x, 0, this.width, this.height);

        // Vykreslenie platforiem a zeme
this.ctx.imageSmoothingEnabled = false;

for (let platform of this.currentLevelData.platforms) {
    if (platform.type === 'ground') {
        // Automaticky predĺž zem až po spodný okraj canvasu
        const groundHeight = this.height - platform.y; // Výška od platformy po spodok
        
        // Zem - horizontálne opakuje tile, vertikálne natiahne
        this.drawGroundTerrain('ground', platform.x, platform.y, platform.width, groundHeight);
        
        // Pridaj čierny okraj okolo celej platformy zeme
        this.ctx.strokeStyle = '#000000'; // Čierna farba
        this.ctx.lineWidth = 1; // Hrúbka okraja (2px)
        this.ctx.strokeRect(platform.x, platform.y, platform.width, groundHeight);
    } else {
        // Platformy - vykresli pomocou sprite sheetu
        // Automatický výber typu platformy podľa veľkosti
        let platformType = 'platform3'; // Default (30x30px)
        
        if (platform.height <= 15) {
            platformType = 'platform1'; // Tenká (13px výška)
        } else if (platform.width <= 20) {
            platformType = 'platform2'; // Malá štvorcová (14x14px)
        } else if (platform.height >= 35) {
            platformType = 'platform4'; // Vysoká (44px výška)
        }
        
        // Vykresli platformu
        this.drawPlatform(platformType, platform.x, platform.y, platform.width, platform.height);
        
        // Pridaj čierny okraj aj okolo platforiem
        this.ctx.strokeStyle = '#000000'; // Čierna farba
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
    }
}

        // Vykreslenie checkpointov
        for (let checkpoint of this.currentLevelData.checkpoints) {
            this.checkpointAnimationManager.draw(this.ctx, checkpoint);
        }

        // Vykreslenie špeciálnych blokov
        for (let block of this.currentLevelData.specialBlocks) {
            if (!block.hit) {
                // Určenie typu diamantu podľa itemType
                let diamondType = 'greenDiamond'; // Default
                if (block.itemType === 'extraLife') {
                    diamondType = 'redDiamond';
                } else if (block.itemType === 'powerup') {
                    diamondType = 'greenDiamond';
                }
                
                // Vykresli animovaný diamant
                this.coinAnimationManager.draw(
                    this.ctx,
                    diamondType,
                    block.x,
                    block.y,
                    block.width
                );
            }
        }

        // Vykreslenie nepriateľov
        this.ctx.fillStyle = 'red';
        for (let enemy of this.currentLevelData.enemies) {
            this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }

        // Vykreslenie stien
        this.ctx.fillStyle = '#666';
        for (let wall of this.currentLevelData.walls) {
            this.ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
        }


        // Vykreslenie všetkých mincí (gold, silver)
        for (let coin of this.currentLevelData.coins) {
            if (!coin.collected) {
                this.coinAnimationManager.draw(
                    this.ctx,
                    coin.getAnimationType(),  // 'gold' alebo 'silver'
                    coin.x,
                    coin.y,
                    coin.width
                );
            }
        }

        // Vykreslenie všetkých diamantov (blue, green, red)
        for (let diamond of this.currentLevelData.diamonds) {
            if (!diamond.collected) {
                this.coinAnimationManager.draw(
                    this.ctx,
                    diamond.getAnimationType(),  // 'blueDiamond', 'greenDiamond', 'redDiamond'
                    diamond.x,
                    diamond.y,
                    diamond.width
                );
            }
        }

        // Vykreslenie hráča (animovaná postava)
        if (this.isInvulnerable) {
            // Efekt blikania pri nezraniteľnosti
            this.ctx.globalAlpha = Math.sin(Date.now() / 100) > 0 ? 1 : 0.3;
        }

        // Vykresli sprite s offsetom relatívne k collision boxu
        this.animationManager.draw(
            this.ctx,
            this.player.x + this.player.spriteOffsetX,  // Použije offset z player objektu
            this.player.y + this.player.spriteOffsetY,
            this.player.spriteWidth,                     // Použije sprite rozmery
            this.player.spriteHeight
        );

        // Reset alpha
        this.ctx.globalAlpha = 1;

        // Reset alpha
        this.ctx.globalAlpha = 1;

        // Vykreslenie cieľa (finish flag)
        const endPoint = this.currentLevelData.endPoint;

        // Priprav endPoint ako finish flag checkpoint
        if (!endPoint.isFinish) {
            endPoint.isFinish = true;
            endPoint.animState = 'idle'; // Vždy viditeľný
            endPoint.animFrame = 0;
            endPoint.animCounter = 0;
        }

        // Vykresli finish flag pomocou checkpoint animation managera
        this.checkpointAnimationManager.draw(this.ctx, endPoint);


        // Debug informácie
        if (this.debug) {
            this.drawDebugInfo();
        }

        // Obnovenie kontextu
        this.ctx.restore();

        // Vykreslenie UI elementov (ak nejaké máme)
        this.drawUI();
    }


    drawUI() {
        // Životy a skóre
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Mince: ${this.collectedCoins}/${this.totalCoins}`, 10, 30);
        this.ctx.fillText(`Diamanty: ${this.collectedDiamonds}/${this.requiredDiamonds}`, 10, 60);
        this.ctx.fillText(`Životy: ${this.lives}`, 10, 90);


        if (this.debug) {
            // Debug panel v pravom hornom rohu
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(this.width - 200, 0, 200, 100);
            
            this.ctx.fillStyle = 'white';
            this.ctx.font = '12px Arial';
            this.ctx.fillText(`FPS: ${Math.round(this.fps || 0)}`, this.width - 190, 20);
            this.ctx.fillText(`Level Width: ${this.currentLevelData.width}`, this.width - 190, 40);
            this.ctx.fillText(`Game State: ${this.gameState}`, this.width - 190, 60);
            this.ctx.fillText(`Level: ${this.currentLevel}`, this.width - 190, 80);
        }
    }

    gameLoop(timestamp) {
        if (this.lastTime) {
            this.fps = 1000 / (timestamp - this.lastTime);
        }
        this.lastTime = timestamp;
    
        this.update();
        this.draw();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
}

/**
 * COIN CLASS - Reprezentuje odmeny v hre
 * Typy: gold, silver, blueDiamond, greenDiamond, redDiamond
 */
class Coin {
    constructor(x, y, type = 'gold') {
        this.x = x;
        this.y = y;
        this.width = 40;   // Väčšie pre lepšiu viditeľnosť
        this.height = 40;
        this.type = type;  // 'gold', 'silver', 'blueDiamond', 'greenDiamond', 'redDiamond'
        this.collected = false;
        
        // Rečové cvičenie (len pre Blue Diamond)
        this.speechExercise = type === 'blueDiamond' ? {
            word: this.getRandomWord(),
            imageUrl: this.getRandomImage(),
            attempts: 0,
            completed: false
        } : null;
        
        // Posluchové cvičenie (len pre Silver Coin)
        this.listeningExercise = type === 'silver' ? {
            completed: false,
            attempts: 0
        } : null;
        
        // Bonusové predmety (Green/Red Diamond)
        this.bonusType = null;
        if (type === 'greenDiamond') {
            this.bonusType = 'powerup';
        } else if (type === 'redDiamond') {
            this.bonusType = 'extraLife';
        }
    }
    
    /**
     * Získanie náhodného slova pre rečové cvičenie
     */
    getRandomWord() {
        const words = ['pes', 'mačka', 'auto', 'dom', 'strom', 'slnko', 'voda', 'ruka'];
        return words[Math.floor(Math.random() * words.length)];
    }
    
    /**
     * Získanie náhodného obrázka pre rečové cvičenie
     */
    getRandomImage() {
        return `images/${this.getRandomWord()}.png`;
    }
    
    /**
     * Získanie animačného typu pre CoinAnimationManager
     */
    getAnimationType() {
        return this.type; // 'gold', 'silver', 'blueDiamond', 'greenDiamond', 'redDiamond'
    }
}

// Spustenie hry
window.onload = () => {
    new Game();
};
