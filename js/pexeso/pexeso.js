/**
 * ===============================================
 * PEXESO.JS - LOGOPEDICKÁ PEXESO HRA S LEVELMI
 * ===============================================
 * 
 * Hlavný súbor pre pexeso hru podporujúcu:
 * - Level systém s načítavaním z levels.js
 * - Singleplayer režim pre levely
 * - Multiplayer režim pre custom hry (až 4 hráči)
 * - Speech recognition a rečové cvičenia
 * - Stars hodnotenie system
 * - Progress tracking
 * 
 * Autor: Adam Reňak
 * Verzia: 2.0
 * Dátum: 2025
 */

// ==========================================
// GLOBÁLNE PREMENNÉ A KONFIGURÁCIA
// ==========================================

let currentLevel = null;          // Aktuálny level config
let gameState = null;            // Stav hry
let gameCards = [];              // Pole všetkých kariet
let flippedCards = [];           // Práve otočené karty
let matchedPairs = 0;            // Počet nájdených párov
let totalPairs = 0;              // Celkový počet párov
let gameTime = 0;                // Herný čas v sekundách
let gameAttempts = 0;            // Počet pokusov
let timerInterval = null;        // Interval pre časovač
let isProcessingMatch = false;   // Zamedzenie viacnásobného klikania
let speechAttempts = 0;          // Pokusy na speech recognition
let maxSpeechAttempts = 3;       // Maximálny počet pokusov
let correctSpeechCount = 0;      // Počet správne vyslovenych slov

// Multiplayer premenné
let players = [];                // Pole hráčov (pre custom hry)
let currentPlayerIndex = 0;      // Index aktuálneho hráča
let isMultiplayerMode = false;   // Či je multiplayer režim

// Speech recognition
let recognition = null;          // Speech recognition objekt

// ==========================================
// INICIALIZÁCIA HRY
// ==========================================

/**
 * Hlavná inicializačná funkcia - spúšťa sa pri načítaní stránky
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Inicializujem pexeso hru...');
    
    // Skrytie loading screen
    hideLoadingScreen();
    
    // Získanie parametrov z URL
    const params = getURLParameters();
    
    if (params.custom) {
        // Custom hra s vlastnými parametrami
        initCustomGame(params);
    } else if (params.worldId && params.levelId) {
        // Level hra z worlds menu
        initLevelGame(params.worldId, params.levelId);
    } else {
        // Fallback - ukážková hra
        initDemoGame();
    }
    
    // Nastavenie speech recognition
    setupSpeechRecognition();
    
    // Nastavenie event listenerov
    setupEventListeners();
});

/**
 * Skrytie loading screenu s animáciou
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    }
}

/**
 * Získanie parametrov z URL
 * @returns {Object} Objekt s URL parametrami
 */
function getURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        custom: urlParams.get('custom') === 'true',
        worldId: urlParams.get('worldId'),
        levelId: urlParams.get('levelId'),
        words: urlParams.get('words'),
        players: urlParams.get('players'),
        pairs: parseInt(urlParams.get('pairs')) || 10,
        timeLimit: parseInt(urlParams.get('timeLimit')) || null
    };
}

// ==========================================
// INICIALIZÁCIA RÔZNYCH TYPOV HIER
// ==========================================

/**
 * Inicializácia level hry z worlds menu
 * @param {string} worldId - ID sveta
 * @param {string} levelId - ID levelu
 */
function initLevelGame(worldId, levelId) {
    console.log(`🌍 Načítavam level: ${worldId} - ${levelId}`);
    
    // Získanie level configu
    if (typeof getLevelConfig === 'function') {
        currentLevel = getLevelConfig(levelId);
    }
    
    if (!currentLevel) {
        console.error('❌ Level sa nepodarilo načítať!');
        showErrorMessage('Level sa nepodarilo načítať. Vraciam sa na menu.');
        setTimeout(() => {
            window.location.href = 'worldsmenu.html';
        }, 3000);
        return;
    }
    
    // Nastavenie hry pre singleplayer level
    isMultiplayerMode = false;
    players = [{ name: 'Hráč', score: 0 }];
    
    // Nastavenie počtu párov z level configu
    if (currentLevel.gameConfig && currentLevel.gameConfig.pairs) {
        totalPairs = currentLevel.gameConfig.pairs;
    } else {
        totalPairs = 8; // Defaultná hodnota
    }
    
    // Inicializácia hry
    initGame();
}

/**
 * Inicializácia custom hry s vlastnými parametrami
 * @param {Object} params - Parametre z URL
 */
