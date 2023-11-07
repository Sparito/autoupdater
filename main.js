// main.js

// Modules pour la gestion de l'appli et la création de la BrowserWindow native browser window
const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron')
const path = require('node:path')
const { autoUpdater } = require("electron-updater")
const fs = require('fs')

let mainWindow

const createWindow = () => {
	// Création de la browser window.
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
		preload: path.join(__dirname, 'preload.js'),
		contextIsolation: false,
		enableRemoteModule: true,
		}
	})

	// et chargement de l'index.html de l'application.
	mainWindow.loadFile('index.html')

	autoUpdater.on('error', (error) => {
		fs.appendFileSync('C:\\Users\\mcayr\\Documents\\Aiway\\electron-test-app\\log.txt', "an error occured: "+error.message+"\n");
	})
	autoUpdater.on('checking-for-update', (event) => {
		mainWindow.webContents.send('check-update')
		//fs.appendFileSync('C:\\Users\\mcayr\\Documents\\Aiway\\electron-test-app\\log.txt', "checking-for-update...\n");
	});
	autoUpdater.on('update-not-available', (event) => {
		mainWindow.webContents.send('update-not-available')
		//fs.appendFileSync('C:\\Users\\mcayr\\Documents\\Aiway\\electron-test-app\\log.txt', "Software up to date\n")
	});
	autoUpdater.on('update-available', (event) => {
		mainWindow.webContents.send('update-available')
	});
	autoUpdater.on('update-downloaded', (event) => {
		mainWindow.webContents.send('update-downloaded')
		//fs.appendFileSync('C:\\Users\\mcayr\\Documents\\Aiway\\electron-test-app\\log.txt', "Mise à jour téléchargée\n")
		autoUpdater.quitAndInstall()
	});


	// Ouvrir les outils de développement.
	// mainWindow.webContents.openDevTools()
}

// Cette méthode sera appelée quand Electron aura fini
// de s'initialiser et sera prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quant cet événement est émit.
app.whenReady().then(() => {
  createWindow()
  autoUpdater.checkForUpdatesAndNotify();

  app.on('activate', () => {
    // Sur macOS il est commun de re-créer une fenêtre  lors 
    // du click sur l'icone du dock et qu'il n'y a pas d'autre fenêtre ouverte.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})




// Quitter quand toutes les fenêtres sont fermées, sauf sur macOS. Dans ce cas il est courant
// que les applications et barre de menu restents actives jusqu'à ce que l'utilisateur quitte 
// de manière explicite par Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
  });

// Dans ce fichier vous pouvez inclure le reste du code spécifique au processus principal. Vous pouvez également le mettre dans des fichiers séparés et les inclure ici.