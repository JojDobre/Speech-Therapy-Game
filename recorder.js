// Premenné pre záznam médií, zvukové fragmenty a zoznam nahrávok
let mediaRecorder;
let audioChunks = [];
let recordingsList = [];
let animationFrameId;

// Funkcia na začatie nahrávania
async function startRecording() {
  console.log('Nahrávanie sa začalo.');
  // Získa prístup k zvukovej nahrávke pomocou používateľského zariadenia
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);

  // Udalosť zachytávajúca dostupné údaje z nahrávania
  mediaRecorder.addEventListener('dataavailable', event => {
    audioChunks.push(event.data);
  });
  
  // Udalosť, ktorá sa spustí po ukončení nahrávania
  mediaRecorder.addEventListener('stop', () => {
    console.log('Koniec nahrávania.');
    // Vytvorí objekt Blob z nahraných zvukových fragmentov
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    // Vytvorí URL adresu pre nahratý zvuk
    const audioUrl = URL.createObjectURL(audioBlob);
    // Pridá URL adresu nahrávky do zoznamu nahrávok
    recordingsList.push(audioUrl);
    // Aktualizuje zoznam zobrazených nahrávok
    populateRecordingsList();
    audioChunks = []; // Vynulovanie zvukových fragmentov pre novú nahrávku
  });

  mediaRecorder.start(); // Spustí záznam
}

// Funkcia na zastavenie nahrávania
function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop(); // Zastaví nahrávanie, ak je aktívne
  }
}

// Funkcia na aktualizáciu zoznamu nahrávok vo vizuálnom zozname
function populateRecordingsList() {
  const recordingsSelect = document.getElementById('recordingsList');
  recordingsSelect.innerHTML = '';
  // Iteruje cez zoznam nahrávok a pridáva ich do zoznamu vo forme možností
  recordingsList.forEach((recording, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `Nahrávka ${index + 1}`;
    recordingsSelect.appendChild(option);
  });
}

// Funkcia na prehratie vybranej nahrávky
function playSelectedRecording() {
  const recordingsSelect = document.getElementById('recordingsList');
  const selectedRecordingIndex = recordingsSelect.value;
  if (selectedRecordingIndex !== '') {
    const selectedRecording = recordingsList[selectedRecordingIndex];
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = selectedRecording;
    audioPlayer.style.display = 'block'; // Zobrazí prehrávač zvuku
  }
}

// Funkcia na analýzu frekvencie zvolenej nahrávky v rozsahu 3000-5000 Hz
function analyzeFrequency(selectedRecordingIndex) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const selectedRecording = recordingsList[selectedRecordingIndex];
  let analyser; // Definuj analyser na vyššej úrovni

  try {
    // Fetch nahrávky
    fetch(selectedRecording)
      .then(response => response.arrayBuffer())
      .then(audioBuffer => audioContext.decodeAudioData(audioBuffer))
      .then(audioData => {
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048; // FFT veľkosť
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const source = audioContext.createBufferSource();
        source.buffer = audioData;
        source.connect(analyser); // Pripoj analyser pred pripojením na destináciu
        analyser.connect(audioContext.destination);

        // Čakaj, kým sa načíta audioBuffer
        return new Promise(resolve => {
          source.onended = () => resolve();
          source.start();
        });
      })
      .then(() => {
        const totalFrequencyBins = analyser.frequencyBinCount / 2;
        const targetFrequencyStart = Math.floor((3000 / audioContext.sampleRate) * totalFrequencyBins);
        const targetFrequencyEnd = Math.floor((5000 / audioContext.sampleRate) * totalFrequencyBins);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);

        let targetFrequencySum = 0;
        for (let i = targetFrequencyStart; i < targetFrequencyEnd; i++) {
          targetFrequencySum += dataArray[i];
        }

        const totalSum = dataArray.reduce((sum, value) => sum + value, 0);
        const percentageInRange = (targetFrequencySum / totalSum) * 100;

        console.log(`Percento frekvencie v rozsahu 3000-5000 Hz: ${percentageInRange} %`);
      })
      .catch(error => {
        console.error('Chyba pri analýze frekvencie:', error);
      });
  } catch (error) {
    console.error('Chyba pri inicializácii AudioContextu:', error);
  }
}

// Príklad použitia: analyzovať vybranú nahrávku po jej zvolení
function analyzeSelectedRecording() {
  const recordingsSelect = document.getElementById('recordingsList');
  const selectedRecordingIndex = recordingsSelect.value;
  if (selectedRecordingIndex !== '') {
    analyzeFrequency(selectedRecordingIndex);
  }
}


