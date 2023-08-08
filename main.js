const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');

let mainWindow;

app.on('ready', () => {
  // Start Flask app as a child process
  const flaskProcess = spawn('python', ['./server.py']); // Replace with the correct path

  // Create the Electron window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Load your Flask app's URL
  mainWindow.loadURL('http://localhost:5500/main.html');

  mainWindow.on('closed', () => {
    // Terminate the Flask app process when the Electron window is closed
    flaskProcess.kill('SIGINT');
    mainWindow = null;
  });
});
