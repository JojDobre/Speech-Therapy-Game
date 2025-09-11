    let allWords = {};
    let selectedCategory = null;
    let selectedWords = [];

    async function loadAllWords() {
        try {
            const response = await fetch('js/pexeso/words.json');
            allWords = await response.json();
            renderCategoryList();
            selectRandomLevel(); // Select "Náhodný level" by default
            preloadCustomLevelImages(); // Preload images for "Vlastný level"
        } catch (error) {
            console.error('Chyba pri načítání slov:', error);
        }
    }

    function renderCategoryList() {
        const wordList = document.getElementById('wordList');
        wordList.innerHTML = '';
        document.getElementById('wordCountContainer').style.display = 'none';

        // Přidání tlačítka pro náhodný level
        const randomLevelButton = document.createElement('button');
        randomLevelButton.textContent = 'Základný level';
        randomLevelButton.classList.add('category-button');
        randomLevelButton.dataset.category = 'random';
        randomLevelButton.addEventListener('click', selectCategory);
        wordList.appendChild(randomLevelButton);

        // Přidání tlačítek kategorií
        Object.keys(allWords).forEach(category => {
            const categoryButton = document.createElement('button');
            categoryButton.textContent = `Level ${category}`;
            categoryButton.classList.add('category-button');
            categoryButton.dataset.category = category;
            categoryButton.addEventListener('click', selectCategory);
            wordList.appendChild(categoryButton);
        });

        // Přidání tlačítka pro vlastní level
        const customLevelButton = document.createElement('button');
        customLevelButton.textContent = 'Vlastný level';
        customLevelButton.addEventListener('click', showAllWords);
        wordList.appendChild(customLevelButton);
    }

    function selectCategory(event) {
        // Odstraň zelené zvýraznění ze všech tlačítek
        document.querySelectorAll('.category-button').forEach(btn => {
            btn.style.backgroundColor = '';
        });

        // Zvýrazni vybrané tlačítko zeleně
        event.target.style.backgroundColor = 'lightgreen';

        // Ulož vybranou kategorii
        selectedCategory = event.target.dataset.category;
    }

    function selectRandomLevel() {
        const randomLevelButton = document.querySelector('button[data-category="random"]');
        if (randomLevelButton) {
            randomLevelButton.click();
        }
    }

    function preloadCustomLevelImages() {
        const allWordsFlat = Object.values(allWords).flat();
        allWordsFlat.forEach(word => {
            const img = new Image();
            img.src = word.src;
        });
    }

    function showRandomWords() {
        document.getElementById('wordCountContainer').style.display = 'none';
        const wordList = document.getElementById('wordList');
        wordList.innerHTML = '';

        // Sloučení všech slov z kategorií
        const allWordsFlat = Object.values(allWords).flat();

        // Náhodný výběr 15 slov
        const randomWords = getRandomWords(allWordsFlat, 15).map(word => ({
            ...word,
            selected: false
        }));

        randomWords.forEach((word, index) => {
            const wordItem = createWordItem(word, index);
            wordList.appendChild(wordItem);
        });

        const backButton = document.createElement('button');
        backButton.textContent = 'Naspäť';
        backButton.addEventListener('click', renderCategoryList);
        wordList.appendChild(backButton);
    }

    function showCategoryWords(category) {
        document.getElementById('wordCountContainer').style.display = 'none';
        selectedCategory = category;
        const wordList = document.getElementById('wordList');
        wordList.innerHTML = '';

        const words = allWords[category].map(word => ({ ...word, selected: false }));

        words.forEach((word, index) => {
            const wordItem = createWordItem(word, index);
            wordList.appendChild(wordItem);
        });

        const backButton = document.createElement('button');
        backButton.textContent = 'Naspäť';
        backButton.addEventListener('click', renderCategoryList);
        wordList.appendChild(backButton);
    }

    // Funkce pro náhodný výběr slov
    function getRandomWords(words, count) {
        // Pokud je požadovaný počet větší než počet dostupných slov, vrátí všechna slova
        if (count >= words.length) return words;

        // Náhodný výběr slov
        const shuffled = [...words].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function showAllWords() {
        selectedCategory = null;
        const wordList = document.getElementById('wordList');
        wordList.innerHTML = '';

        document.getElementById('wordCountContainer').style.display = 'block';

        const allWordsFlat = Object.values(allWords).flat().map(word => ({ ...word, selected: false }));
    allWordsFlat.forEach((word, index) => {
        const wordItem = createWordItem(word, index);
        wordList.appendChild(wordItem);
    });

    const backButton = document.createElement('button');
    backButton.textContent = 'Naspäť';
    backButton.addEventListener('click', () => {
        renderCategoryList();
        document.getElementById('wordCountContainer').style.display = 'none';
    });
    backButton.style.backgroundColor = '#ff4444';
    backButton.style.color = 'white';
    backButton.style.padding = '10px 20px';
    backButton.style.border = 'none';
    backButton.style.borderRadius = '5px';
    backButton.style.cursor = 'pointer';
    wordList.appendChild(backButton);
}

    function createWordItem(word, index) {
        const wordItem = document.createElement('div');
        wordItem.className = 'word-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `word-${index}`;
        checkbox.checked = word.selected;
        checkbox.addEventListener('change', () => toggleWordSelection(word));

        const img = document.createElement('img');
        img.src = word.src;
        img.alt = word.word;

        const label = document.createElement('label');
        label.htmlFor = `word-${index}`;
        label.textContent = word.word;

        wordItem.appendChild(checkbox);
        wordItem.appendChild(img);
        wordItem.appendChild(label);

        return wordItem;
    }

    function toggleWordSelection(word) {
        if (word.selected) {
            // Odstraň slovo ze selectedWords
            selectedWords = selectedWords.filter(w => w !== word);
            word.selected = false;
        } else {
            // Přidej slovo do selectedWords
            selectedWords.push(word);
            word.selected = true;
        }
        updateSelectedWordsCount();
    }

    function updateSelectedWordsCount() {
        document.getElementById('selectedWordsCount').textContent = selectedWords.length;
    }

    function startCustomGame() {
        const playerInputs = document.querySelectorAll('#playerInputs input');
        const players = Array.from(playerInputs)
            .filter(input => input.value.trim() !== '')
            .map(input => ({
                name: input.value,
                score: 0
            }));

        if (players.length < 1) {
            alert('Musíte zadať aspoň jedného hráča.');
            return;
        }

        let wordsToUse;
        if (selectedCategory) {
            if (selectedCategory === 'random') {
                // Náhodný level
                const allWordsFlat = Object.values(allWords).flat();
                wordsToUse = getRandomWords(allWordsFlat, 15);
            } else {
                // Náhodný výběr 15 slov z kategorie
                wordsToUse = getRandomWords(allWords[selectedCategory], 15);
            }
        } else {
            // Pro vlastní level použij vybrané slova
            if (selectedWords.length < 2) {
                alert('Vyberte aspoň 2 slová');
                return;
            }
            wordsToUse = selectedWords;
        }

        const customWordsParam = encodeURIComponent(JSON.stringify(wordsToUse));
        const playersParam = encodeURIComponent(JSON.stringify(players));

        window.location.href = `pexesocustom.html?custom=true&words=${customWordsParam}&players=${playersParam}`;
    }

    function openCustomLevel() {
        document.getElementById('customLevelModal').style.display = 'flex';
    }

    function closeCustomLevel() {
        document.getElementById('customLevelModal').style.display = 'none';
        selectedWords = [];
        updateSelectedWordsCount();

        // Zrušení výběru všech slov
        Object.values(allWords).flat().forEach(word => {
            word.selected = false;
        });
    }

    function addPlayer() {
        const playerInputs = document.getElementById('playerInputs');
        const playerCount = playerInputs.children.length;

        if (playerCount < 4) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `Hráč ${playerCount + 1}`;
            input.value = `Hráč ${playerCount + 1}`;
            playerInputs.appendChild(input);
        }
    }

    function removePlayer() {
        const playerInputs = document.getElementById('playerInputs');
        if (playerInputs.children.length > 1) {
            playerInputs.removeChild(playerInputs.lastChild);
        }
    }

    // Inicializace
    document.addEventListener('DOMContentLoaded', loadAllWords);