/* Výber náhodného slova */
const url = 'slova.txt'; // Upravte na skutočnú URL vášho API, ktoré poskytuje obsah súboru
let currentWordIndex = 0; // Index aktuálneho slova
let wordList = []; // Pole slov na vyslovenie
const pocetcviceni = 2;

const EffectssoundFolder = `zvuky/effects`;
let  effectVyhra = new Howl({ src: [`zvuky/effects/vyhra.mp3`] });
let effectZle = new Howl({ src: [`zvuky/effects/zle.mp3`] });
let effectSpravne = new Howl({ src: [`zvuky/effects/spravne.mp3`] });



// Funkcia na otvorenie cvičenia a výber náhodných slov
function openCvicenie() {
  fetch(url)
  .then(response => response.text())
  .then(obsah => {
    const riadky = obsah.split('\n');
    let vybraneSlova = []; // Seznam již vybraných slov
    while (wordList.length < pocetcviceni) {
      const nahodnyIndex = Math.floor(Math.random() * riadky.length);
      const slovo = riadky[nahodnyIndex].trim();
      if (!vybraneSlova.includes(slovo)) { // Pokud slovo není již vybráno
        wordList.push(slovo);
        vybraneSlova.push(slovo);
      }
    }
    startExercise();
  })
  .catch(error => {
    console.error('Chyba pri načítaní obsahu súboru: ' + error);
  });
}

/* MINIGAME VYSLOVNOSŤ SLOVA*/
function startExercise() {
  document.getElementById("cvicenie").style.display = "block";
  document.getElementById("blur-background").style.display = "block";
  document.body.classList.add("cvicenie-open");
  document.body.style.overflow = "hidden"; // Zabrániť posúvaní stránky
  displayWord();
}

// Funkcia na zobrazenie aktuálneho slova na vyslovenie
function displayWord() {
  document.getElementById("word-display").innerText = wordList[currentWordIndex].toUpperCase();
  const imageName = wordList[currentWordIndex] + ".png"; 
  document.getElementById("cvicenie-image").src = "images/slova/" + imageName;
}

function rozpoznanieS() {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'sk-SK';     //jazyk
  recognition.continuous = false; //rozoznavanie jedneho slova

  // Spustenie nahrávania po stlačení tlačidla
  recognition.start();
  console.log('Nahrávanie spustené.');

  let transcript = ''; // Premenná na uchovávanie rozpoznaného textu

  //promisa, ktorá počká na ukončenie nahrávania
  const waitForEnd = new Promise((resolve) => {
    // Funkcia, ktorá sa vyvolá po ukončení nahrávania
    recognition.onend = () => {
      console.log('Nahrávanie ukončené.');
      console.log('Rozpoznaný text:', transcript);

      const currentWord = wordList[currentWordIndex];

      if (transcript.toLowerCase() === currentWord.toLowerCase()) {
        console.log('Bolo správne vyslovené slovo "' + currentWord + '".');
        document.getElementById("vysledok").innerHTML = '<center><img src="images/spravne.png" alt="Správne" style="width: 435px; height: 342px;"></center>';
        effectSpravne.play();
        currentWordIndex++;
        setTimeout(() => {
        document.getElementById("vysledok").innerHTML = ''; 
        if (currentWordIndex < wordList.length) {
          displayWord(); // Zobraziť ďalšie slovo
        } else {
          closeCvicenie(); // Ukončiť cvičenie
        }
        }, 2000);
      } else {
        console.log('Slovo "' + currentWord + '" nebolo správne vyslovené.');
        console.log('Skús ho vysloviť znova');
        document.getElementById("vysledok").innerHTML = '<center><img src="images/nespravne.png" alt="Nesprávne" style="width: 435px; height: 342px;"></center>';
        effectZle.play();
      }
      setTimeout(() => {
        document.getElementById("vysledok").innerHTML = ''; // Vymazanie obrázka po 2 sekundách
      resolve();  //resolve na splnenie promisy
      }, 2000);
    };
  });

  recognition.onresult = function(event) {
    transcript += event.results[0][0].transcript.trim();  // Rozpoznaný text
  };
  //upozornenie na chybu
  recognition.onerror = function(event) {
    console.error('Chyba pri rozpoznávaní reči:', event.error);
  };
  // Zastavenie nahrávania po 5 sekundách
  setTimeout(() => {
    recognition.stop();
  }, 5000);
  // Počkáme na ukončenie nahrávania pomocou promisy
  waitForEnd.then(() => {
    console.log('Vyhodnotenie hotové.');
  });
}

// Funkcia na zatvorenie cvičenia
function closeCvicenie() {
  transcript += event.results[0][0].transcript.trim();
  document.getElementById("cvicenie").style.display = "none";
  document.getElementById("blur-background").style.display = "none";
  document.body.classList.remove("cvicenie-open");
  document.body.style.overflow = "auto"; // Povoliť posúvanie stránky
}

const rozpoznanie = document.getElementById('rozpoznanie');
rozpoznanie.addEventListener('click', rozpoznanieS);

  
  