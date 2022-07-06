var painting = false;
var canvas;
var showStickers = false;
var isITextSelected = false;
stickers = ['assets/stickers/1.svg', 'assets/stickers/2.svg', 'assets/stickers/3.svg', 'assets/stickers/4.svg', 'assets/stickers/5.svg', 'assets/stickers/6.svg', 'assets/stickers/bee.svg','assets/stickers/chainsaw.svg','assets/stickers/cross.svg','assets/stickers/green.svg','assets/stickers/grey.svg','assets/stickers/home.svg','assets/stickers/lighting.svg','assets/stickers/roof.svg','assets/stickers/tree.svg','assets/stickers/wood.svg','assets/stickers/xmastree.svg'];

window.addEventListener('load', () => {
	let с = document.getElementById('canvas');
	canvas = new fabric.Canvas('canvas', { selection: false, uniScaleTransform: true });
	canvas.setWidth(800);
	canvas.setHeight(800);
	canvas.renderAll();
	console.log(canvas);

	let stickersWrapper = document.getElementsByClassName('stickers')[0];
	console.log(stickersWrapper);
	for(let i = 0; i < stickers.length; i++){
		let sticker = document.createElement("img");
		sticker.setAttribute('src', stickers[i]);
		sticker.setAttribute('class', 'sticker');
		console.log(sticker);
		stickersWrapper.appendChild(sticker);
	}
})

function toggleDrawingMode() {
	painting = !painting;
	canvas.set({
		isDrawingMode: painting
	})
	console.log(painting);
}

function toggleStickers() {
	showStickers = !showStickers;
	let stickersWrapper = document.getElementsByClassName('stickers')[0];
	stickersWrapper.style.display = showStickers ? 'block' : 'none';
}

function addText() {
	if(showStickers) showStickers = false;
	const text = new fabric.IText('Comment', {
		strokeWidth: 2,
		stroke: '#000000',
		fill: '#dfff30',
		fontSize: 30,
		fontFamily: "Roboto",
		fontWeight: "bold"
	});
	canvas.add(text);
	canvas.setActiveObject(text);
	text.enterEditing();
	text.setSelectionStart(0);
	text.setSelectionEnd(text.text.length);
	text.center();
	isITextSelected = true;
}

function undo() {
	let arr = canvas.getObjects();
	canvas.remove(arr.pop());
	canvas.renderAll();
}