function initCustomGame(params) {
    console.log('🎨 Načítavam custom hru...');
    
    // Parsovanie slov a hráčov z URL
    let customWords = [];
    let customPlayers = [];
    
    try {
        if (params.words) {
            customWords = JSON.parse(decodeURIComponent(params.words));
        }
        if (params.players) {
            customPlayers = JSON.parse(decodeURIComponent(params.players));
        }
    } catch (error) {
        console.error('❌ Chyba pri parsovaní custom parametrov:', error);
    }
    
    // Vytvorenie fake level configu pre custom hru
    currentLevel = {
        id: 'custom',
        name: 'Custom hra',
        words: customWords.length > 0 ? customWords : ['rak', 'ryba', 'ruka', 'ráno'], // fallback
        gameConfig: {
            pairs: params.pairs || Math.min(customWords.length, 8)
        },
        timeLimit: params.timeLimit
    };
    
    // Nastavenie multiplayer režimu
    if (customPlayers.length > 1) {
        isMultiplayerMode = true;
        players = customPlayers;
    } else {
        isMultiplayerMode = false;
        players = [{ name: customPlayers[0]?.name || 'Hráč', score: 0 }];
    }
    
    totalPairs = currentLevel.gameConfig.pairs;
    
    // Inicializácia hry
    initGame();
}

/**
 * Inicializácia demo hry (fallback)
 */
function initDemoGame() {
    console.log('🎯 Spúšťam demo hru...');
    
    // Vytvorenie demo level configu
    currentLevel = {
        id: 'demo',
        name: 'Demo hra',
        words: ['rak', 'ryba', 'ruka', 'rakva', 'rádio', 'krava', 'drak', 'zebra', 'tiger', 'traktor'],
        gameConfig: {
            pairs: 8
        },
        timeLimit: null
    };
    
    isMultiplayerMode = false;
    players = [{ name: 'Hráč', score: 0 }];
    totalPairs = 8;
    
    initGame();
}

// ==========================================
// HLAVNÁ HERNÁ LOGIKA
// ==========================================

/**
 * Hlavná inicializačná funkcia hry
 */
function initGame() {
    console.log('🚀 Inicializujem hernú logiku...');
    
    // Reset stavu hry
    resetGameState();
    
    // Aktualizácia UI
    updateTopPanel();
    updateSidePanel();
    
    // Generovanie herného poľa
    generateGameBoard();
    
    // Spustenie časovača
    startGameTimer();
    
    console.log('✅ Hra je pripravená!');
}

/**
 * Reset všetkých herných premenných
 */
