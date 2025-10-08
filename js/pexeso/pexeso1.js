/**
 * Pexeso hra s integráciou do level systému
 * Obsahuje rečové cvičenia, systém hodnotenia a navigáciu
 * Autor: Adam Reňak
 */

// ===============================================
// GLOBÁLNE PREMENNÉ PRE PEXESO HRU
// ===============================================

let currentLevelConfig = null; // Konfigurácia aktuálneho levelu
let isCustomLevel = false; // Či je to custom level

// Herné premenné
let gameCards = []; // Pole všetkých kariet v hre
let flippedCards = []; // Aktuálne otočené karty (max 2)
let matchedPairs = 0; // Počet nájdených párov
let totalPairs = 0; // Celkový počet párov v hre
let gameAttempts = 0; // Počet pokusov
let gameStartTime = null; // Čas začatku hry
let gameTimer = null; // Timer pre hru
let currentTime = 0; // Aktuálny čas v sekundách

// Hráči
let players = []; // Pole hráčov
let currentPlayer = 0; // Index aktuálneho hráča

// Rečové cvičenie
let speechRecognition = null; // Web Speech API
let isListening = false; // Či práve počúvame
let currentWord = ''; // Aktuálne slovo na vyslovenie
let speechAttempts = 0; // Počet pokusov pre rečové cvičenie
let maxSpeechAttempts = 3; // Maximálny počet pokusov

// Audio elementy
let sounds = {
    cardFlip: null,
    correct: null,
    wrong: null,
    victory: null
};

// ===============================================
// INICIALIZÁCIA HRY
// ===============================================

/**
 * Hlavná inicializačná funkcia
 * Spúšťa sa pri načítaní stránky
 */
function initializePexesoGame() {
    console.log('Inicializujem pexeso hru...');
    
    // Načítaj level konfiguráciu z URL
    loadLevelFromURL();
    
    // Inicializuj audio
    initializeAudio();
    
    // Inicializuj rečové rozpoznávanie
    initializeSpeechRecognition();
    
    // Nastav pozadie sveta
    setWorldBackground();
    
    // Skry loading screen
    hideLoadingScreen();
    
    // Spusti hru
    startGame();
}

/**
 * Načítanie level konfigurácie z URL parametrov
 */
function loadLevelFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const worldId = urlParams.get('worldId');
    const levelId = urlParams.get('levelId');
    const training = urlParams.get('training') === 'true';
    
    console.log('URL parametre:', { worldId, levelId, training });
    
    if (training) {
        // Pre tréningové levely - zatiaľ základná konfigurácia
        isCustomLevel = true;
        currentLevelConfig = {
            id: 'training_pexeso',
            worldId: worldId || 'world_r',
            name: 'Tréningové pexeso',
            gameType: 'pexeso',
            words: ['rak', 'ryba', 'ruka', 'ruža'],
            gameConfig: {
                pairs: 4,
                timeLimit: null
            }
        };
    } else if (levelId && window.getLevelConfig) {
        // Načítaj konfiguráciu z levels.js
        currentLevelConfig = window.getLevelConfig(levelId);
        isCustomLevel = false;
    } else {
        // Predvolená konfigurácia
        console.warn('Žiadna level konfigurácia, používam predvolenú');
        currentLevelConfig = {
            id: 'default_pexeso',
            worldId: 'world_r',
            name: 'Základné pexeso',
            gameType: 'pexeso',
            words: ['rak', 'ryba', 'ruka', 'ruža'],
            gameConfig: {
                pairs: 4,
                timeLimit: null
            }
        };
        isCustomLevel = true;
    }
    
    console.log('Načítaná level konfigurácia:', currentLevelConfig);
}

/**
 * Nastavenie pozadia sveta
 */
function setWorldBackground() {
    const gameCanvas = document.getElementById('gameCanvas');
    if (!gameCanvas || !currentLevelConfig) return;
    
    const worldId = currentLevelConfig.worldId;
    
    // Mapa pozadí pre jednotlivé svety
    const worldBackgrounds = {
        'world_z': '../images/worlds/world_z.jpg',
        'world_s': '../images/worlds/world_s.png',
        'world_r': '../images/worlds/world_r.png',
        'world_l': '../images/worlds/world_l.png',
        'world_c': '../images/worlds/world_c.png',
        'world_š': '../images/worlds/world_sh.png',
        'world_ž': '../images/worlds/world_zh.png',
        'world_č': '../images/worlds/world_ch.png',
        'world_d': '../images/worlds/world_d.png',
        'world_t': '../images/worlds/world_t.png',
        'world_n': '../images/worlds/world_n.png',
        'world_k': '../images/worlds/world_k.png',
        'world_g': '../images/worlds/world_g.png'
    };
    
    const backgroundImage = worldBackgrounds[worldId] || '../images/pozadie.jpg';
    gameCanvas.style.backgroundImage = `url('${backgroundImage}')`;
    
    console.log(`Nastavené pozadie pre svet ${worldId}: ${backgroundImage}`);
}

