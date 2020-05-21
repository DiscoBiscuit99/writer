const { BrowserWindow, Menu, app, dialog } = require("electron");

let win;

function createWindow() {
	win = new BrowserWindow({
		width: 1000,
		height: 1100,
		webPreferences: {
			nodeIntegration: true
		}
	});

	//win.setMenuBarVisibility(false);

	win.loadFile("html/index.html");

	const template = [
		{
			label: "File",
			submenu: [{
				label: "Open file",
				click: _ => { openFile(); },
				accelerator: "CmdOrCtrl+O"
			},
			{
				label: "Save file",
				click: _ => { saveFile(); },
				accelerator: "CmdOrCtrl+S"
			},
			{
				label: "Export to PDF",
				click: _ => { exportToPDF(); },
				accelerator: "CmdOrCtrl+P"
			},
			{
				type: "separator"
			},
			{
				label: "Exit",
				click: _ => { quit(); },
				accelerator: "CmdOrCtrl+Q"
			}]
		},
		{
			label: "View",
			submenu: [{
				role: "toggledevtools"
			}]
		},
		{
			label: "About",
			click: _ => { spawnAboutWindow(); }
		}
	];

	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
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

function openFile() {
	let options = {
		title: "Open a file",
		defaultPath: app.getPath("documents"),
		filters: [
			{ name: "Custom File Type", extensions: ["wrt"] }
		],
		properties: ["openFile"]
	};

	const fs = require("fs");
	dialog.showOpenDialog(win, options).then(result => {
		let filename = result.filePaths[0];
		console.log(filename);

		fs.copyFile(filename, "html/_index.html", (err) => {
			if (err) throw err;
			console.log("File was copied to destination");
		});

		let source = fs.readFileSync("html/_index.html", "utf-8");

		console.log(source);

		source.replace("./draft_files/index.css", "../css/index.css");
		source.replace("./draft_files/index.js", "../js/index.js");

		win.loadFile("html/_index.html");
	});
}

function saveFile() {
	let options = {
		title: "Save your file",
		defaultPath: app.getPath("documents") + "/draft",
		filters: [
			{ name: 'Custom File Type', extensions: ['wrt'] }
		]
	};

	dialog.showSaveDialog(win, options).then(result => {
		let filename = result.filePath;
		console.log(filename);

		win.webContents.savePage(filename, "HTMLComplete").then(() => {
			console.log("File saved");
		}).catch(err => {
			console.log(err);
		});
	});
}

// Broken
function exportToPDF() {
	let options = {
		title: "Save your file",
		defaultPath: app.getPath("documents") + "/draft",
		filters: [
			{ name: 'Custom File Type', extensions: ['pdf'] }
		]
	};

	dialog.showSaveDialog(win, options).then(result => {
		let filename = result.filePath;

		const fs = require("fs");
		win.webContents.printToPDF({}).then(data => {
			fs.writeFile("filename", data, (err) => {
				if (err) throw err;
				console.log("PDF exported to", filename);
			});
		});
	});
}

function spawnAboutWindow() {
	let aboutWin = new BrowserWindow({
		width: 600,
		height: 600,
		webPreferences: {
			nodeIntegration: true
		}
	});

	aboutWin.loadFile("html/about.html");
}

function quit() {
	// TODO: Hide the window, save _index.html to index.html, then quit.
	win.hide();
	
	const fs = require("fs");
	fs.copyFile("html/_index.html", "html/index.html", (err) => {
		if (err) throw err;
		console.log("File was copied to destination");
	});

	app.quit();
}

