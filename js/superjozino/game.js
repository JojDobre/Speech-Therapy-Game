class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = 800;
        this.height = 800;
        
        // Herné vlastnosti
        this.gravity = 0.3;
        this.friction = 0.8;
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
        this.player = {
            x: 100,
            y: 100,
            width: 32,
            height: 32,
            velocityX: 0,
            velocityY: 0,
            speed: 3,
            jumpForce: -12,
            isJumping: false
        };

        // Kamera
        this.camera = {
            x: 0,
            y: 0
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
        if (this.lastCheckpoint) {
            this.lastCheckpoint.active = false;
        }

        // Aktivujeme nový checkpoint
        checkpoint.active = true;
        this.lastCheckpoint = checkpoint;

        // Tu môžeme pridať zvukový efekt alebo animáciu
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
    }

    collectSpecialItem(type) {
        switch(type) {
            case 'powerup':
                this.score += 1000;
                break;
            case 'extraLife':
                this.lives++;
                break;
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
        // Normálne mince
        for (let coin of this.currentLevelData.coins) {
            if (!coin.collected && this.checkCollision(this.player, coin)) {
                coin.collected = true;
                this.collectedCoins++;
            }
        }

        // Diamond mince
        for (let diamond of this.currentLevelData.diamonds) {
            if (!diamond.collected && this.checkCollision(this.player, diamond)) {
                if (!diamond.speechExercise.completed) {
                    this.gameState = 'speech';
                    this.showSpeechExercise(diamond.speechExercise);
                    diamond.collected = true;
                    this.collectedDiamonds++;
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

        // Aktualizácia pozície kamery
        this.updateCamera();
    }

    drawCheckpoint(checkpoint) {
        // Kreslenie stožiaru vlajky
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(
            checkpoint.x,
            checkpoint.y,
            checkpoint.width,
            checkpoint.height
        );

        // Kreslenie vlajky
        this.ctx.beginPath();
        // Farba vlajky závisí od typu checkpointu
        this.ctx.fillStyle = checkpoint.isStart ? '#00FF00' : (checkpoint.active ? '#FF0000' : '#800000');
        
        if (checkpoint.active) {
            // Vztýčená vlajka
            this.ctx.moveTo(checkpoint.x, checkpoint.y);
            this.ctx.lineTo(checkpoint.x + 30, checkpoint.y + 15);
            this.ctx.lineTo(checkpoint.x, checkpoint.y + 30);
        } else {
            // Spustená vlajka
            this.ctx.moveTo(checkpoint.x, checkpoint.y + checkpoint.height - 30);
            this.ctx.lineTo(checkpoint.x + 30, checkpoint.y + checkpoint.height - 15);
            this.ctx.lineTo(checkpoint.x, checkpoint.y + checkpoint.height);
        }
        this.ctx.fill();
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

        // Vykreslenie platforiem
        this.ctx.fillStyle = '#8B4513';
        for (let platform of this.currentLevelData.platforms) {
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        }

        // Vykreslenie checkpointov
        for (let checkpoint of this.currentLevelData.checkpoints) {
            this.drawCheckpoint(checkpoint);
        }

        // Vykreslenie špeciálnych blokov
        for (let block of this.currentLevelData.specialBlocks) {
            if (!block.hit) {
                this.ctx.fillStyle = 'purple';
                this.ctx.fillRect(block.x, block.y, block.width, block.height);
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

        // Vykreslenie normálnych mincí
        for (let coin of this.currentLevelData.coins) {
            if (!coin.collected) {
                this.ctx.fillStyle = 'gold';
                this.ctx.beginPath();
                this.ctx.arc(coin.x + coin.width/2, coin.y + coin.height/2, 
                           coin.width/2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }

        // Vykreslenie diamond mincí
        for (let diamond of this.currentLevelData.diamonds) {
            if (!diamond.collected) {
                // Vykreslenie diamantu
                this.ctx.fillStyle = '#00ffff';
                this.ctx.beginPath();
                this.ctx.moveTo(diamond.x + diamond.width/2, diamond.y);
                this.ctx.lineTo(diamond.x + diamond.width, diamond.y + diamond.height/2);
                this.ctx.lineTo(diamond.x + diamond.width/2, diamond.y + diamond.height);
                this.ctx.lineTo(diamond.x, diamond.y + diamond.height/2);
                this.ctx.closePath();
                this.ctx.fill();

                // Obrys diamantu
                this.ctx.strokeStyle = 'white';
                this.ctx.stroke();
            }
        }

        // Vykreslenie hráča (s efektom nezraniteľnosti)
        this.ctx.fillStyle = this.isInvulnerable ? 'rgba(255,0,0,0.5)' : 'red';
        this.ctx.fillRect(
            this.player.x,
            this.player.y,
            this.player.width,
            this.player.height
        );

        // Vykreslenie cieľa
        const endPoint = this.currentLevelData.endPoint;
        this.ctx.fillStyle = 'gold';
        this.ctx.fillRect(endPoint.x, endPoint.y, endPoint.width, endPoint.height);
        
        // Pridanie vlajky na cieľ
        this.ctx.fillStyle = '#00FF00';
        this.ctx.beginPath();
        this.ctx.moveTo(endPoint.x + endPoint.width/2, endPoint.y);
        this.ctx.lineTo(endPoint.x + endPoint.width, endPoint.y + endPoint.height/3);
        this.ctx.lineTo(endPoint.x + endPoint.width/2, endPoint.y + endPoint.height/2);
        this.ctx.fill();

        // Vykreslenie hráča
        this.ctx.fillStyle = this.isInvulnerable ? 'rgba(255,0,0,0.5)' : 'red';
        this.ctx.fillRect(
            this.player.x,
            this.player.y,
            this.player.width,
            this.player.height
        );

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

class Coin {
    constructor(x, y, type = 'normal') {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.type = type;
        this.collected = false;
        this.speechExercise = type === 'diamond' ? {
            word: this.getRandomWord(),
            imageUrl: this.getRandomImage(),
            attempts: 0,
            completed: false
        } : null;
    }

    getRandomWord() {
        const words = ['pes', 'mačka', 'auto', 'dom', 'strom'];
        return words[Math.floor(Math.random() * words.length)];
    }

    getRandomImage() {
        return `images/${this.getRandomWord()}.png`;
    }
}

// Spustenie hry
window.onload = () => {
    new Game();
};