/**
 * Inicializácia audio elementov
 */
function initializeAudio() {
    sounds.cardFlip = document.getElementById('cardFlipSound') || new Audio('zvuky/effects/kopanie.wav');
    sounds.correct = document.getElementById('correctSound') || new Audio('zvuky/effects/spravne.mp3');
    sounds.wrong = document.getElementById('wrongSound') || new Audio('zvuky/effects/zle.mp3');
    sounds.victory = document.getElementById('victorySound') || new Audio('zvuky/effects/vyhra.mp3');
    
    // Nastav hlasitosť
    Object.values(sounds).forEach(sound => {
        if (sound) sound.volume = 0.7;
    });
}

/**
 * Skrytie loading screen
 */
function hideLoadingScreen() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 1500);
}

// ===============================================
// SPUSTENIE HRY
// ===============================================

/**
 * Spustenie novej hry
 */
function startGame() {
    console.log('Spúšťam novú hru pexesa...');
    
    if (!currentLevelConfig) {
        console.error('Žiadna level konfigurácia!');
        return;
    }
    
    // Reset herných premenných
    resetGameVariables();
    
    // Inicializuj hráčov
    initializePlayers();
    
    // Vytvor karty
    createGameCards();
    
    // Vygeneruj karty na obrazovke
    generateCardsHTML();
    
    // Spusti časomeru
    startGameTimer();
    
    console.log('Hra spustená!');
}

/**
 * Reset herných premenných
 */
function resetGameVariables() {
    gameCards = [];
    flippedCards = [];
    matchedPairs = 0;
    gameAttempts = 0;
    currentTime = 0;
    currentPlayer = 0;
    
    // Aktualizuj UI
    updateAttemptsDisplay();
    updateTimeDisplay();
}

/**
 * Inicializácia hráčov
 */
function initializePlayers() {
    // Pre teraz jeden hráč, neskôr môžeme pridať multiplayer
    players = [
        { name: 'Hráč', score: 0, color: 'player-1' }
    ];
    
    // Aktualizuj UI hráčov
    updatePlayersDisplay();
}

/**
 * Vytvorenie kariet pre hru
 */
function createGameCards() {
    const words = currentLevelConfig.words;
    const pairsCount = currentLevelConfig.gameConfig.pairs || Math.min(words.length, 8);
    
    // Vyber slová pre hru
    const selectedWords = words.slice(0, pairsCount);
    totalPairs = selectedWords.length;
    
    // Vytvor páry kariet
    gameCards = [];
    selectedWords.forEach((word, index) => {
        // Prvá karta páru
        gameCards.push({
            id: `card_${index}_1`,
            word: word,
            image: `images/slova/${word}.png`,
            pairId: index,
            isFlipped: false,
            isMatched: false
        });
        
        // Druhá karta páru
        gameCards.push({
            id: `card_${index}_2`,
            word: word,
            image: `images/slova/${word}.png`,
            pairId: index,
            isFlipped: false,
            isMatched: false
        });
    });
    
    // Zamiešaj karty
    shuffleArray(gameCards);
    
    console.log(`Vytvorených ${gameCards.length} kariet (${totalPairs} párov)`);
}

/**
 * Zamiešanie poľa
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Generovanie HTML pre karty
 */
function generateCardsHTML() {
    const gameCanvas = document.getElementById('gameCanvas');
    if (!gameCanvas) return;
    
    // Nastav CSS triedu pre responzívnosť
    const cardCount = gameCards.length;
    gameCanvas.className = `cards-${cardCount}`;
    
    // Vymaž existujúci obsah
    gameCanvas.innerHTML = '';
    
    // Vygeneruj karty
    gameCards.forEach((card, index) => {
        const cardElement = createCardElement(card, index);
        gameCanvas.appendChild(cardElement);
    });
    
    console.log(`Vygenerovaných ${gameCards.length} kariet v HTML`);
}

