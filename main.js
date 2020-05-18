const { BrowserWindow, app } = require("electron");

function createWindow() {
	let win = new BrowserWindow({
		width: 1000,
		height: 1300,
		webPreferences: {
			nodeIntegration: true
		}
	});

	win.setMenuBarVisibility(false);

	win.loadFile("html/index.html");
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

