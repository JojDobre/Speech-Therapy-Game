const images = [
    { src: 'images/slova/šálka.png', word: 'šálka' },
    { src: 'images/slova/šampón.png', word: 'šampón' },
    { src: 'images/slova/šach.png', word: 'šach' },
    { src: 'images/slova/šaty.png', word: 'šaty' },
    { src: 'images/slova/šašo.png', word: 'šašo' },
    { src: 'images/slova/šiška.png', word: 'šiška' },
    { src: 'images/slova/šiltovka.png', word: 'šiltovka' },
    { src: 'images/slova/šípka.png', word: 'šípka' },
    { src: 'images/slova/šíp.png', word: 'šíp' },
    { src: 'images/slova/štipec.png', word: 'štipec' },
    { src: 'images/slova/švihadlo.png', word: 'švihadlo' },
    { src: 'images/slova/pištoľ.png', word: 'pištoľ' },
    { src: 'images/slova/fľaša.png', word: 'fľaša' },
    { src: 'images/slova/mašľa.png', word: 'mašľa' },
    { src: 'images/slova/myš.webp', word: 'myš' },
    { src: 'images/slova/kôš.webp', word: 'kôš' },
    { src: 'images/slova/mikuláš.png', word: 'mikuláš' }
];

class MemoryGame {
    constructor() {
        // Výber 15 náhodných slov bez opakovania
        const selectedImages = this.selectRandomWords(images, 15);
        
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
        this.setupSpeechRecognition();
        this.initializeGame(selectedImages);
    }
    // Nová metóda na výber náhodných slov
    selectRandomWords(allWords, count) {
        // Vytvorenie kópie pôvodného poľa
        const shuffled = [...allWords];
        
        // Premiešanie poľa
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        // Vrátenie prvých count slov
        return shuffled.slice(0, count);
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
                }
                this.showRecordingAnimation(false);
            };

            this.recognition.onerror = () => {
                this.showRecordingAnimation(false);
                this.waitingForSpeech = false;
            };
        }
    }
    initializeGame(selectedImages) {
        const gameContainer = document.getElementById('gameContainer');
        // Zdvojenie vybraných obrázkov
        const doubledImages = [...selectedImages, ...selectedImages];
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
        this.flippedCards.push({ element: cardElement, card: card });

        if (this.flippedCards.length === 2) {
            this.checkMatch();
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
        this.showRecordingAnimation(false);
        this.waitingForSpeech = false;
        
        const currentCard = this.flippedCards[0].card;
        if (spokenWord.includes(currentCard.word)) {
            // Správne vyslovené slovo
            this.correctWords++;
            this.showFeedback(true);
            setTimeout(() => {
                this.flippedCards.forEach(card => {
                    card.element.style.visibility = 'hidden';
                });
                this.score++;
                document.getElementById('score').textContent = this.score;
                this.resetFlippedCards();
                
                // Kontrola či hra skončila
                if (this.score === images.length) {
                    this.endGame();
                }
            }, 1000);
        } else {
            // Nesprávne vyslovené slovo
            this.incorrectWords++;
            this.showFeedback(false);
            setTimeout(() => {
                this.flippedCards.forEach(card => {
                    card.element.classList.remove('flipped');
                });
                this.resetFlippedCards();
            }, 1000);
        }
    }

    checkMatch() {
        this.isProcessing = true;
        const [firstCard, secondCard] = this.flippedCards;
        this.attempts++;
        document.getElementById('attempts').textContent = this.attempts;

        if (firstCard.card.word === secondCard.card.word) {
            // Karty sa zhodujú - spustíme rozpoznávanie reči
            this.waitingForSpeech = true;
            this.showSpeechIndicator();
            this.showRecordingAnimation(true);
            setTimeout(() => {
                this.recognition.start();
            }, 500);
        } else {
            // Karty sa nezhodujú - otočíme ich späť
            setTimeout(() => {
                firstCard.element.classList.remove('flipped');
                secondCard.element.classList.remove('flipped');
                this.resetFlippedCards();
            }, 1000);
        }
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