// Funkcia na spustenie nahrávania a vyhodnotenie vysloveného slova
function startRecording() {
    // Vytvorenie objektu pre rozpoznávanie reči
    const recognition = new webkitSpeechRecognition();
  
    // Nastavenie parametrov rozpoznávania
    recognition.lang = 'en-US'; // Jazyk
    recognition.continuous = false; // Rozpoznávanie jedného slova
  
    // Spustenie nahrávania po 5 sekundách
    setTimeout(() => {
      recognition.start();
      console.log('Nahrávanie spustené...');
    }, 5000);
  
    // Obsluha udalosti pri dokončení nahrávania
    recognition.onresult = function(event) {
      const result = event.results[0][0].transcript.trim(); // Získanie výsledku nahrávania
      console.log('Výsledok nahrávania:', result);
      if (result.toLowerCase() === 'ssss') {
        console.log('Bolo správne vyslovené písmeno "ssss".');
      } else {
        console.log('Písmeno nebolo správne vyslovené.');
      }
    };
  
    // Obsluha udalosti pri chybe nahrávania
    recognition.onerror = function(event) {
      console.error('Chyba pri nahrávaní:', event.error);
    };
  }
  
  // Spustenie funkcie pri stlačení tlačidla
  document.getElementById('recordButton').addEventListener('click', startRecording);
  