function resetGameState() {
    gameCards = [];
    flippedCards = [];
    matchedPairs = 0;
    gameTime = 0;
    gameAttempts = 0;
    isProcessingMatch = false;
    speechAttempts = 0;
    correctSpeechCount = 0;
    currentPlayerIndex = 0;
    
    // Reset skóre hráčov
    players.forEach(player => player.score = 0);
    
    // Zastavenie existujúceho časovača
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

/**
 * Aktualizácia horného panelu s časom a pokusmi
 */
function updateTopPanel() {
    // Aktualizácia času
    const timeElement = document.getElementById('game-time');
    if (timeElement) {
        const minutes = Math.floor(gameTime / 60);
        const seconds = gameTime % 60;
        timeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Aktualizácia pokusov
    const attemptsElement = document.getElementById('game-attempts');
    if (attemptsElement) {
        attemptsElement.textContent = gameAttempts.toString();
    }
}

/**
 * Aktualizácia bočného panelu s hráčmi
 */
function updateSidePanel() {
    const sidePanels = document.querySelectorAll('.players-panel');
    
    sidePanels.forEach((panel, index) => {
        if (index < players.length) {
            // Zobrazenie hráča
            panel.style.display = 'flex';
            
            const nameElement = panel.querySelector('.name h1');
            const scoreElement = panel.querySelector('.score span');
            
            if (nameElement) nameElement.textContent = players[index].name;
            if (scoreElement) scoreElement.textContent = players[index].score.toString();
            
            // Zvýraznenie aktuálneho hráča
            if (isMultiplayerMode && index === currentPlayerIndex) {
                panel.style.border = '4px solid #ECCF17';
                panel.style.boxShadow = '0 0 20px 2px #ECCF17 inset';
            } else {
                panel.style.border = '4px solid #AC3F0B';
                panel.style.boxShadow = 'none';
            }
        } else {
            // Skrytie nepotrebných panelov
            panel.style.display = 'none';
        }
    });
}

// ==========================================
// GENEROVANIE HERNÉHO POĽA
// ==========================================

/**
 * Hlavná funkcia pre generovanie herného poľa s kartami
 */
function generateGameBoard() {
    console.log('🃏 Generujem herné pole...');
    
    // Výber slov pre hru
    const selectedWords = selectWordsForGame();
    
    // Vytvorenie párov kariet
    gameCards = createCardPairs(selectedWords);
    
    // Zamichanie kariet
    shuffleArray(gameCards);
    
    // Vykreslenie kariet na obrazovku
    renderGameBoard();
    
    console.log(`✅ Vygenerované ${gameCards.length} kariet (${totalPairs} párov)`);
}

/**
 * Výber slov pre aktuálnu hru
 * @returns {Array} Pole vybraných slov
 */
function selectWordsForGame() {
    let availableWords = currentLevel.words || [];
    
    // Ak nemáme dostatok slov, pridáme duplicity
    while (availableWords.length < totalPairs) {
        availableWords = [...availableWords, ...currentLevel.words];
    }
    
    // Náhodný výber požadovaného počtu slov
    const shuffled = [...availableWords];
    shuffleArray(shuffled);
    
    return shuffled.slice(0, totalPairs);
}

/**
 * Vytvorenie párov kariet z vybraných slov
 * @param {Array} words - Pole slov
 * @returns {Array} Pole objektov kariet
 */
function createCardPairs(words) {
    const cards = [];
    let cardId = 0;
    
    // Pre každé slovo vytvoríme 2 karty (pár)
    words.forEach(word => {
        // Prvá karta páru
        cards.push({
            id: cardId++,
            word: word,
            imagePath: `images/slova/${word}.png`,
            isFlipped: false,
            isMatched: false,
            pairId: word // Identifikátor páru
        });
        
        // Druhá karta páru
        cards.push({
            id: cardId++,
            word: word,
            imagePath: `images/slova/${word}.png`,
            isFlipped: false,
            isMatched: false,
            pairId: word
        });
    });
    
    return cards;
}

/**
 * Vykreslenie herného poľa do DOM
 */
function renderGameBoard() {
    const gameCanvas = document.getElementById('gameCanvas');
    if (!gameCanvas) {
        console.error('❌ gameCanvas element nenájdený!');
        return;
    }
    
    // Vyčistenie existujúceho obsahu
    gameCanvas.innerHTML = '';
    
    // Pridanie CSS triedy pre správnu veľkosť kariet
    gameCanvas.className = `cards-${gameCards.length}`;
    
    // Vytvorenie a pridanie kariet
    gameCards.forEach((cardData, index) => {
        const cardElement = createCardElement(cardData, index);
        gameCanvas.appendChild(cardElement);
    });
}

/**
 * Vytvorenie HTML elementu pre jednu kartu
 * @param {Object} cardData - Dáta karty
 * @param {number} index - Index karty
 * @returns {HTMLElement} HTML element karty
 */
function createCardElement(cardData, index) {
    // Hlavný kontajner karty
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';
    cardContainer.dataset.cardId = cardData.id;
    cardContainer.dataset.pairId = cardData.pairId;
    
    // Obrázok karty - na začiatku baník, po otočení slovo
    const cardImage = document.createElement('img');
    cardImage.src = 'images/banik.png'; // Zadná strana - baník
    cardImage.alt = 'Pexeso karta';
    cardImage.className = 'card-image';
    cardImage.dataset.wordImage = cardData.imagePath; // Uložíme cestu k slovu
    
    // Text karty
    const cardText = document.createElement('span');
    cardText.textContent = 'PEXESO';
    cardText.className = 'card-text';
    cardText.dataset.wordText = cardData.word; // Uložíme text slova
    
    // Pridanie obsahu do kontajnera
    cardContainer.appendChild(cardImage);
    cardContainer.appendChild(cardText);
    
    // Event listener pre kliknutie na kartu
    cardContainer.addEventListener('click', () => handleCardClick(cardData.id));
    
    return cardContainer;
}

// ==========================================
// HERNÉ MECHANIZMY - OTÁČANIE KARIET
// ==========================================

/**
 * Spracovanie kliknutia na kartu
 * @param {number} cardId - ID kliknutej karty
 */
function handleCardClick(cardId) {
    console.log(`🖱️ Klik na kartu ID: ${cardId}`);
    
    // Kontroly pred otočením karty
    if (isProcessingMatch) {
        console.log('⏳ Spracovávam match, ignorujem klik');
        return;
    }
    
    const card = gameCards.find(c => c.id === cardId);
    if (!card) {
        console.error('❌ Karta nebola nájdená!');
        return;
    }
    
    if (card.isFlipped || card.isMatched) {
        console.log('ℹ️ Karta už je otočená alebo nájdená');
        return;
    }
    
    if (flippedCards.length >= 2) {
        console.log('ℹ️ Už sú otočené 2 karty');
        return;
    }
    
    // Otočenie karty
    flipCard(cardId);
    
    // Kontrola na zhodu ak sú otočené 2 karty
    if (flippedCards.length === 2) {
        gameAttempts++;
        updateTopPanel();
        
        setTimeout(() => {
            checkCardMatch();
        }, 600); // Skrátené z 1000ms na 600ms
    }
}

/**
 * Otočenie konkrétnej karty
 * @param {number} cardId - ID karty na otočenie
 */
function flipCard(cardId) {
    const card = gameCards.find(c => c.id === cardId);
    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
    
    if (!card || !cardElement) return;
    
    // Zmena stavu karty
    card.isFlipped = true;
    flippedCards.push(card);
    
    // Animácia otočenia karty
    cardElement.classList.add('flipping');
    
    setTimeout(() => {
        // Zmena obrázka z baníka na slovo
        const image = cardElement.querySelector('.card-image');
        const text = cardElement.querySelector('.card-text');
        
        if (image) image.src = image.dataset.wordImage; // Zmena na obrázok slova
        if (text) text.textContent = text.dataset.wordText; // Zmena na text slova
        
        // Pridanie CSS triedy pre otočenú kartu
        cardElement.classList.add('flipped');
        cardElement.classList.remove('flipping');
    }, 150); // Polovica animácie
    
    console.log(`✅ Karta otočená: ${card.word}`);
}

/**
 * Kontrola zhody medzi dvoma otočenými kartami
 */
function checkCardMatch() {
    if (flippedCards.length !== 2) return;
    
    isProcessingMatch = true;
    
    const [card1, card2] = flippedCards;
    
    console.log(`🔍 Kontrolujem zhodu: ${card1.word} vs ${card2.word}`);
    
    if (card1.pairId === card2.pairId) {
        // Zhoda nájdená!
        handleMatchFound(card1, card2);
    } else {
        // Zhoda nenájdená
        handleMatchNotFound(card1, card2);
    }
}

/**
 * Spracovanie nájdenej zhody
 * @param {Object} card1 - Prvá karta páru
 * @param {Object} card2 - Druhá karta páru
 */
function handleMatchFound(card1, card2) {
    console.log(`🎉 Pár nájdený: ${card1.word}!`);
    
    // Označenie kariet ako nájdených
    card1.isMatched = true;
    card2.isMatched = true;
    matchedPairs++;
    
    // Vizuálne označenie nájdených kariet
    const card1Element = document.querySelector(`[data-card-id="${card1.id}"]`);
    const card2Element = document.querySelector(`[data-card-id="${card2.id}"]`);
    
    if (card1Element) card1Element.classList.add('matched');
    if (card2Element) card2Element.classList.add('matched');
    
    // Zvýšenie skóre aktuálneho hráča
    if (isMultiplayerMode) {
        players[currentPlayerIndex].score++;
        updateSidePanel();
    } else {
        // Pre single player mode aktualizuj skóre v side paneli
        if (players[0]) {
            players[0].score++;
            updateSidePanel();
        }
    }
    
    // Spustenie rečového cvičenia
    startSpeechExercise(card1.word);
}

/**
 * Spracovanie nenájdenej zhody
 * @param {Object} card1 - Prvá karta
 * @param {Object} card2 - Druhá karta
 */
function handleMatchNotFound(card1, card2) {
    console.log(`❌ Pár nenájdený: ${card1.word} vs ${card2.word}`);
    
    // Pridanie animácie pre nesprávne páry
    const card1Element = document.querySelector(`[data-card-id="${card1.id}"]`);
    const card2Element = document.querySelector(`[data-card-id="${card2.id}"]`);
    
    if (card1Element) {
        card1Element.classList.add('wrong-match');
        setTimeout(() => card1Element.classList.remove('wrong-match'), 500);
    }
    if (card2Element) {
        card2Element.classList.add('wrong-match');
        setTimeout(() => card2Element.classList.remove('wrong-match'), 500);
    }
    
    // Otočenie kariet späť po kratšom čase
    setTimeout(() => {
        flipCardBack(card1.id);
        flipCardBack(card2.id);
        
        // Prepnutie hráča v multiplayer režime
        if (isMultiplayerMode) {
            switchToNextPlayer();
        }
        
        resetFlippedCards();
    }, 1000); // Trochu dlhšie kvôli animácii wrong-match
}

/**
 * Otočenie karty späť (zakrytie)
 * @param {number} cardId - ID karty
 */
function flipCardBack(cardId) {
    const card = gameCards.find(c => c.id === cardId);
    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
    
    if (!card || !cardElement) return;
    
    // Zmena stavu karty
    card.isFlipped = false;
    
    // Animácia otočenia karty späť
    cardElement.classList.add('flipping');
    
    setTimeout(() => {
        // Zmena obrázka späť na baníka a textu na PEXESO
        const image = cardElement.querySelector('.card-image');
        const text = cardElement.querySelector('.card-text');
        
        if (image) image.src = 'images/banik.png'; // Zmena späť na baníka
        if (text) text.textContent = 'PEXESO'; // Zmena späť na PEXESO
        
        // Odstránenie CSS triedy
        cardElement.classList.remove('flipped');
        cardElement.classList.remove('flipping');
    }, 150); // Polovica animácie
}

/**
 * Reset zoznamu otočených kariet
 */
function resetFlippedCards() {
    flippedCards = [];
    isProcessingMatch = false;
}

/**
 * Prepnutie na ďalšieho hráča (multiplayer)
 */
function switchToNextPlayer() {
    if (!isMultiplayerMode) return;
    
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    updateSidePanel();
    
    console.log(`🔄 Hráč na rade: ${players[currentPlayerIndex].name}`);
}

// ==========================================
// REČOVÉ CVIČENIA
// ==========================================

/**
 * Spustenie rečového cvičenia pre dané slovo
 * @param {string} word - Slovo na precvičenie
 */
function startSpeechExercise(word) {
    console.log(`🎤 Spúšťam rečové cvičenie pre slovo: ${word}`);
    
    // Zobrazenie modalu pre cvičenie
    showSpeechExerciseModal(word);
    
    // Reset pokusov
    speechAttempts = 0;
}

/**
 * Zobrazenie modalu pre rečové cvičenie
 * @param {string} word - Slovo na precvičenie
 */
function showSpeechExerciseModal(word) {
    const modal = document.getElementById('cvicenie');
    const wordDisplay = document.getElementById('word-display');
    const image = document.getElementById('cvicenie-image');
    const button = document.getElementById('rozpoznanie');
    
    if (!modal || !wordDisplay || !image || !button) {
        console.error('❌ Modal elementy pre cvičenie nenájdené!');
        completeSpeechExercise(true); // Pokračuj bez cvičenia
        return;
    }
    
    // Nastavenie obsahu modalu
    wordDisplay.textContent = word.toUpperCase();
    image.src = `images/slova/${word}.png`;
    image.alt = word;
    
    // Zobrazenie modalu
    modal.style.display = 'block';
    
    // Event listener pre tlačidlo
    button.onclick = () => startListening(word);
}

/**
 * Skrytie modalu pre rečové cvičenie
 */
function hideSpeechExerciseModal() {
    const modal = document.getElementById('cvicenie');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ==========================================
// SPEECH RECOGNITION
// ==========================================

/**
 * Nastavenie speech recognition
 */
function setupSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'sk-SK';
        
        recognition.onstart = handleRecognitionStart;
        recognition.onresult = handleRecognitionResult;
        recognition.onend = handleRecognitionEnd;
        recognition.onerror = handleRecognitionError;
        
        console.log('✅ Speech recognition nastavené');
    } else {
        console.warn('⚠️ Speech recognition nie je podporované');
    }
}

/**
 * Začiatok počúvania
 * @param {string} expectedWord - Očakávané slovo
 */
function startListening(expectedWord) {
    if (!recognition) {
        console.error('❌ Speech recognition nie je dostupné');
        return;
    }
    
    console.log(`🎤 Začínam počúvať slovo: ${expectedWord}`);
    
    // Nastavenie očakávaného slova
    recognition.expectedWord = expectedWord;
    
    // Spustenie rozpoznávania
    try {
        recognition.start();
        updateListeningButton(true);
    } catch (error) {
        console.error('❌ Chyba pri spustení rozpoznávania:', error);
    }
}

/**
 * Spracovanie začiatku rozpoznávania
 */
function handleRecognitionStart() {
    console.log('🎤 Rozpoznávanie spustené');
    updateListeningButton(true);
}

/**
 * Spracovanie výsledku rozpoznávania
 * @param {SpeechRecognitionEvent} event - Event s výsledkom
 */
function handleRecognitionResult(event) {
    const result = event.results[0][0].transcript.toLowerCase().trim();
    const expectedWord = recognition.expectedWord.toLowerCase();
    
    console.log(`🗣️ Rozpoznané: "${result}", očakávané: "${expectedWord}"`);
    
    speechAttempts++;
    
    if (result.includes(expectedWord) || expectedWord.includes(result)) {
        // Správne vyslovené
        handleCorrectSpeech();
    } else {
        // Nesprávne vyslovené
        handleIncorrectSpeech(result, expectedWord);
    }
}

/**
 * Spracovanie správnej výslovnosti
 */
function handleCorrectSpeech() {
    console.log('✅ Slovo správne vyslovené!');
    
    correctSpeechCount++;
    showSpeechFeedback(true);
    
    setTimeout(() => {
        completeSpeechExercise(true);
    }, 1500); // Skrátené z 2000ms na 1500ms
}

/**
 * Spracovanie nesprávnej výslovnosti
 * @param {string} spokenWord - Vyslovené slovo
 * @param {string} expectedWord - Očakávané slovo
 */
function handleIncorrectSpeech(spokenWord, expectedWord) {
    console.log(`❌ Nesprávne vyslovené. Pokus ${speechAttempts}/${maxSpeechAttempts}`);
    
    showSpeechFeedback(false, speechAttempts, maxSpeechAttempts);
    
    if (speechAttempts >= maxSpeechAttempts) {
        // Vyčerpané pokusy
        setTimeout(() => {
            completeSpeechExercise(false);
        }, 1500); // Skrátené z 2000ms na 1500ms
    } else {
        // Ďalší pokus
        setTimeout(() => {
            hideSpeechFeedback();
        }, 1500); // Skrátené z 2000ms na 1500ms
    }
}

/**
 * Spracovanie konca rozpoznávania
 */
function handleRecognitionEnd() {
    console.log('🎤 Rozpoznávanie ukončené');
    updateListeningButton(false);
}

/**
 * Spracovanie chyby rozpoznávania
 * @param {SpeechRecognitionEvent} event - Error event
 */
function handleRecognitionError(event) {
    console.error('❌ Chyba rozpoznávania:', event.error);
    updateListeningButton(false);
    
    // Pri chybe ukončíme cvičenie
    setTimeout(() => {
        completeSpeechExercise(false);
    }, 1000);
}

/**
 * Aktualizácia tlačidla počúvania
 * @param {boolean} isListening - Či práve počúvame
 */
function updateListeningButton(isListening) {
    const button = document.getElementById('rozpoznanie');
    const buttonContainer = button?.parentElement;
    
    if (!button || !buttonContainer) return;
    
    if (isListening) {
        buttonContainer.classList.add('recording');
        button.querySelector('a').textContent = 'POČÚVAM...';
    } else {
        buttonContainer.classList.remove('recording');
        button.querySelector('a').textContent = 'HOVORIŤ';
    }
}

/**
 * Zobrazenie feedback-u po rečovom cvičení
 * @param {boolean} isCorrect - Či bolo slovo správne vyslovené
 * @param {number} attempt - Aktuálny pokus (voliteľné)
 * @param {number} maxAttempts - Maximálny počet pokusov (voliteľné)
 */
function showSpeechFeedback(isCorrect, attempt = null, maxAttempts = null) {
    const vysledokDiv = document.getElementById('vysledok');
    if (!vysledokDiv) return;
    
    let content = '';
    
    if (isCorrect) {
        // Správna odpoveď
        content = `
            <center>
                <img src="images/spravne.png" alt="Správne">
                <div class="success-message">
                    <span style="color: #00ff00; font-size: 32px; font-weight: bold;">VÝBORNE!</span>
                </div>
            </center>
        `;
    } else {
        // Nesprávna odpoveď
        const remainingAttempts = maxAttempts - attempt;
        content = `
            <center>
                <img src="images/nespravne.png" alt="Nesprávne">
                <div class="attempt-message">
                    <span style="color: #ff6b6b; font-size: 28px;">SKÚSTE ZNOVA</span>
                    ${remainingAttempts > 0 ? 
                        `<br><span style="color: #ffffff; font-size: 20px;">Zostávajú ${remainingAttempts} pokusy</span>` : 
                        `<br><span style="color: #ff6b6b; font-size: 20px;">Žiadne pokusy nezostali</span>`
                    }
                </div>
            </center>
        `;
    }
    
    vysledokDiv.innerHTML = content;
    vysledokDiv.classList.add('show');
}

/**
 * Skrytie speech feedback-u
 */
function hideSpeechFeedback() {
    const vysledokDiv = document.getElementById('vysledok');
    if (vysledokDiv) {
        vysledokDiv.classList.remove('show');
        vysledokDiv.innerHTML = '';
    }
}

/**
 * Dokončenie rečového cvičenia
 * @param {boolean} wasSuccessful - Či bolo cvičenie úspešné
 */
function completeSpeechExercise(wasSuccessful) {
    console.log(`🎯 Rečové cvičenie dokončené. Úspech: ${wasSuccessful}`);
    
    // Skrytie modalu
    hideSpeechExerciseModal();
    hideSpeechFeedback();
    
    // Ak bolo rečové cvičenie neúspešné, otočíme karty späť
    if (!wasSuccessful && flippedCards.length === 2) {
        // Otočenie kariet späť po neúspešnom rečovom cvičení
        setTimeout(() => {
            const [card1, card2] = flippedCards;
            
            // Zmeníme stav kariet
            card1.isMatched = false;
            card2.isMatched = false;
            matchedPairs--;
            
            // Vizuálne odstránenie matched triedy
            const card1Element = document.querySelector(`[data-card-id="${card1.id}"]`);
            const card2Element = document.querySelector(`[data-card-id="${card2.id}"]`);
            
            if (card1Element) card1Element.classList.remove('matched');
            if (card2Element) card2Element.classList.remove('matched');
            
            // Otočenie kariet späť
            flipCardBack(card1.id);
            flipCardBack(card2.id);
            
            // Prepnutie hráča ak je multiplayer
            if (isMultiplayerMode) {
                switchToNextPlayer();
            }
            
            // Aktualizácia skóre
            if (isMultiplayerMode && players[currentPlayerIndex]) {
                players[currentPlayerIndex].score = Math.max(0, players[currentPlayerIndex].score - 1);
            } else if (players[0]) {
                players[0].score = Math.max(0, players[0].score - 1);
            }
            updateSidePanel();
            
            resetFlippedCards();
        }, 500);
    } else {
        // Reset flipped cards pre úspešné cvičenie
        resetFlippedCards();
    }
    
    // Kontrola konca hry
    if (matchedPairs >= totalPairs && wasSuccessful) {
        setTimeout(() => {
            endGame();
        }, 500);
    }
}

// ==========================================
// ČASOVAČ A HERNÝ ČAS
// ==========================================

/**
 * Spustenie herného časovača
 */
function startGameTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        gameTime++;
        updateTopPanel();
        
        // Kontrola časového limitu
        if (currentLevel.timeLimit && gameTime >= currentLevel.timeLimit) {
            console.log('⏰ Čas vypršal!');
            endGameTimeOut();
        }
    }, 1000);
    
    console.log('⏰ Časovač spustený');
}

