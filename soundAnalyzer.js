const Tone = require('tone');

function startRecordingAndAnalysis() {
    // Funkcia na zobrazenie priblíženia k správnej frekvencii
    function updateFrequencyBar(frequency) {
      // Implementujte logiku na aktualizáciu priblíženia
      // napr. posielanie informácií do renderovaného procesu (index.html)
      mainWindow.webContents.send('update-frequency-bar', frequency);
    }
  
    // Nahrávanie zvuku a analýza frekvencie
    const mic = new Tone.UserMedia();
    const fft = new Tone.FFT(16); // FFT (Fast Fourier Transform) s 16 bodmi pre analýzu frekvencie
  
    mic.open();
    mic.connect(fft);
  
    let recordingStartTime = Date.now();
  
    // Po spustení nech nahráva aspoň 10 sekúnd
    Tone.Transport.scheduleRepeat(() => {
      const elapsedTime = Date.now() - recordingStartTime;
  
      if (elapsedTime < 10000) {
        const frequencies = fft.getValue();
        const targetFrequency = 4000; // Cieľová frekvencia pre písmeno "š"
  
        // Vypočítajte priblíženie k cieľovej frekvencii
        const closeness = Math.abs(frequencies[7] - targetFrequency);
  
        // Aktualizujte vizualizáciu priblíženia k správnej frekvencii
        updateFrequencyBar(closeness);
  
        // Ak je frekvencia v danom rozsahu počas aspoň 4 sekúnd, vyhodnoťte výslovnosť
        if (elapsedTime >= 4000 && frequencies[7] >= targetFrequency - 50 && frequencies[7] <= targetFrequency + 50) {
          console.log('Písmeno "š" bolo správne vyslovené!');
          mic.close();
          Tone.Transport.stop();
        }
      } else {
        mic.close();
        Tone.Transport.stop();
      }
    }, 0.1);
  
    Tone.Transport.start();
  }

  
module.exports = startRecordingAndAnalysis;