/**
 * Vytvorenie HTML elementu karty
 */
function createCardElement(card, index) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card-container';
    cardDiv.dataset.cardId = card.id;
    cardDiv.dataset.cardIndex = index;
    
    // Obrázok (skrytý na začiatku)
    const img = document.createElement('img');
    img.src = card.image;
    img.alt = card.word;
    img.style.display = 'none';
    
    // Text
    const span = document.createElement('span');
    span.textContent = 'PEXESO';
    
    cardDiv.appendChild(img);
    cardDiv.appendChild(span);
    
    // Event listener pre kliknutie
    cardDiv.addEventListener('click', () => handleCardClick(index));
    
    return cardDiv;
}

// ===============================================
// LOGIKA KARIET
// ===============================================

/**
 * Spracovanie kliknutia na kartu
 */
function handleCardClick(cardIndex) {
    const card = gameCards[cardIndex];
    const cardElement = document.querySelector(`[data-card-index="${cardIndex}"]`);
    
    // Kontroly - karta už otočená, matchovaná alebo príliš veľa otočených kariet
    if (card.isFlipped || card.isMatched || flippedCards.length >= 2) {
        return;
    }
    
    console.log(`Kliknutie na kartu: ${card.word}`);
    
    // Otočenie karty
    flipCard(cardIndex, cardElement);
    
    // Pridaj do otočených kariet
    flippedCards.push({ index: cardIndex, card: card, element: cardElement });
    
    // Ak sú otočené 2 karty, skontroluj pár
    if (flippedCards.length === 2) {
        gameAttempts++;
        updateAttemptsDisplay();
        
        setTimeout(() => {
            checkForMatch();
        }, 1000);
    }
}

/**
 * Otočenie karty
 */
function flipCard(cardIndex, cardElement) {
    const card = gameCards[cardIndex];
    
    // Nastav stav karty
    card.isFlipped = true;
    
    // Vizuálne otočenie
    cardElement.classList.add('flipped');
    
    // Zobraz obrázok a aktualizuj text
    const img = cardElement.querySelector('img');
    const span = cardElement.querySelector('span');
    
    if (img) img.style.display = 'block';
    if (span) span.textContent = card.word;
    
    // Zahraj zvuk
    if (sounds.cardFlip) {
        sounds.cardFlip.play().catch(e => console.log('Audio chyba:', e));
    }
    
    console.log(`Karta otočená: ${card.word}`);
}

/**
 * Kontrola páru
 */
function checkForMatch() {
    if (flippedCards.length !== 2) return;
    
    const [first, second] = flippedCards;
    const isMatch = first.card.pairId === second.card.pairId;
    
    console.log(`Kontrola páru: ${first.card.word} vs ${second.card.word} = ${isMatch ? 'MATCH' : 'NO MATCH'}`);
    
    if (isMatch) {
        handleSuccessfulMatch(first, second);
    } else {
        handleFailedMatch(first, second);
    }
    
    // Vymaž otočené karty
    flippedCards = [];
}

/**
 * Spracovanie úspešného páru
 */
function handleSuccessfulMatch(first, second) {
    console.log('Úspešný pár!');
    
    // Označenie kariet ako matchované
    first.card.isMatched = true;
    second.card.isMatched = true;
    
    first.element.classList.add('matched');
    second.element.classList.add('matched');
    
    // Aktualizuj skóre
    players[currentPlayer].score++;
    updatePlayersDisplay();
    
    matchedPairs++;
    
    // Zahraj úspešný zvuk
    if (sounds.correct) {
        sounds.correct.play().catch(e => console.log('Audio chyba:', e));
    }
    
    // Spusti rečové cvičenie
    startSpeechExercise(first.card.word);
}

/**
 * Spracovanie neúspešného páru
 */
function handleFailedMatch(first, second) {
    console.log('Neúspešný pár!');
    
    // Otočenie kariet späť
    setTimeout(() => {
        flipCardBack(first.index, first.element);
        flipCardBack(second.index, second.element);
    }, 500);
    
    // Zahraj neúspešný zvuk
    if (sounds.wrong) {
        sounds.wrong.play().catch(e => console.log('Audio chyba:', e));
    }
}

/**
 * Otočenie karty späť
 */