/**
 * Zastavenie herného časovača
 */
function stopGameTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        console.log('⏰ Časovač zastavený');
    }
}

// ==========================================
// KONIEC HRY
// ==========================================

/**
 * Ukončenie hry - úspešné dokončenie
 */
function endGame() {
    console.log('🎉 Hra ukončená - víťazstvo!');
    
    stopGameTimer();
    
    // Výpočet výsledkov
    const gameResults = calculateGameResults();
    
    // Uloženie progress (len pre level hry)
    if (!isMultiplayerMode && currentLevel.id !== 'demo' && currentLevel.id !== 'custom') {
        saveGameProgress(gameResults);
    }
    
    // Zobrazenie end game modalu
    showEndGameModal(gameResults);
}

/**
 * Ukončenie hry - vypršal čas
 */
function endGameTimeOut() {
    console.log('⏰ Hra ukončená - vypršal čas!');
    
    stopGameTimer();
    
    const gameResults = calculateGameResults();
    gameResults.isTimeOut = true;
    gameResults.stars = 0; // Žiadne hviezdy pri timeoutu
    
    showEndGameModal(gameResults);
}

/**
 * Výpočet výsledkov hry
 * @returns {Object} Objekt s výsledkami hry
 */
function calculateGameResults() {
    const results = {
        totalTime: gameTime,
        totalAttempts: gameAttempts,
        matchedPairs: matchedPairs,
        totalPairs: totalPairs,
        correctSpeechCount: correctSpeechCount,
        completionPercentage: Math.round((matchedPairs / totalPairs) * 100),
        stars: 0,
        isTimeOut: false,
        isVictory: matchedPairs >= totalPairs
    };
    
    // Výpočet hviezd (podobne ako v game.js)
    if (results.isVictory) {
        results.stars = calculateStars(results);
    }
    
    return results;
}

