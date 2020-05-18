const { loremIpsum } = require("lorem-ipsum");

let page = document.createElement("div");

page.className = "page";
page.contentEditable = true;

let margins = document.createElement("div");

margins.className = "margins";

let paragraph = document.createElement("p");

paragraph.innerHTML = lorem(5);

margins.appendChild(paragraph);
page.appendChild(margins);

document.body.appendChild(page);

page.focus();

function lorem(sentences) {
	let paragraph = "";

	for (let i = 0; i < sentences; i++) {
		paragraph += loremIpsum() + " ";
	}

	return paragraph;
} 

const { dialog, app } = require("electron").remote;
const Mousetrap = require("mousetrap");

//let options = {
	//defaultPath: "~/Desktop/savefile.wrt",
//}

Mousetrap.bind(["ctrl+k", "command+k"], () => {
	const savePath = dialog.showSaveDialog(null);
	console.log(savePath);
	
	//dialog.showSaveDialog(null, options, (path) => {
		//console.log(path);
	//});
});

