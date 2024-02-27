const Store = require('electron-store');
const store = new Store();

window.onload = () => {
  const savedMicrophone = store.get('selectedMicrophone');
  document.getElementById('saved-microphone').textContent = savedMicrophone || 'Nebol uložený žiadny mikrofón';
};