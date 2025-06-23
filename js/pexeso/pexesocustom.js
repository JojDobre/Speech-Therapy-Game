class MemoryGame {
    constructor(options = {}) {
        this.words = options.words || [];
        this.pairsCount = options.pairsCount || 15;
        this.images = [];
        this.cards = [];
        this.flippedCards = [];
        this.score = 0;
        this.attempts = 0;
        this.isProcessing = false;
        this.startTime = Date.now();
        this.timerInterval = null;
        this.recognition = null;
        this.sounds = {
            cardFlip: document.getElementById('cardFlipSound'),
            correctMatch: document.getElementById('correctMatchSound'),
            incorrectMatch: document.getElementById('incorrectMatchSound'),
            gameWin: document.getElementById('gameWinSound')
        };
        this.remainingAttempts = 3;
    
        // Přidáno pro multiplayer
        this.players = options.players || [{ name: 'Hráč 1', score: 0 }];
        this.currentPlayerIndex = 0;
        this.isMultiplayer = this.players.length > 1;
    
        // Přidáme vytvoření kontejneru hráčů před inicializací hry
        this.createPlayersContainer();
    
        this.setupSpeechRecognition();
        this.initGame();
    }

    async initGame() {
        if (this.words.length === 0) {
            await this.loadWords();
        }
        this.selectWords();
        this.createGameBoard();
        this.startTimer();
        this.setupMicButton();
    }

    async loadWords() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const letter = urlParams.get('letter');
            const response = await fetch('js/pexeso/words.json');
            const data = await response.json();
            this.words = data[letter] || [];
        } catch (error) {
            console.error('Chyba pri načitaní slov:', error);
        }
    }

    selectWords() {
        const shuffled = this.shuffleArray([...this.words]);
        this.images = shuffled.slice(0, this.pairsCount);
        this.images = [...this.images, ...this.images];
        this.images = this.shuffleArray(this.images);
    }

    createGameBoard() {
        const gameContainer = document.getElementById('gameContainer');
        gameContainer.innerHTML = '';

        this.images.forEach((card, index) => {
            const cardElement = this.createCard(card, index);
            gameContainer.appendChild(cardElement);
        });
    }

    createPlayersContainer() {
        // Najdeme nebo vytvoříme kontejner před herním kontejnerem
        let playersContainer = document.querySelector('.players-container');
        if (!playersContainer) {
            playersContainer = document.createElement('div');
            playersContainer.className = 'players-container';
            
            // Vložíme kontejner před herní kontejner
            const gameContainer = document.getElementById('gameContainer');
            gameContainer.parentNode.insertBefore(playersContainer, gameContainer);
        }
    
        // Vymažeme případný existující obsah
        playersContainer.innerHTML = '';
    
        // Definujeme barvy pro hráče
        const playerColors = [
            '#FF6B6B', // červená
            '#4ECDC4', // tyrkysová
            '#45B7D1', // modrá
            '#FDCB6E'  // žlutá
        ];
    
        // Vytvoříme prvky pro každého hráče
        this.players.forEach((player, index) => {
            const playerElement = document.createElement('div');
            playerElement.className = 'player-indicator';
            playerElement.dataset.playerIndex = index;
            
            // Přiřadíme barvu hráči
            const playerColor = playerColors[index % playerColors.length];
            
            playerElement.innerHTML = `
                <div class="current-player">
                    Hráč: <span style="color: ${playerColor};">${player.name}</span>
                </div>
                <div class="player-scores">
                    <span>Skóre: ${player.score}</span>
                </div>
            `;
    
            // Zvýrazníme prvního hráče
            if (index === 0) {
                playerElement.classList.add('active-player');
            }
    
            playersContainer.appendChild(playerElement);
        });
    }

    createCard(card, index) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.word = card.word;
    
        const img = document.createElement('img');
        img.src = card.src;
        img.alt = card.word;
    
        const wordLabel = document.createElement('div');
        wordLabel.textContent = card.word;
        wordLabel.className = 'card-word';
    
        cardElement.appendChild(img);
        cardElement.appendChild(wordLabel);
    
        cardElement.addEventListener('click', () => this.flipCard(cardElement));
    
        return cardElement;
    }

    flipCard(cardElement) {
        if (this.isProcessing || 
            cardElement.classList.contains('flipped') || 
            this.flippedCards.length >= 2) return;

        this.sounds.cardFlip.play();
        cardElement.classList.add('flipped');
        this.flippedCards.push(cardElement);

        if (this.flippedCards.length === 2) {
            this.checkMatch();
        }
    }

    checkMatch() {
        this.attempts++;
        document.getElementById('attempts').textContent = this.attempts;
    
        const [card1, card2] = this.flippedCards;
        
        if (card1.dataset.word === card2.dataset.word) {
            this.handleCorrectMatch();
            // V multiplayer módu zůstává současný hráč na tahu
            if (!this.isMultiplayer) {
                this.switchToNextPlayer();
            }
        } else {
            this.handleIncorrectMatch();
            // V multiplayer módu se mění hráč
            if (this.isMultiplayer) {
                this.switchToNextPlayer();
            }
        }
    }


    switchToNextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.updatePlayerIndicator();
    }
    
    updatePlayerIndicator() {
        const playersContainer = document.querySelector('.players-container');
        if (!playersContainer) return;
    
        const playerElements = playersContainer.querySelectorAll('.player-indicator');
        
        playerElements.forEach((el, index) => {
            if (index === this.currentPlayerIndex) {
                el.classList.add('active-player');
            } else {
                el.classList.remove('active-player');
            }
    
            // Aktualizace skóre pro všechny hráče
            const scoresElement = el.querySelector('.player-scores');
            if (scoresElement) {
                const player = this.players[index];
                scoresElement.innerHTML = `<span>Skóre: ${player.score}</span>`;
            }
        });
    }

    handleCorrectMatch() {
        this.sounds.correctMatch.play();
        this.showSpeechContainer();
    }

    handleIncorrectMatch() {
        this.sounds.incorrectMatch.play();
        setTimeout(() => {
            this.flippedCards.forEach(card => card.classList.remove('flipped'));
            this.resetFlippedCards();
        }, 1000);
    }

    showSpeechContainer() {
        const speechContainer = document.getElementById('speechContainer');
        const gameWrapper = document.querySelector('.game-wrapper');
        const matchText = document.getElementById('matchText');
        const wordImage = document.getElementById('wordImage');
        const card = this.flippedCards[0];
        const word = card.dataset.word;
        
        // Nastavenie obrázka
        const img = card.querySelector('img');
        wordImage.src = img.src;
        wordImage.alt = word;
        
        matchText.textContent = `${word}`;
        speechContainer.style.display = 'flex';

    }

    setupSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'sk-SK';

            this.recognition.onstart = () => {
                document.getElementById('recordingStatus').style.display = 'block';
            };

            this.recognition.onresult = (event) => {
                const spokenWord = event.results[0][0].transcript.toLowerCase();
                this.checkSpokenWord(spokenWord);
            };

            this.recognition.onend = () => {
                document.getElementById('recordingStatus').style.display = 'none';
            };
        }
    }

    setupMicButton() {
        const micButton = document.getElementById('micButton');
        micButton.addEventListener('click', () => {
            if (this.recognition) {
                // Reset recognition pred každým novým pokusom
                this.recognition.abort();
                this.recognition.start();
                micButton.classList.add('active');
                micButton.textContent = 'Počúvam 👂';
            } else {
                alert('Rozpoznanie reči nie je podporované.');
            }
        });
    
        if (this.recognition) {
            this.recognition.onend = () => {
                document.getElementById('recordingStatus').style.display = 'none';
                micButton.classList.remove('active');
                micButton.textContent = 'Začni hovoriť 🎤';
            };
        }
    }

    checkSpokenWord(spokenWord) {
        const word = this.flippedCards[0].dataset.word;
        const speechContainer = document.getElementById('speechContainer');
        const gameWrapper = document.querySelector('.game-wrapper');
        
        // Pridáme rozmazanie pri zobrazení speech containera
        gameWrapper.classList.add('blurred');
        
        if (spokenWord.includes(word)) {
            // Správna odpoveď
            this.showFeedback('spravne', () => {
                this.flippedCards.forEach(card => card.style.visibility = 'hidden');
                
                if (this.isMultiplayer) {
                    this.players[this.currentPlayerIndex].score++;
                    this.updatePlayerIndicator();
                } else {
                    this.score++;
                }
    
                speechContainer.style.display = 'none';
                gameWrapper.classList.remove('blurred');
                this.remainingAttempts = 3;
                this.resetFlippedCards();
                
                // Kontrola stavu hry
                this.checkGameState();
            });
        } else {
            // Nesprávna odpoveď
            this.remainingAttempts--;
            
            if (this.remainingAttempts > 0) {
                this.showFeedback('nespravne', () => {
                    // Vrátime pôvodný obsah speech containera
                    this.showSpeechContainer();
                });
            } else {
                this.showFeedback('nespravne', () => {
                    this.flippedCards.forEach(card => {
                        card.classList.remove('flipped');
                    });
                    speechContainer.style.display = 'none';
                    gameWrapper.classList.remove('blurred');
                    
                    if (this.isMultiplayer) {
                        this.switchToNextPlayer();
                    }
                    
                    this.remainingAttempts = 3;
                    this.resetFlippedCards();
                    this.isProcessing = false;
                });
            }
        }
        
        // Aktualizácia zobrazenia zostávajúcich pokusov
        const attemptsElement = document.querySelector('.attempts-left');
        if (attemptsElement) {
            attemptsElement.textContent = `Počet zostávajúcich pokusov: ${this.remainingAttempts}`;
        }
    }
    
    showFeedback(type, callback) {
        const speechContainer = document.getElementById('speechContainer');
    
        // Rozmazeme pôvodný obsah speech containera
        Array.from(speechContainer.children).forEach(child => {
            child.style.filter = 'blur(5px)';
        });

        // Vytvoríme nový feedback element
        const feedbackImage = document.createElement('img');
        feedbackImage.className = 'feedback-image';
        feedbackImage.src = `images/${type}.png`;
        feedbackImage.style.display = 'block';
        
        // Pridáme feedback image
        speechContainer.appendChild(feedbackImage);
        
        // Prehráme zvuk pri správnej odpovedi
        if (type === 'spravne') {
            const sound = new Audio('zvuky/spravne.mp3');
            sound.play();
        }

        if (type === 'nespravne') {
            const sound = new Audio('zvuky/nespravne.mp3');
            sound.play();
        }

        // Po 1 sekunde odstránime feedback a zrušíme rozmazanie
        setTimeout(() => {
            feedbackImage.remove();
            Array.from(speechContainer.children).forEach(child => {
                child.style.filter = 'none';
            });
            if (callback) callback();
        }, 1000);
    }

    // Nová metóda pre kontrolu stavu hry
    checkGameState() {
        console.log('Checking game state...'); // debug
        const totalPairs = this.images.length / 2; // delíme 2, pretože každé slovo je v poli dvakrát
        
        if (this.isMultiplayer) {
            const totalScore = this.players.reduce((sum, player) => sum + player.score, 0);
            console.log('Multiplayer - Total score:', totalScore, 'Total pairs:', totalPairs);
            
            if (totalScore >= totalPairs) {
                console.log('Ending multiplayer game');
                this.endGame();
            }
        } else {
            console.log('Single player - Score:', this.score, 'Total pairs:', totalPairs);
            
            if (this.score >= totalPairs) {
                console.log('Ending single player game');
                this.endGame();
            }
        }
    }

    resetFlippedCards() {
        this.flippedCards = [];
        this.isProcessing = false;
    }

    startTimer() {
        const timerElement = document.getElementById('timer');
        this.timerInterval = setInterval(() => {
            const currentTime = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(currentTime / 60);
            const seconds = currentTime % 60;
            timerElement.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    endGame() {
        console.log('End game called'); // debug
        clearInterval(this.timerInterval);
        this.sounds.gameWin.play();
    
        const endTime = Date.now();
        const totalSeconds = Math.floor((endTime - this.startTime) / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
    
        const gameEndModal = document.getElementById('gameEndModal');
        console.log('Modal element:', gameEndModal); // debug
    
        if (!gameEndModal) {
            console.error('Game end modal not found!');
            return;
        }
    
        try {
            document.getElementById('totalTime').textContent = 
                `${minutes}:${seconds.toString().padStart(2, '0')}`;
            document.getElementById('finalAttempts').textContent = this.attempts;
    
            if (this.isMultiplayer) {
                const winner = this.players.reduce((prev, current) => 
                    (prev.score > current.score) ? prev : current
                );
                document.getElementById('winnerText').textContent = `Víťaz: ${winner.name}`;
                document.getElementById('finalScore').textContent = winner.score;
            } else {
                document.getElementById('winnerText').textContent = "Gratulujem!";
                document.getElementById('finalScore').textContent = this.score;
            }
    
            gameEndModal.style.display = 'flex';
            console.log('Modal should be visible now'); // debug

            // Odstránime existujúce event listenery (ak existujú)
            const restartBtn = document.getElementById('restartGameBtn');
            const menuBtn = document.getElementById('backToMenuBtn');

            restartBtn.replaceWith(restartBtn.cloneNode(true));
            menuBtn.replaceWith(menuBtn.cloneNode(true));

            // Pridáme nové event listenery
            document.getElementById('restartGameBtn').addEventListener('click', () => {
                console.log('Restart clicked'); // debug
                window.location.reload();
            });

            document.getElementById('backToMenuBtn').addEventListener('click', () => {
                console.log('Back to menu clicked'); // debug
                window.location.href = 'index.html';
            });

            } catch (error) {
                console.error('Error updating modal content:', error);
            }
        }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const isCustom = urlParams.get('custom');
    const playersParam = urlParams.get('players');

    if (isCustom) {
        const customWords = JSON.parse(decodeURIComponent(urlParams.get('words')));
        const players = playersParam 
            ? JSON.parse(decodeURIComponent(playersParam)) 
            : [{ name: 'Hráč 1', score: 0 }];

        new MemoryGame({
            words: customWords,
            players: players
        });
    } else {
        new MemoryGame();
    }
});