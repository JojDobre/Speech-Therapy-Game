// Reference to the start button and result display
const startButton = document.getElementById('startButton');
const resultDisplay = document.getElementById('result');

// Reference to the canvas elements and 2D contexts
const frequencyCanvas = document.getElementById('frequencyCanvas');
const frequencyCtx = frequencyCanvas.getContext('2d');
const durationCanvas = document.getElementById('durationCanvas');
const durationCtx = durationCanvas.getContext('2d');

// Reference to the span elements for displaying numerical values
const frequencyValue = document.getElementById('frequencyValue');
const durationValue = document.getElementById('durationValue');

// Constants for defining parameters
const FFT_SIZE = 4096; // Size of the Fourier transform
const LOWER_BOUND = 3000; // Lower bound of the frequency range in Hz
const UPPER_BOUND = 5000; // Upper bound of the frequency range in Hz
const THRESHOLD = 128; // Threshold value for determining if the frequency is in range
const PERCENTAGE = 70; // Percentage of the frequency range that must be in range
const RECORDING_TIME = 3000; // Length of the recording in milliseconds

// Function to record the sound from the microphone and return a Promise with the recorded data
function recordSound() {
  console.log('Recording started');
  resultDisplay.innerText = 'Recording...';

  let stream; // Variable to store the stream for later stopping

  // Access to user's microphone
  return navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (micStream) {
      stream = micStream; // Store the stream reference
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(micStream);

      microphone.connect(analyser);
      analyser.fftSize = FFT_SIZE;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength); // Use unsigned byte array for time domain data
      let isRecording = true;

      function updateFrequency() {
        if (isRecording) {
          requestAnimationFrame(updateFrequency);
          analyser.getByteTimeDomainData(dataArray); // Get time domain data from the analyser

          // Find the peak frequency using zero-crossing method
          let maxIndex = 0;
          let maxCount = 0;
          let count = 0;
          let prevSign = 0;
          for (let i = 0; i < bufferLength; i++) {
            let currSign = Math.sign(dataArray[i] - 128); // Get the sign of the current sample
            if (currSign != prevSign) { // If the sign changes, it means a zero-crossing occurred
              count++; // Increment the count of zero-crossings
              if (count > maxCount) { // If the count is greater than the previous maximum
                maxCount = count; // Update the maximum count
                maxIndex = i; // Update the maximum index
              }
            }
            prevSign = currSign; // Update the previous sign
          }

          const currentFrequency = maxCount * audioContext.sampleRate / bufferLength; // Calculate the current frequency from the maximum count
          console.log(`Current frequency: ${currentFrequency.toFixed(2)} Hz`);

          // Update the frequency indicator
          frequencyValue.textContent = `${currentFrequency.toFixed(2)} Hz`; // Display the current frequency
          if (currentFrequency >= LOWER_BOUND && currentFrequency <= UPPER_BOUND) { // If the current frequency is in range
            frequencyCtx.fillStyle = 'green'; // Set the fill color to green
          } else { // If the current frequency is out of range
            frequencyCtx.fillStyle = 'red'; // Set the fill color to red
          }
          frequencyCtx.fillRect(0, 0, frequencyCanvas.width, frequencyCanvas.height); // Fill the whole canvas with the fill color

          // Update the duration indicator
          const currentTime = audioContext.currentTime; // Get the current time
          const currentDuration = currentTime - startTime; // Calculate the current duration
          console.log(`Current duration: ${currentDuration.toFixed(2)} s`);

          durationValue.textContent = `${currentDuration.toFixed(2)} s`; // Display the current duration
          const percentage = (currentDuration / RECORDING_TIME) * 100; // Calculate the percentage of the recording time
          durationCtx.fillStyle = 'blue'; // Set the fill color to blue
          durationCtx.fillRect(0, 0, percentage * durationCanvas.width / 100, durationCanvas.height); // Fill the canvas proportionally to the percentage
        } else {
          cancelAnimationFrame(updateFrequency); // Stop updating frequency once recording ends
        }
      }

      updateFrequency();

      // Simulate 3 seconds of recording
      return new Promise(resolve => {
        setTimeout(() => {
          console.log('Recording ended');
          isRecording = false; // Set recording flag to false

          stream.getTracks().forEach(track => track.stop()); // Stop the recording stream

          // Get the recorded data from the microphone
          const recordedData = {
            sampleRate: audioContext.sampleRate,
            getChannelData: () => dataArray // Use the real recorded data here
          };

          // Resolve the promise with the recorded data
          resolve(recordedData);
        }, RECORDING_TIME);
      });
    });
}

// Function to analyze the sound data and return a Promise with the result
function analyzeSound(soundData) {
  console.log('Analysis started');
  resultDisplay.innerText = 'Analyzing...';

  // Create an instance of AudioContext
  const audioContext = new AudioContext();

  // Create a buffer source from the sound data
  const source = audioContext.createBufferSource();
  source.buffer = soundData;

  // Create an analyser node
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = FFT_SIZE;

  // Connect the source to the analyser
  source.connect(analyser);

  // Connect the analyser to the destination
  analyser.connect(audioContext.destination);

  // Start the source
  source.start();

  // Get the frequency data from the analyser
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength); // Use unsigned byte array for frequency data
  analyser.getByteFrequencyData(dataArray);

  // Calculate the lower and upper bounds of the frequency range in terms of bins
  const lowerBound = Math.round(LOWER_BOUND / (audioContext.sampleRate / analyser.fftSize));
  const upperBound = Math.round(UPPER_BOUND / (audioContext.sampleRate / analyser.fftSize));

  // Count the number of bins that are in range
  let countInThreshold = 0;
  for (let i = lowerBound; i <= upperBound; i++) {
    if (dataArray[i] > THRESHOLD) { // If the bin value is above the threshold
      countInThreshold++; // Increment the count
    }
  }

  // Calculate the percentage of the frequency range that is in range
  const percentage = (countInThreshold / (upperBound - lowerBound + 1)) * 100;
  console.log(`Percentage in range: ${percentage}%`);

  // Determine the result based on the percentage
  const result = percentage >= PERCENTAGE ? 1 : 0;
  console.log(`Result: ${result}`);

  // Return a promise that resolves with the result
  return Promise.resolve(result);
}

// Set the function that executes when the start button is clicked
startButton.onclick = () => {
  // Disable the start button
  startButton.disabled = true;

  // Record the sound and then analyze it
  recordSound()
    .then(soundData => analyzeSound(soundData))
    .then(result => {
      // Display the result
      resultDisplay.innerText = result === 1 ? 'Správne!' : 'Nesprávne!';

      // Enable the start button
      startButton.disabled = false;
    })
    .catch(error => {
      // Display the error
      resultDisplay.innerText = `Error: ${error.message}`;

      // Enable the start button
      startButton.disabled = false;
    });
};
