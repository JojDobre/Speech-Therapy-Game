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
            console.error('Chyba při načítání slov:', error);
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
        } else {
            this.handleIncorrectMatch();
        }
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
        const matchText = document.getElementById('matchText');
        const word = this.flippedCards[0].dataset.word;

        matchText.textContent = `Vyslovte slovo "${word}"`;
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
                this.recognition.start();
            } else {
                alert('Rozpoznávání řeči není podporováno');
            }
        });
    }

    checkSpokenWord(spokenWord) {
        const word = this.flippedCards[0].dataset.word;
        const speechContainer = document.getElementById('speechContainer');

        if (spokenWord.includes(word)) {
            this.flippedCards.forEach(card => card.style.visibility = 'hidden');
            this.score++;
            document.getElementById('score').textContent = this.score;
            speechContainer.style.display = 'none';

            if (this.score === this.pairsCount) {
                this.endGame();
            }
        } else {
            this.flippedCards.forEach(card => card.classList.remove('flipped'));
        }

        this.resetFlippedCards();
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
        clearInterval(this.timerInterval);
        this.sounds.gameWin.play();

        const endTime = Date.now();
        const totalSeconds = Math.floor((endTime - this.startTime) / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        document.getElementById('totalTime').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('finalAttempts').textContent = this.attempts;
        
        const gameEndModal = document.getElementById('gameEndModal');
        gameEndModal.style.display = 'flex';
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

    if (isCustom) {
        const customWords = JSON.parse(decodeURIComponent(urlParams.get('words')));

        const customWordObjects = customWords.map(word => ({
            src: 'images/banik.png', 
            word: word
        }));

        new MemoryGame({
            words: customWords,
        });
    } else {
        new MemoryGame();
    }
});