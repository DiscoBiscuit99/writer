const { loremIpsum } = require("lorem-ipsum");

let page = document.createElement("div");

page.className = "page";
page.contentEditable = true;

let margins = document.createElement("div");

margins.className = "margins";

let paragraph = document.createElement("p");

// For testing paragraph styling
//paragraph.innerHTML = lorem(5);

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