function flipCardBack(cardIndex, cardElement) {
    const card = gameCards[cardIndex];
    
    // Nastav stav karty
    card.isFlipped = false;
    
    // Vizuálne otočenie späť
    cardElement.classList.remove('flipped');
    
    // Skry obrázok a obnov text
    const img = cardElement.querySelector('img');
    const span = cardElement.querySelector('span');
    
    if (img) img.style.display = 'none';
    if (span) span.textContent = 'PEXESO';
    
    console.log(`Karta otočená späť: ${card.word}`);
}

// ===============================================
// REČOVÉ CVIČENIE
// ===============================================

/**
 * Spustenie rečového cvičenia
 */
function startSpeechExercise(word) {
    console.log(`Spúšťam rečové cvičenie pre slovo: ${word}`);
    
    currentWord = word;
    speechAttempts = 0;
    
    // Zobraz modal
    showSpeechModal(word);
}

/**
 * Zobrazenie modalu pre rečové cvičenie
 */
function showSpeechModal(word) {
    const modal = document.getElementById('cvicenie');
    const wordDisplay = document.getElementById('word-display');
    const wordImage = document.getElementById('cvicenie-image');
    
    if (modal) {
        // Nastav slovo a obrázok
        if (wordDisplay) wordDisplay.textContent = word.toUpperCase();
        if (wordImage) {
            wordImage.src = `images/slova/${word}.png`;
            wordImage.alt = word;
        }
        
        modal.style.display = 'block';
        modal.classList.add('modal-open');
        
        console.log(`Modal zobrazený pre slovo: ${word}`);
    }
}

/**
 * Inicializácia rečového rozpoznávania
 */
function initializeSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn('Rečové rozpoznávanie nie je podporované v tomto prehliadači');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    speechRecognition = new SpeechRecognition();
    
    speechRecognition.lang = 'sk-SK';
    speechRecognition.continuous = false;
    speechRecognition.interimResults = false;
    speechRecognition.maxAlternatives = 3;
    
    speechRecognition.onstart = function() {
        console.log('Rečové rozpoznávanie spustené');
        isListening = true;
        updateSpeechButton();
    };
    
    speechRecognition.onresult = function(event) {
        console.log('Výsledok rečového rozpoznávania:', event);
        
        const result = event.results[0][0].transcript.toLowerCase().trim();
        const confidence = event.results[0][0].confidence;
        
        console.log(`Rozpoznané: "${result}" (spoľahlivosť: ${confidence})`);
        
        processSpeechResult(result, confidence);
    };
    
    speechRecognition.onerror = function(event) {
        console.error('Chyba rečového rozpoznávania:', event.error);
        isListening = false;
        updateSpeechButton();
        showSpeechError(event.error);
    };
    
    speechRecognition.onend = function() {
        console.log('Rečové rozpoznávanie ukončené');
        isListening = false;
        updateSpeechButton();
    };
    
    // Event listener pre tlačidlo mikrofónu
    const micButton = document.getElementById('rozpoznanie');
    if (micButton) {
        micButton.addEventListener('click', toggleSpeechRecognition);
    }
}

/**
 * Zapnutie/vypnutie rečového rozpoznávania
 */
function toggleSpeechRecognition() {
    if (!speechRecognition) {
        console.warn('Rečové rozpoznávanie nie je dostupné');
        return;
    }
    
    if (isListening) {
        speechRecognition.stop();
    } else {
        speechAttempts++;
        speechRecognition.start();
    }
}

/**
 * Aktualizácia tlačidla mikrofónu
 */
function updateSpeechButton() {
    const button = document.getElementById('rozpoznanie');
    const buttonContainer = button?.parentElement;
    const buttonText = button?.querySelector('a');
    
    if (!button || !buttonContainer || !buttonText) return;
    
    if (isListening) {
        buttonContainer.classList.add('recording');
        buttonText.textContent = 'POČÚVAM...';
    } else {
        buttonContainer.classList.remove('recording');
        buttonText.textContent = 'HOVORIŤ';
    }
}

/**
 * Spracovanie výsledku rečového rozpoznávania
 */
function processSpeechResult(recognized, confidence) {
    const targetWord = currentWord.toLowerCase();
    const isCorrect = recognized.includes(targetWord) || 
                     targetWord.includes(recognized) ||
                     calculateSimilarity(recognized, targetWord) > 0.7;
    
    console.log(`Porovnanie: "${recognized}" vs "${targetWord}" = ${isCorrect ? 'SPRÁVNE' : 'NESPRÁVNE'}`);
    
    if (isCorrect || confidence > 0.8) {
        handleSpeechSuccess();
    } else {
        handleSpeechFailure();
    }
}

