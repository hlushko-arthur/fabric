var painting = false;
var canvas;
var showStickers = false;
var isITextSelected = false;
var isTrashVisible = false;
var isMouseOverTrash = false;
var selectedObject;
var colorsList = ['#2f3640', '#f5f6fa', '#e1b12c', '#0097e6', '#c23616', '#8c7ae6', '#44bd32', '#718093', '#192a56' ];
stickers = ['assets/stickers/1.svg', 'assets/stickers/2.svg', 'assets/stickers/3.svg', 'assets/stickers/4.svg', 'assets/stickers/5.svg', 'assets/stickers/6.svg', 'assets/stickers/bee.svg','assets/stickers/chainsaw.svg','assets/stickers/cross.svg','assets/stickers/green.svg','assets/stickers/grey.svg','assets/stickers/home.svg','assets/stickers/lighting.svg','assets/stickers/roof.svg','assets/stickers/tree.svg','assets/stickers/wood.svg','assets/stickers/xmastree.svg'];

window.addEventListener('load', () => {
	let с = document.getElementById('canvas');
	canvas = new fabric.Canvas('canvas', { selection: false, uniScaleTransform: true });
	canvas.setWidth(800);
	canvas.setHeight(800);
	canvas.renderAll();

	let stickersWrapper = document.getElementsByClassName('stickers')[0];
	for(let i = 0; i < stickers.length; i++){
		let sticker = document.createElement("img");
		sticker.setAttribute('src', stickers[i]);
		sticker.setAttribute('class', 'sticker');
		sticker.addEventListener('click', () => {
			addSticker(stickers[i]);
		})
		stickersWrapper.appendChild(sticker);
	}

	let colorsWrapper = document.getElementsByClassName('ei-color-panel')[0];
	for(let i = 0; i < colorsList.length; i++) {
		let colorItem = document.createElement('span');
		colorItem.setAttribute('onclick', "updatePaint('" + colorsList[i] + "')");
		colorItem.setAttribute('class', 'edit-color');
		colorItem.style.background = colorsList[i];
		colorsWrapper.appendChild(colorItem);
	}
	addFabricEvents();
})

function toggleDrawingMode() {
	isColorPanelVisible(false);
	painting = !painting;
	canvas.set({
		isDrawingMode: painting
	})
	isPaintBrushesVisible(painting);
	canvas.renderAll();
	
	isSliderVisible(true);
}

function toggleStickers() {
	isColorPanelVisible(false);
	showStickers = !showStickers;
	painting = false;
	let stickersWrapper = document.getElementsByClassName('stickers')[0];
	stickersWrapper.style.display = showStickers ? 'block' : 'none';
	isPaintBrushesVisible(false);
}

function addText() {
	isColorPanelVisible(false);
	showStickers = false;
	endPaint();
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

function clearCanvas() {
	canvas.remove(...canvas.getObjects());
	canvas.renderAll();
}

function addSticker(sticker) {
	endPaint();
	fabric.loadSVGFromURL(sticker, (objects, options) => {
		let svg = fabric.util.groupSVGElements(objects, options);
		svg.src = sticker;
		if(svg.viewBoxHeight > svg.viewBoxWidth){
			svg.scaleToHeight(Math.floor(55));
		} else {
			svg.scaleToWidth(Math.floor(55));
		}
		canvas.add(svg);
		svg.center();
		canvas.renderAll();
	});
	showStickers = false;
}

function endPaint() {
	painting = false;
	canvas.set({
		isDrawingMode: false
	});
}

function addFabricEvents() {
	canvas.on('mouse:down', (event) => {
		if(painting) return;
		if(event.target) {
			canvas.bringToFront(event.target);
			selectedObject = canvas.getActiveObject();
			isTrashVisible = true;
			if(event.target.type == 'i-text') {
				showStickers = false;
				painting = false;
				isITextSelected = true;
			} else isITextSelected = false;
		} else {
			selectedObject = {};
			isITextSelected = false;
			isTrashVisible = false;
		}
	})
	canvas.on('text:changed', (event) => {
		if(event.target && event.target.name == 'ITextNumber') {
			event.target.set('text', event.target.text.replace(/[^0-9]/g, ""))
		}
	})
	canvas.on('mouse:up', (event) => {
		return;
		if(event.target) {
			let trashOffset = {
				x: trash.nativeElement.offsetLeft,
				y: trash.nativeElement.offsetTop - paddingImage.top
			}
			if((event.pointer.x >= trashOffset.x - 20 && event.pointer.x <= trashOffset.x + 60) && (event.pointer.y >= trashOffset.y - 20 && event.pointer.y <= trashOffset.y + 60)) {
				canvas.remove(selectedObject);
				isITextSelected = false;
				canvas.renderAll()
				isMouseOverTrash = false;
				isTrashVisible = false;
				selectedObject = {};
			} else isMouseOverTrash = false;
		}
	})
	canvas.on('object:moving', (event) => {
		return;
		if(event.target) {
			let trashOffset = {
				x: trash.nativeElement.offsetLeft,
				y: trash.nativeElement.offsetTop - paddingImage.top
			}
			if((event.pointer.x >= trashOffset.x - 20 && event.pointer.x <= trashOffset.x + 60) && (event.pointer.y >= trashOffset.y - 20 && event.pointer.y <= trashOffset.y + 60)) {
				isMouseOverTrash = true;
			} else isMouseOverTrash = false;
		}
	})
	canvas.on('mouse:down', (event) => {
		if(event.target && event.target.get('type') == 'i-text') {
			isITextSelected = true;
			isPaintBrushesVisible(true)
		}
	})
}

function changeBrushSize(event) {
	console.log(event);
	canvas.freeDrawingBrush.width = event;
}

function getPadding() {
	let container = document.getElementById('container');
	if(container) return setTimeout(() => getPadding(), 300);
	paddingImage = {
		top: (container.offsetHeight - canvas.getHeight()) / 2,
		left: (container.offsetWidth - canvas.getWidth()) / 2,
	}
}

function pickColor() {
	let colors = document.getElementsByClassName('ei-color-panel')[0];
	colors.style.display = colors.style.display == 'flex' ? 'none' : 'flex';
}

function updatePaint(color) {
	canvas.freeDrawingBrush.color = color;
	isColorPanelVisible(false);
}


function isColorPanelVisible(bool) {
	let colorPanel = document.getElementsByClassName('ei-color-panel')[0];
	colorPanel.style.display = bool ? 'block' : 'none';
}

function isPaintBrushesVisible(bool) {
	let paints = document.getElementsByClassName('paint-brushes')[0];
	paints.style.display = bool ? 'block' : 'none';
}

function isSliderVisible(bool) {
	let sliderWrapper = document.getElementById('sliderWrapper');
	// sliderWrapper.style.display == 'inline-flex' ? 'none' : 'inline-flex';
	sliderWrapper.style.display == 'block';
}