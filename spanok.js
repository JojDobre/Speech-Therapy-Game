const record = require('node-record-lpcm16');
const pitchfinder = require('pitchfinder');

const pitchDetector = new pitchfinder.AMDF();
let recordingBuffer = [];

function startRecording() {
  console.log('Začína nahrávanie...');

  const recording = record.start({
    sampleRate: 44100,
    channels: 1,
    verbose: true,
  });

  let startTime = Date.now();

  recording
    .on('data', (data) => {
      const frequency = pitchDetector(data);

      if (!isNaN(frequency)) {
        console.log(`Frekvencia hlasu: ${frequency.toFixed(2)} Hz`);
      }

      recordingBuffer.push(data);
    })
    .on('end', () => {
      console.log('Nahrávanie ukončené.');

      // Volanie analýzy až po ukončení nahrávky
      analyzeRecording(recordingBuffer);
    });

  setTimeout(() => {
    record.stop();
    console.log('Nahrávanie trvalo 10 sekúnd.');
  }, 10000);
}

function analyzeRecording(recordingBuffer) {
  const frequencies = pitchDetector(recordingBuffer);
  const targetFrequencyRange = [3000, 5000];
  let countInRange = 0;

  frequencies.forEach((frequency) => {
    if (frequency >= targetFrequencyRange[0] && frequency <= targetFrequencyRange[1]) {
      countInRange++;
    }
  });

  const percentageInRange = (countInRange / frequencies.length) * 100;
  console.log(`Percento nahrávky v rozsahu ${targetFrequencyRange[0]} - ${targetFrequencyRange[1]} Hz: ${percentageInRange.toFixed(2)}%`);
}

// Spustenie nahrávania
startRecording();