/**
 * Výpočet počtu hviezd na základe výkonu
 * @param {Object} results - Výsledky hry
 * @returns {number} Počet hviezd (0-3)
 */
function calculateStars(results) {
    let stars = 1; // Základná hviezda za dokončenie
    
    // Druhá hviezda - za rychlost alebo správne reč
    if (currentLevel.timeLimit) {
        // Ak existuje časový limit, hodnotíme podľa času
        const timeRatio = results.totalTime / currentLevel.timeLimit;
        if (timeRatio <= 0.7) stars = 2; // 70% času alebo menej
        if (timeRatio <= 0.5) stars = 3; // 50% času alebo menej
    } else {
        // Bez časového limitu hodnotíme podľa rečových cvičení
        const speechRatio = results.correctSpeechCount / results.matchedPairs;
        if (speechRatio >= 0.7) stars = 2; // 70% správnych reči
        if (speechRatio >= 0.9) stars = 3; // 90% správnych reči
    }
    
    return stars;
}

/**
 * Uloženie herného pokroku
 * @param {Object} results - Výsledky hry
 */
function saveGameProgress(results) {
    if (typeof window.progressManager === 'undefined') {
        console.warn('⚠️ Progress manager nie je dostupný');
        return;
    }
    
    try {
        window.progressManager.saveLevelProgress(
            currentLevel.worldId,
            currentLevel.id,
            results.stars,
            {
                time: results.totalTime,
                attempts: results.totalAttempts,
                speechCorrect: results.correctSpeechCount,
                completion: results.completionPercentage
            }
        );
        
        console.log('✅ Progress uložený');
    } catch (error) {
        console.error('❌ Chyba pri ukladaní progress:', error);
    }
}