function evaluateWord() {
  // Získanie vybranej nahrávky zo zoznamu
  const recordingsSelect = document.getElementById('recordingsList');
  const selectedRecordingIndex = recordingsSelect.value;
  if (selectedRecordingIndex !== '') {
    const audioUrl = recordingsList[selectedRecordingIndex];

    // Vytvorenie objektu pre rozpoznávanie reči
    const recognition = new webkitSpeechRecognition();
    
    // Nastavenie parametrov rozpoznávania
    recognition.lang = 'sk-SK'; // Jazyk
    recognition.continuous = false; // Rozpoznávanie jedného slova

    // Obsluha udalostí pri chybách alebo ukončení rozpoznávania
    recognition.onerror = function(event) {
      console.error('Chyba pri rozpoznávaní reči:', event.error);
    };

    // Spustenie rozpoznávania reči až po načítaní zvukovej nahrávky
    fetch(audioUrl)
      .then(response => response.blob())
      .then(blob => {
        const audio = new Audio();
        audio.src = URL.createObjectURL(blob);
        audio.onloadedmetadata = function() {
          audio.play(); // Prehranie zvuku pre rozpoznávanie
          recognition.start();
          console.log('Rozpoznávanie reči spustené.');
        };
      })
      .catch(error => {
        console.error('Chyba pri načítaní zvukovej nahrávky:', error);
      });

    // Udalosť pri úspešnom rozpoznávaní slova
    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript.trim(); // Získanie textu z rozpoznaného zvuku
      console.log('Rozpoznaný text:', transcript);
      
      // Vyhodnotenie, či bolo vyslovené slovo "ssss"
      if (transcript.toLowerCase() === 'auto') {
        console.log('Bolo správne vyslovené slovo "auto".');
      } else {
        console.log('Slovo nebolo správne vyslovené.');
      }
    };
  } else {
    console.log('Prosím, vyberte nahrávku zo zoznamu na vyhodnotenie.');
  }
  recognition.stop();
}

function rozpoznanieS() {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'sk-SK';     //jazyk
  recognition.continuous = false; //rozoznavanie iba jednej nahravky

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

      if (transcript.toLowerCase().includes('autíčko')) {
        console.log('Bolo správne vyslovené slovo "autíčko".');
      } else {
        console.log('Slovo nebolo správne vyslovené.');
      }
      resolve();  //resolve na splnenie promisy
    };
  });

  recognition.onresult = function(event) {
    transcript += event.results[0][0].transcript.trim();  // Pridanie rozpoznaného textu do premennej transcript
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


function rozpoznanieS22() {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'sk-SK';
  recognition.continuous = false;

  // Spustenie nahrávania po stlačení tlačidla
  recognition.start();
  console.log('Nahrávanie spustené.');

  let timeout; // Premenná na uchovávanie ID timeoutu

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript.trim();
    console.log('Rozpoznaný text:', transcript);
    
    if (transcript.toLowerCase() === 'autíčko') {
      console.log('Bolo správne vyslovené slovo "autíčko".');
    } else {
      console.log('Slovo nebolo správne vyslovené.');
    }
    
    // Ak bol rozpoznaný text vyhodnotený, zrušíme timeout a zastavíme nahrávanie
    clearTimeout(timeout);
    recognition.stop();
    console.log('Nahrávanie ukončené.');
  };

  recognition.onerror = function(event) {
    console.error('Chyba pri rozpoznávaní reči:', event.error);
  };

  // Zastavenie nahrávania po 5 sekundách aj v prípade, že sa nevyhodnotí žiadne slovo
  timeout = setTimeout(() => {
    recognition.stop();
    console.log('Nahrávanie ukončené.');
  }, 5000);
}




// Event listener po načítaní DOM, priradenie funkcií k tlačidlám
document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startButton');
  const stopButton = document.getElementById('stopButton');
  const playSelectedButton = document.getElementById('playSelectedButton');
  const analyzeword = document.getElementById('analyzeword');
  const rozpoznanie = document.getElementById('rozpoznanie');

  // Event listenery pre tlačidlá
  startButton.addEventListener('click', startRecording);
  stopButton.addEventListener('click', stopRecording);
  playSelectedButton.addEventListener('click', playSelectedRecording);
  analyzeword.addEventListener('click', evaluateWord);
  rozpoznanie.addEventListener('click', rozpoznanieS);
});

  