/**
 * Spracovanie úspešného rečového cvičenia
 */
function handleSpeechSuccess() {
    console.log('Rečové cvičenie úspešné!');
    
    showSpeechResult(true, 'Výborne! Správne si vyslovil slovo.');
    
    setTimeout(() => {
        closeSpeechModal();
        checkGameEnd();
    }, 2000);
}

/**
 * Spracovanie neúspešného rečového cvičenia
 */
function handleSpeechFailure() {
    console.log('Rečové cvičenie neúspešné');
    
    if (speechAttempts >= maxSpeechAttempts) {
        showSpeechResult(false, 'Skús to ešte raz neskôr.');
        setTimeout(() => {
            closeSpeechModal();
            checkGameEnd();
        }, 2000);
    } else {
        const remainingAttempts = maxSpeechAttempts - speechAttempts;
        showSpeechResult(false, `Skús to znova. Zostáva ti ${remainingAttempts} pokusov.`);
    }
}

/**
 * Zobrazenie výsledku rečového cvičenia
 */
function showSpeechResult(success, message) {
    const resultDiv = document.getElementById('vysledok');
    if (!resultDiv) return;
    
    const imageSrc = success ? 'images/spravne.png' : 'images/nespravne.png';
    
    resultDiv.innerHTML = `
        <center>
            <img src="${imageSrc}" alt="${success ? 'Správne' : 'Nesprávne'}">
            <div class="attempt-message" style="color: white; font-size: 20px; margin-top: 10px;">
                ${message}
            </div>
        </center>
    `;
    
    resultDiv.classList.add('show');
    
    // Skry výsledok po chvíli
    setTimeout(() => {
        resultDiv.classList.remove('show');
    }, 1500);
}

/**
 * Zatvorenie modalu rečového cvičenia
 */
function closeSpeechModal() {
    const modal = document.getElementById('cvicenie');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('modal-open');
    }
}

/**
 * Zobrazenie chyby rečového rozpoznávania
 */
function showSpeechError(error) {
    let message = 'Chyba rečového rozpoznávania';
    
    switch (error) {
        case 'not-allowed':
            message = 'Prístup k mikrofónu je zakázaný';
            break;
        case 'no-speech':
            message = 'Nebola rozpoznaná žiadna reč';
            break;
        case 'audio-capture':
            message = 'Problém s mikrofónom';
            break;
        case 'network':
            message = 'Problém so sieťou';
            break;
    }
    
    showSpeechResult(false, message);
}

// ===============================================
// ČASOMIERA A UI AKTUALIZÁCIE
// ===============================================

/**
 * Spustenie časomiery
 */
function startGameTimer() {
    gameStartTime = Date.now();
    
    gameTimer = setInterval(() => {
        currentTime = Math.floor((Date.now() - gameStartTime) / 1000);
        updateTimeDisplay();
        
        // Kontrola časového limitu
        const timeLimit = currentLevelConfig?.timeLimit;
        if (timeLimit && currentTime >= timeLimit) {
            handleTimeUp();
        }
    }, 1000);
}

/**
 * Zastavenie časomiery
 */
function stopGameTimer() {
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
}

/**
 * Aktualizácia zobrazenia času
 */
