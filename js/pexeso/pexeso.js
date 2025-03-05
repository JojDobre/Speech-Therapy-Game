const images = [
    { src: 'images/slova/baran.png', word: 'baran' },
    { src: 'images/slova/bránka.png', word: 'bránka' },
    { src: 'images/slova/hroch.png', word: 'hroch' },
    { src: 'images/slova/hus.png', word: 'hus' },
    { src: 'images/slova/pero.png', word: 'pero' },
    { src: 'images/slova/práčka.png', word: 'práčka' },
    { src: 'images/slova/syr.png', word: 'syr' },
    { src: 'images/slova/tiger.png', word: 'tiger' },
    { src: 'images/slova/traktor.png', word: 'traktor' },
    { src: 'images/slova/sova.png', word: 'sova' },
    { src: 'images/slova/tričko.png', word: 'tričko' },
    { src: 'images/slova/trúbka.png', word: 'trúbka' },
    { src: 'images/slova/tráva.png', word: 'tráva' },
    { src: 'images/slova/tiger.png', word: 'tiger' },
    { src: 'images/slova/zebra.png', word: 'zebra' },
];

class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.score = 0;
        this.attempts = 0;
        this.isProcessing = false;
        this.recognition = null;
        this.correctWords = 0;
        this.incorrectWords = 0;
        this.startTime = Date.now();
        this.waitingForSpeech = false;
        this.lastSpokenWord = null;
        this.setupSpeechRecognition();
        this.initializeGame();
    }

    setupSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'sk-SK';

            this.recognition.onresult = (event) => {
                const spokenWord = event.results[0][0].transcript.toLowerCase();
                this.checkSpokenWord(spokenWord);
            };

            this.recognition.onend = () => {
                if (this.waitingForSpeech) {
                    this.recognition.start();
                } else {
                    this.showRecordingAnimation(false);
                }
            };

            this.recognition.onerror = () => {
                this.showRecordingAnimation(false);
                this.waitingForSpeech = false;
            };
        }
    }

    initializeGame() {
        const gameContainer = document.getElementById('gameContainer');
        const doubledImages = [...images, ...images];
        this.cards = this.shuffleArray(doubledImages);

        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.index = index;

            const img = document.createElement('img');
            img.src = card.src;
            img.alt = card.word;

            cardElement.appendChild(img);
            cardElement.addEventListener('click', () => this.flipCard(cardElement, card));
            gameContainer.appendChild(cardElement);
        });
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    flipCard(cardElement, card) {
        if (this.isProcessing || cardElement.classList.contains('flipped') || 
            this.flippedCards.length >= 2 || this.waitingForSpeech) return;

        cardElement.classList.add('flipped');
        
        if (this.lastSpokenWord === card.word) {
            this.flippedCards.push({ element: cardElement, card: card });
            if (this.flippedCards.length === 2) {
                this.checkMatch();
            }
        } else {
            this.flippedCards.push({ element: cardElement, card: card });
            this.waitingForSpeech = true;
            this.showSpeechIndicator();
            this.showRecordingAnimation(true);
            this.recognition.start();
        }
    }

    showSpeechIndicator() {
        const indicator = document.getElementById('speechIndicator');
        indicator.style.display = 'block';
        setTimeout(() => {
            indicator.style.display = 'none';
        }, 3000);
    }

    checkSpokenWord(spokenWord) {
        const currentCard = this.flippedCards[this.flippedCards.length - 1].card;
        this.waitingForSpeech = false;
        this.showRecordingAnimation(false);
        
        if (spokenWord.includes(currentCard.word)) {
            this.correctWords++;
            this.lastSpokenWord = currentCard.word;
            this.showFeedback(true);
            if (this.flippedCards.length === 2) {
                this.checkMatch();
            }
        } else {
            this.incorrectWords++;
            this.showFeedback(false);
            setTimeout(() => {
                this.flippedCards.pop().element.classList.remove('flipped');
            }, 1000);
            this.lastSpokenWord = null;
        }
    }

    checkMatch() {
        this.isProcessing = true;
        const [firstCard, secondCard] = this.flippedCards;

        if (firstCard.card.word === secondCard.card.word) {
            setTimeout(() => {
                firstCard.element.style.visibility = 'hidden';
                secondCard.element.style.visibility = 'hidden';
                this.score++;
                document.getElementById('score').textContent = this.score;
                this.resetFlippedCards();
                
                // Kontrola či hra skončila
                if (this.score === images.length) {
                    this.endGame();
                }
            }, 1000);
        } else {
            setTimeout(() => {
                firstCard.element.classList.remove('flipped');
                secondCard.element.classList.remove('flipped');
                this.resetFlippedCards();
            }, 1000);
        }
        this.attempts++;
        document.getElementById('attempts').textContent = this.attempts;
    }

    createCard(card, index) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.index = index;

        // Predná strana karty
        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';

        // Zadná strana karty
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        
        const img = document.createElement('img');
        img.src = card.src;
        img.alt = card.word;
        cardBack.appendChild(img);

        cardElement.appendChild(cardFront);
        cardElement.appendChild(cardBack);

        cardElement.addEventListener('click', () => this.flipCard(cardElement, card));
        return cardElement;
    }

    showRecordingAnimation(show) {
        const animation = document.getElementById('recordingAnimation');
        animation.style.display = show ? 'block' : 'none';
    }

    showFeedback(isCorrect) {
        const feedback = document.getElementById(isCorrect ? 'correctFeedback' : 'incorrectFeedback');
        feedback.style.display = 'block';
        
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 1000);
    }

    endGame() {
        const endTime = Date.now();
        const totalSeconds = Math.floor((endTime - this.startTime) / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const modal = document.getElementById('gameEndModal');
        document.getElementById('totalTime').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('finalAttempts').textContent = this.attempts;
        document.getElementById('correctWords').textContent = this.correctWords;
        document.getElementById('incorrectWords').textContent = this.incorrectWords;
        
        modal.style.display = 'block';
    }

    resetFlippedCards() {
        this.flippedCards = [];
        this.isProcessing = false;
        this.waitingForSpeech = false;
    }
}

// Inicializácia hry
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});