/**
 * Zobrazenie end game modalu s výsledkami
 * @param {Object} results - Výsledky hry
 */
function showEndGameModal(results) {
    const modal = document.getElementById('endgame');
    if (!modal) {
        console.error('❌ End game modal nenájdený!');
        return;
    }
    
    // Aktualizácia obsahu modalu
    updateEndGameModalContent(results);
    
    // Zobrazenie modalu
    modal.style.display = 'block';
    
    // Nastavenie event listenerov pre tlačidlá
    setupEndGameButtons();
}

/**
 * Aktualizácia obsahu end game modalu
 * @param {Object} results - Výsledky hry
 */
function updateEndGameModalContent(results) {
    // Aktualizácia času
    const timeSpan = document.querySelector('#endgame .stats div:first-child span');
    if (timeSpan) {
        const minutes = Math.floor(results.totalTime / 60);
        const seconds = results.totalTime % 60;
        timeSpan.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Aktualizácia slov (správne/nesprávne)
    const wordsStats = document.querySelector('#endgame .stats div:nth-child(2)');
    if (wordsStats) {
        const correctSpan = wordsStats.querySelector('span:first-child');
        const incorrectSpan = wordsStats.querySelector('span:nth-child(3)');
        
        if (correctSpan) correctSpan.textContent = results.correctSpeechCount.toString();
        if (incorrectSpan) incorrectSpan.textContent = (results.matchedPairs - results.correctSpeechCount).toString();
    }
    
    // Aktualizácia hviezd
    updateModalStars(results.stars);
}

/**
 * Aktualizácia hviezd v modali
 * @param {number} starsCount - Počet hviezd
 */
function updateModalStars(starsCount) {
    const starsContainer = document.getElementById('modal-stars');
    if (!starsContainer) return;
    
    starsContainer.innerHTML = '';
    
    for (let i = 1; i <= 3; i++) {
        const star = document.createElement('img');
        star.src = i <= starsCount ? 'images/star_active.png' : 'images/star_inactive.png';
        star.alt = i <= starsCount ? 'Aktívna hviezda' : 'Neaktívna hviezda';
        starsContainer.appendChild(star);
    }
}

/**
 * Nastavenie event listenerov pre tlačidlá v end game modali
 */
function setupEndGameButtons() {
    // Tlačidlo "Hrať znova"
    const restartBtn = document.querySelector('#endgame button[onclick="restartCurrentLevel()"]');
    if (restartBtn) {
        restartBtn.onclick = restartCurrentLevel;
    }
    
    // Tlačidlo "Ďalší level"
    const nextBtn = document.querySelector('#endgame button[onclick="goToNextLevel()"]');
    if (nextBtn) {
        nextBtn.onclick = goToNextLevel;
    }
    
    // Tlačidlo "Späť do menu"
    const menuBtn = document.querySelector('#endgame button[onclick="returnToMenu()"]');
    if (menuBtn) {
        menuBtn.onclick = returnToMenu;
    }
}

// ==========================================
// NAVIGAČNÉ FUNKCIE
// ==========================================

/**
 * Reštart aktuálneho levelu
 */
function restartCurrentLevel() {
    console.log('🔄 Reštartujem level...');
    
    // Skrytie end game modalu
    const modal = document.getElementById('endgame');
    if (modal) modal.style.display = 'none';
    
    // Reštart hry
    initGame();
}

/**
 * Prechod na ďalší level
 */
function goToNextLevel() {
    console.log('➡️ Prechod na ďalší level...');
    
    // Pre custom hry alebo demo - reštart
    if (currentLevel.id === 'custom' || currentLevel.id === 'demo') {
        restartCurrentLevel();
        return;
    }
    
    // Hľadanie ďalšieho levelu
    if (typeof getNextLevel === 'function') {
        const nextLevel = getNextLevel(currentLevel.id);
        if (nextLevel) {
            window.location.href = `pexeso.html?worldId=${nextLevel.worldId}&levelId=${nextLevel.id}`;
        } else {
            // Žiadny ďalší level - návrat do menu
            returnToMenu();
        }
    } else {
        returnToMenu();
    }
}

/**
 * Návrat do hlavného menu
 */
function returnToMenu() {
    console.log('🏠 Návrat do menu...');
    
    if (currentLevel.id === 'custom') {
        // Pre custom hry návrat na index
        window.location.href = 'index.html';
    } else {
        // Pre level hry návrat na worlds menu
        window.location.href = 'worldsmenu.html';
    }
}

// ==========================================
// EVENT LISTENERY A UTILITY FUNKCIE
// ==========================================

/**
 * Nastavenie globálnych event listenerov
 */
function setupEventListeners() {
    // Tlačidlo menu (pauza)
    const menuButton = document.getElementById('menuButton');
    if (menuButton) {
        menuButton.addEventListener('click', openPauseMenu);
    }
    
    // Klávesové skratky (voliteľné)
    document.addEventListener('keydown', handleKeyPress);
    
    console.log('✅ Event listenery nastavené');
}

/**
 * Otvorenie pauza menu
 */
function openPauseMenu() {
    console.log('⏸️ Otváram pauza menu...');
    
    // Pozastavenie časovača
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Zobrazenie dialógového okna
    const dialog = document.getElementById('dialogove-okno');
    const blurBg = document.getElementById('blur-background');
    
    if (dialog) dialog.style.display = 'block';
    if (blurBg) blurBg.style.display = 'block';
    
    document.body.classList.add('dialog-open');
    document.body.style.overflow = 'hidden';
}

/**
 * Zatvorenie pauza menu
 */
function closePauseMenu() {
    console.log('▶️ Zatváram pauza menu...');
    
    // Obnovenie časovača
    startGameTimer();
    
    // Skrytie dialógového okna
    const dialog = document.getElementById('dialogove-okno');
    const blurBg = document.getElementById('blur-background');
    
    if (dialog) dialog.style.display = 'none';
    if (blurBg) blurBg.style.display = 'none';
    
    document.body.classList.remove('dialog-open');
    document.body.style.overflow = 'auto';
}

/**
 * Spracovanie klávesových skratiek
 * @param {KeyboardEvent} event - Event klávesy
 */
function handleKeyPress(event) {
    switch (event.key) {
        case 'Escape':
            openPauseMenu();
            break;
        case 'r':
        case 'R':
            if (event.ctrlKey) {
                event.preventDefault();
                restartCurrentLevel();
            }
            break;
    }
}

/**
 * Zamichanie poľa (Fisher-Yates algoritmus)
 * @param {Array} array - Pole na zamichanie
 * @returns {Array} Zamichané pole
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Zobrazenie chybovej správy
 * @param {string} message - Chybová správa
 */
function showErrorMessage(message) {
    console.error(`❌ ${message}`);
    
    // Jednoduché zobrazenie cez alert (môže sa nahradiť vlastným modalom)
    alert(message);
}

// ==========================================
// GLOBÁLNE FUNKCIE PRE HTML ONCLICK
// ==========================================

/**
 * Globálne funkcie pre onclick v HTML
 * Tieto funkcie sú dostupné z HTML súborov
 */
window.openDialog1 = openPauseMenu;
window.closeDialog1 = closePauseMenu;
window.restartCurrentLevel = restartCurrentLevel;
window.goToNextLevel = goToNextLevel;
window.returnToMenu = returnToMenu;

// ==========================================
// KONIEC SÚBORU
// ==========================================

console.log('📋 pexeso.js načítaný - verzia 2.0');