function updateTimeDisplay() {
    const timeElement = document.getElementById('game-time');
    if (timeElement) {
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;
        timeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

/**
 * Aktualizácia zobrazenia pokusov
 */
function updateAttemptsDisplay() {
    const attemptsElement = document.getElementById('game-attempts');
    if (attemptsElement) {
        attemptsElement.textContent = gameAttempts.toString();
    }
}

/**
 * Aktualizácia zobrazenia hráčov
 */
function updatePlayersDisplay() {
    // Pre teraz len jeden hráč - neskôr rozšíriť pre multiplayer
    const playerElements = document.querySelectorAll('.players-panel');
    
    playerElements.forEach((element, index) => {
        if (index < players.length) {
            const player = players[index];
            const nameElement = element.querySelector('.name h1');
            const scoreElement = element.querySelector('.score span');
            
            if (nameElement) nameElement.textContent = player.name;
            if (scoreElement) scoreElement.textContent = player.score;
            
            element.style.display = 'flex';
        } else {
            element.style.display = 'none';
        }
    });
}

// ===============================================
// KONIEC HRY A HODNOTENIE
// ===============================================

/**
 * Kontrola konca hry
 */
function checkGameEnd() {
    console.log(`Nájdené páry: ${matchedPairs}/${totalPairs}`);
    
    if (matchedPairs >= totalPairs) {
        endGame();
    }
}

/**
 * Ukončenie hry
 */
function endGame() {
    console.log('Hra ukončená!');
    
    // Zastav časomieru
    stopGameTimer();
    
    // Zahraj víťazný zvuk
    if (sounds.victory) {
        sounds.victory.play().catch(e => console.log('Audio chyba:', e));
    }
    
    // Vypočítaj hodnotenie
    const stars = calculateStars();
    
    // Ulož pokrok ak nie je custom level
    if (!isCustomLevel && currentLevelConfig) {
        saveGameProgress(stars, currentTime);
    }
    
    // Zobraz konečný modal
    showEndGameModal(stars);
}

/**
 * Výpočet hviezd na základe výkonu
 */
function calculateStars() {
    const timeLimit = currentLevelConfig?.timeLimit;
    const targetAttempts = totalPairs * 1.5; // Ideálny počet pokusov
    
    let stars = 1; // Minimálne 1 hviezda za dokončenie
    
    // Hodnotenie na základe pokusov
    if (gameAttempts <= targetAttempts) {
        stars = 3; // Perfektný výkon
    } else if (gameAttempts <= targetAttempts * 1.3) {
        stars = 2; // Dobrý výkon
    }
    
    // Ak je časový limit, zohľadni čas
    if (timeLimit) {
        const timePercentage = currentTime / timeLimit;
        if (timePercentage > 0.9) {
            stars = Math.max(1, stars - 1); // Zníženie za pomalý čas
        }
    }
    
    console.log(`Hodnotenie: ${stars} hviezd (pokusy: ${gameAttempts}/${targetAttempts}, čas: ${currentTime}s)`);
    return Math.max(1, Math.min(3, stars));
}

/**
 * Uloženie pokroku hry
 */
function saveGameProgress(stars, time) {
    if (!window.progressManager || !currentLevelConfig) return;
    
    try {
        window.progressManager.saveLevelProgress(
            currentLevelConfig.worldId,
            currentLevelConfig.id,
            {
                stars: stars,
                time: time,
                attempts: gameAttempts,
                completed: true,
                timestamp: Date.now()
            }
        );
        console.log('Pokrok uložený');
    } catch (error) {
        console.error('Chyba pri ukladaní pokroku:', error);
    }
}

/**
 * Zobrazenie konečného modalu
 */
function showEndGameModal(stars) {
    const modal = document.getElementById('endgame');
    if (!modal) return;
    
    // Aktualizuj štatistiky
    updateEndGameStats(stars);
    
    // Zobraz modal
    modal.style.display = 'block';
    
    console.log('Konečný modal zobrazený');
}

/**
 * Aktualizácia štatistík v konečnom modali
 */
function updateEndGameStats(stars) {
    // Čas
    const timeElements = document.querySelectorAll('#endgame .stats span');
    if (timeElements.length > 0) {
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;
        timeElements[0].textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Správne/nesprávne pokusy
    if (timeElements.length > 1) {
        timeElements[1].textContent = matchedPairs;
    }
    if (timeElements.length > 3) {
        timeElements[3].textContent = gameAttempts - matchedPairs;
    }
    
    // Hviezdy
    updateStarsDisplay(stars);
}

/**
 * Aktualizácia zobrazenia hviezd
 */
function updateStarsDisplay(stars) {
    const starsContainer = document.getElementById('modal-stars');
    if (!starsContainer) return;
    
    starsContainer.innerHTML = '';
    
    for (let i = 1; i <= 3; i++) {
        const star = document.createElement('img');
        star.src = i <= stars ? 'images/star.png' : 'images/star_empty.png';
        star.alt = i <= stars ? 'Hviezda' : 'Prázdna hviezda';
        starsContainer.appendChild(star);
    }
    
    console.log(`Zobrazených ${stars} hviezd`);
}

/**
 * Spracovanie vypršania času
 */
function handleTimeUp() {
    console.log('Čas vypršal!');
    
    stopGameTimer();
    
    // Zobraz správu o vypršaní času
    alert('Čas vypršal! Hra je ukončená.');
    
    // Ukončenie hry s minimálnym hodnotením
    const stars = 1;
    
    if (!isCustomLevel && currentLevelConfig) {
        saveGameProgress(stars, currentTime);
    }
    
    showEndGameModal(stars);
}

// ===============================================
// NAVIGAČNÉ FUNKCIE
// ===============================================

/**
 * Reštart aktuálneho levelu
 */
function restartCurrentLevel() {
    console.log('Reštartujem aktuálny level...');
    
    // Zatvor modály
    closeAllModals();
    
    // Reštartuj hru
    startGame();
}

/**
 * Prechod na ďalší level
 */
function goToNextLevel() {
    console.log('Pokúšam sa prejsť na ďalší level...');
    
    // Pokús sa použiť gameRouter
    if (window.gameRouter && typeof window.gameRouter.continueToNextLevel === 'function') {
        window.gameRouter.continueToNextLevel();
    } else {
        // Fallback - návrat do menu
        console.log('GameRouter nie je dostupný, vraciam sa do menu');
        returnToMenu();
    }
}

/**
 * Návrat do menu svetov
 */
function returnToMenu() {
    console.log('Návrat do menu svetov...');
    
    // Pokús sa použiť gameRouter
    if (window.gameRouter && typeof window.gameRouter.returnToLevelSelector === 'function') {
        const worldId = currentLevelConfig?.worldId;
        if (worldId) {
            window.gameRouter.returnToLevelSelector(worldId);
        } else {
            window.location.href = 'worldsmenu.html';
        }
    } else {
        // Fallback - priama navigácia
        window.location.href = 'worldsmenu.html';
    }
}

/**
 * Zatvorenie všetkých modálov
 */
function closeAllModals() {
    const modals = ['cvicenie', 'zvuky', 'endgame', 'dialogove-okno'];
    
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('modal-open');
        }
    });
    
    // Skry blur background
    const blurBg = document.getElementById('blur-background');
    if (blurBg) {
        blurBg.style.display = 'none';
    }
    
    console.log('Všetky modály zatvorené');
}

