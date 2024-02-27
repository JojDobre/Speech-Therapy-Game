function getAvailableMicrophones() {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const selectMicrophone = document.getElementById('select-microphone');
        devices.forEach(device => {
          if (device.kind === 'audioinput') {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `Mikrofón ${selectMicrophone.length + 1}`;
            selectMicrophone.appendChild(option);
          }
        });
      })
      .catch(err => console.error('Chyba pri načítaní zdrojov mikrofónu:', err));
  }
  
  function saveMicrophoneSettings() {
    const selectedMicrophone = document.getElementById('select-microphone').value;
    
    // Odoslanie informácie o vybranom mikrofóne do hlavnej procesu cez IPC
    ipcRenderer.send('microphone-selected', selectedMicrophone);
  }
  
  
  