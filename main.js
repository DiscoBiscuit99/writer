const { BrowserWindow, Menu, app, dialog } = require("electron");

let win;
let menubarVisible = true;

function createWindow() {
	win = new BrowserWindow({
		width: 1000,
		height: 1100,
		webPreferences: {
			nodeIntegration: true
		}
	});

	win.setMenuBarVisibility(menubarVisible);

	win.loadFile("html/index.html");

	const template = [
		{
			label: "File",
			submenu: [
				{
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
				{ type: "separator" },
				{
					role: "quit",
					accelerator: "CmdOrCtrl+Q"
				}
			]
		},
		{
			label: "Edit",
			submenu: [{
					label: "H1 title",
					click: _ => { h1Title(); },
					accelerator: "CmdOrCtrl+1"
				},
				{
					label: "H2 title",
					click: _ => { h2Title(); },
					accelerator: "CmdOrCtrl+2"
				},
				{
					label: "H3 title",
					click: _ => { h3Title(); },
					accelerator: "CmdOrCtrl+3"
				},
				{ type: "separator" },
				{
					label: "Italisize",
					accelerator: "CmdOrCtrl+I"
				},
				{
					label: "Bold",
					accelerator: "CmdOrCtrl+B"
				},
				{ type: "separator" },
				{ role: "cut" },
				{ role: "copy" },
				{ role: "paste" },
				{ type: "separator" },
				{ role: "undo" },
				{ role: "redo" }
			]
		},
		{
			label: "View",
			submenu: [
				{ 
					label: "Toggle menubar",
					click: _ => { toggleMenubar(); },
					accelerator: "CmdOrCtrl+M"
				},
				{ role: "toggledevtools" }
			]
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

app.on('before-quit', () => {
	win.close();
	
	const fs = require("fs");

	try {
		if (fs.existsSync("html/_index.html")) {
			//file exists
			fs.unlink("html/_index.html", (err) => {
				if (err) throw err;
				console.log("Removed _index.html");
			});
		}
	} catch(err) {
		throw err;
	}
});

///////////////////////////////////////

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
		let filepath = result.filePaths[0];
		console.log(filepath);

		let source = fs.readFileSync(filepath, "utf-8");
		console.log(source);

		let _ = filepath.split("\\");
		let filename = _[_.length-1].split(".")[0];

		console.log("Filename:", filename);

		source = source.replace("./" + filename + "_files/index.css", "../css/index.css")
					.replace(' src="./' + filename + '_files/index.js"', "");

		fs.writeFile("html/_index.html", source, { encoding: "utf8", flag: "w" }, (err) => {
			if (err) throw err;
			console.log("_index.html fixed");
		});

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
		let filpath = result.filePath;
		console.log(filepath);

		win.webContents.savePage(filepath, "HTMLComplete").then(() => {
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
		let filepath = result.filePath;

		const fs = require("fs");
		win.webContents.printToPDF({}).then(data => {
			fs.writeFile(filepath, data, (err) => {
				if (err) throw err;
				console.log("PDF exported to", filepath);
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

function toggleMenubar() {
	menubarVisible = !menubarVisible;
	win.setMenuBarVisibility(menubarVisible);
}