// ===============================================
// POMOCNÉ FUNKCIE
// ===============================================

/**
 * Kontrola dostupnosti Web Speech API
 */
function isSpeechRecognitionSupported() {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

/**
 * Získanie náhodného elementu z poľa
 */
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Formátovanie času do MM:SS formátu
 */
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Debug funkcie pre testovanie
 */
window.pexesoDebug = {
    // Simulácia dokončenia hry
    finishGame: () => {
        matchedPairs = totalPairs;
        endGame();
    },
    
    // Zobrazenie všetkých kariet
    revealAllCards: () => {
        gameCards.forEach((card, index) => {
            if (!card.isMatched) {
                const cardElement = document.querySelector(`[data-card-index="${index}"]`);
                flipCard(index, cardElement);
            }
        });
    },
    
    // Reset hry
    resetGame: () => {
        stopGameTimer();
        startGame();
    },
    
    // Získanie informácií o hre
    getGameInfo: () => {
        return {
            levelConfig: currentLevelConfig,
            gameCards: gameCards,
            matchedPairs: matchedPairs,
            totalPairs: totalPairs,
            gameAttempts: gameAttempts,
            currentTime: currentTime,
            players: players
        };
    }
};

// ===============================================
// EVENT LISTENERY A INICIALIZÁCIA
// ===============================================

/**
 * Event listener pre načítanie stránky
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM načítaný, inicializujem pexeso...');
    
    // Malé oneskorenie pre načítanie všetkých skriptov
    setTimeout(() => {
        initializePexesoGame();
    }, 100);
});

/**
 * Event listener pre zatvorenie stránky
 */
window.addEventListener('beforeunload', function() {
    stopGameTimer();
});

/**
 * Globálne funkcie pre HTML
 */
window.restartCurrentLevel = restartCurrentLevel;
window.goToNextLevel = goToNextLevel;
window.returnToMenu = returnToMenu;

console.log('Pexeso.js načítaný a pripravený');

// ===============================================
// EXPORT PRE POUŽITIE V INÝCH SÚBOROCH
// ===============================================

// Export hlavných funkcií ak je potrebný
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializePexesoGame,
        startGame,
        restartCurrentLevel,
        goToNextLevel,
        returnToMenu
    };
}