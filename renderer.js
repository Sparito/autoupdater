const { ipcRenderer, ipcMain } = require('electron');

const version = document.getElementById('version');

ipcRenderer.send('app_version');
ipcRenderer.on('app_version', (event, arg) => {
	ipcRenderer.removeAllListeners('app_version');
	version.innerText = 'Version ' + arg.version;
});

const notification = document.getElementById('notification');
const message = document.getElementById('message');
const close = document.getElementById('close-button');
message.innerText = 'Checking for update...';

close.addEventListener('click', function() {
	notification.classList.add('hidden');
})

ipcRenderer.on('update-available', () => {
	ipcRenderer.removeAllListeners('update_available');
	message.innerText = 'A new update is available. Downloading now...';
	notification.classList.remove('hidden');
});

ipcRenderer.on('check-update', () => {
    ipcRenderer.removeAllListeners('check_for_update');
    message.innerText = 'Checking for update...';
    notification.classList.remove('hidden');
});

ipcRenderer.on('update-not-available', () => {
    ipcRenderer.removeAllListeners('update_not_available');
    message.innerText = 'Application is up to date';
    notification.classList.remove('hidden');
  });
ipcRenderer.on('update-downloaded', () => {
	ipcRenderer.removeAllListeners('update_not_available');
    message.innerText = 'Installation de la nouvelle mise à jour';
    notification.classList.remove('hidden');
});