let currentLevel = null;
let selectedWords = [];
let cards = [];
let matchedPairs = 0;
let attempts = 0;
let openedCards = [];
let maxAttempts = 3;
let recognition;

function loadLevel(level) {
    document.getElementById('levelSelection').style.display = 'none';
    currentLevel = level;
    selectedWords = WORDS[level];
    initGame(selectedWords);
}

function openCustomLevelModal() {
    const modal = document.getElementById('customLevelModal');
    const wordSelection = document.getElementById('wordSelection');
    
    // Dynamické generování výběru slov
    wordSelection.innerHTML = Object.values(WORDS).flat().map(word => 
        `<label>
            <input type="checkbox" value="${word}"> ${word}
        </label>`
    ).join('');

    modal.style.display = 'block';
}

function createCustomLevel() {
    const pairCount = document.getElementById('pairCount').value;
    const selectedCheckboxes = Array.from(document.querySelectorAll('#wordSelection input:checked'));
    
    selectedWords = selectedCheckboxes.map(cb => cb.value);
    
    if (selectedWords.length < pairCount) {
        alert('Vyberte dostatečný počet slov');
        return;
    }

    // Náhodný výběr slov
    selectedWords = selectedWords.sort(() => 0.5 - Math.random()).slice(0, pairCount);
    
    document.getElementById('levelSelection').style.display = 'none';
    document.getElementById('customLevelModal').style.display = 'none';
    initGame(selectedWords);
}

function initGame(words) {
    const gameArea = document.getElementById('gameArea');
    const cardsContainer = document.getElementById('cards');
    gameArea.style.display = 'block';
    cardsContainer.innerHTML = '';
    matchedPairs = 0;
    attempts = 0;
    openedCards = [];

    // Zdvojení slov pro pexeso
    const gameWords = [...words, ...words].sort(() => 0.5 - Math.random());

    gameWords.forEach((word, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">?</div>
                <div class="card-back">
                    <img src="./images/slova/${word}.png" alt="${word}">
                    <p>${word}</p>
                </div>
            </div>
        `;
        card.dataset.word = word;
        card.querySelector('.card-front').addEventListener('click', () => flipCard(card));
        cardsContainer.appendChild(card);
    });

    setupSpeechRecognition();
}

function flipCard(card) {
    // Zabránění otočení již spárovaných nebo již otevřených karet
    if (card.classList.contains('matched') || card.classList.contains('opened')) return;

    // Přehrání zvuku otočení karty
    playSound('flip');

    // Otočení karty
    card.querySelector('.card-inner').style.transform = 'rotateY(180deg)';
    card.classList.add('opened');

    // Logika párování karet
    openedCards.push(card);

    if (openedCards.length === 2) {
        setTimeout(() => checkMatch(), 1000);
    }
}

function checkMatch() {
    const [card1, card2] = openedCards;
    
    if (card1.dataset.word === card2.dataset.word) {
        // Spárované karty
        card1.classList.add('matched');
        card2.classList.add('matched');
        
        // Zvětšení spárovaných karet
        card1.classList.add('paired-cards');
        card2.classList.add('paired-cards');
        
        // Zobrazení výzvy k vyslovení slova
        showWordPrompt(card1.dataset.word);
        
        matchedPairs++;
        
        // Kontrola konce hry
        if (matchedPairs === selectedWords.length) {
            setTimeout(gameWon, 1000);
        }
    } else {
        // Otočení karet zpět
        card1.querySelector('.card-inner').style.transform = 'rotateY(0deg)';
        card2.querySelector('.card-inner').style.transform = 'rotateY(0deg)';
        card1.classList.remove('opened');
        card2.classList.remove('opened');
    }
    
    openedCards = [];
}

function showWordPrompt(word) {
    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <h2>Povedzte slovo: ${word}</h2>
        <button id="startRecording">Nahrať</button>
    `;
    
    document.getElementById('startRecording').addEventListener('click', startSpeechRecognition);
}

function setupSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'sk-SK';
        
        recognition.onresult = (event) => {
            const speechResult = event.results[0][0].transcript.toLowerCase().trim();
            checkSpeechResult(speechResult);
        };
        
        recognition.onerror = (event) => {
            console.error('Chyba rozpoznávania reči:', event.error);
        };
    } else {
        alert('Vaša prehliadačka nepodporuje rozpoznávanie reči');
    }
}

function startSpeechRecognition() {
    if (recognition) {
        recognition.start();
        document.getElementById('startRecording').style.backgroundColor = 'red';
    }
}

function checkSpeechResult(spokenWord) {
    const currentWord = document.querySelector('.paired-cards').dataset.word;
    const resultArea = document.getElementById('result');
    
    if (spokenWord === currentWord) {
        // Správně vysloveno
        resultArea.innerHTML = `
            <img src="./images/spravne.png" alt="Správne">
            <p>Výborne!</p>
        `;
        playSound('correct');
        
        // Odebrání spárovaných karet
        document.querySelectorAll('.paired-cards').forEach(card => card.remove());
    } else {
        attempts++;
        
        if (attempts >= maxAttempts) {
            gameOver();
        } else {
            // Nesprávně vysloveno
            resultArea.innerHTML = `
                <img src="./images/nespravne.png" alt="Nesprávne">
                <p>Skúste znova (Pokus ${attempts}/${maxAttempts})</p>
                <button id="startRecording">Nahrať znova</button>
            `;
            playSound('incorrect');
            
            document.getElementById('startRecording').addEventListener('click', startSpeechRecognition);
        }
    }
}

function gameWon() {
    playSound('win');
    alert('Gratulujeme! Vyhrali ste hru!');
    resetGame();
}

function gameOver() {
    playSound('lose');
    alert('Presiahli ste maximálny počet pokusov. Hra skončila.');
    resetGame();
}

function resetGame() {
    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('levelSelection').style.display = 'block';
    document.getElementById('result').innerHTML = '';
}

function playSound(type) {
    // Implementace zvukových efektů
    const sounds = {
        'flip': new Audio('./zvuky/effects/kopanie.mp3'),
        'correct': new Audio('./zvuky/effects/spravne.mp3'),
        'incorrect': new Audio('./zvuky/effects/zle.mp3'),
        'win': new Audio('./zvuky/effects/vyhra.mp3'),
        'lose': new Audio('./zvuky/effects/zle.mp3')
    };
    
    if (sounds[type]) {
        sounds[type].play();
    }
}

// Zavření modálního okna
document.querySelector('.close').onclick = function() {
    document.getElementById('customLevelModal').style.display = 'none';
}