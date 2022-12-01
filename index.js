var painting = false;
var canvas;
var isITextSelected = false;
var colorsList = ['#2f3640', '#f5f6fa', '#e1b12c', '#0097e6', '#c23616', '#8c7ae6', '#44bd32', '#718093', '#192a56' ];
stickers = ['assets/stickers/1.svg', 'assets/stickers/2.svg', 'assets/stickers/3.svg', 'assets/stickers/4.svg', 'assets/stickers/5.svg', 'assets/stickers/6.svg', 'assets/stickers/bee.svg','assets/stickers/chainsaw.svg','assets/stickers/cross.svg','assets/stickers/green.svg','assets/stickers/grey.svg','assets/stickers/home.svg','assets/stickers/lighting.svg','assets/stickers/roof.svg','assets/stickers/tree.svg','assets/stickers/wood.svg','assets/stickers/xmastree.svg'];
var showStickers = false;

window.addEventListener('load', () => {

	// Upload file
    document.getElementById("downFileIMG").onchange = function(e) {
	 	var reader = new FileReader();
	 	reader.onload = function(e) {

			// canvas.setBackgroundImage(
			// 	e.target.result,
			// 	 canvas.renderAll.bind(canvas), {
			// 		width: canvas.getWidth(),
			// 		height: canvas.height,
			// });
			fabric.Image.fromURL(
				e.target.result,
				function(img) {
				    canvas.setBackgroundImage(
						   	 img,
							 canvas.renderAll.bind(canvas),
							  {

								// width: 1000,
								// height: 500,
						   		scaleX: canvas.width / img.width,
								//scaleY: 5
								scaleY: canvas.height / img.height
							  } 
						   );

console.log(1111, img)


				}
			);










			// canvas.setBackgroundImage(url, function() {
			// 	let img = canvas.backgroundImage;
			// 	img.scaleX = canvas.getWidth() / img.width;
			// 	img.scaleY = canvas.getHeight() / img.height;
			// 	canvas.renderAll();
			//   });




			// canvas.setBackgroundColor(
			// 	{
			// 		source: e.target.result,
			// 		"repeat": "no-repeat",
			// 		"width": "100"					
			// 	}, 
			// 	canvas.renderAll.bind(canvas)
			// );


//	   			var image = new Image();
//	   			image.src = e.target.result;
	   		// 	image.onload = function() {
	 		// 		var img = new fabric.Image(image);
	 		// 		img.set({
	 	  	// 			left: 100,
	 	  	// 			top: 60
	 		// 		});
	 		// 	img.scaleToWidth(200);
	 		// 	canvas.add(img).setActiveObject(img).renderAll();
	   		// }
	 	}
	 	reader.readAsDataURL(e.target.files[0]);
    }

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
	isSliderVisible(painting);
	canvas.renderAll();
}

function toggleStickers() {
	isColorPanelVisible(false);
	showStickers = !showStickers;
	painting = false;
	let stickersWrapper = document.getElementsByClassName('stickers')[0];
	stickersWrapper.style.display = showStickers ? 'flex' : 'none';
	isPaintBrushesVisible(false);
}

function addText() {
	isColorPanelVisible(false);
	showStickers = false;
	endPaint();
	const text = new fabric.IText('Comment', {
		strokeWidth: 1,
		stroke: '#000000',
		fill: '#2f3640',
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
	isPaintBrushesVisible(true);
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

function changeBrushSize(event) {
	canvas.freeDrawingBrush.width = +event;
	canvas.renderAll();
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
	if(isITextSelected) {
		activeObject = canvas.getActiveObject();
		let text = activeObject.text;
		activeObject.set('text', '');
		activeObject.fill = color;
		activeObject.set('text', text);
		// canvas.setActiveObject(activeObject);
		canvas.renderAll();
		isColorPanelVisible(false);
	} else {
		canvas.freeDrawingBrush.color = color;
		document.getElementById('brush-slider').style.setProperty('--slider-color', color);
		isColorPanelVisible(false);
	}
}


function isColorPanelVisible(bool) {
	let colorPanel = document.getElementsByClassName('ei-color-panel')[0];
	colorPanel.style.display = bool ? 'block' : 'none';
}

function isPaintBrushesVisible(bool) {
	let paints = document.getElementsByClassName('ei-color-pick')[0];
	paints.style.display = bool ? 'flex' : 'none';
}

function isSliderVisible(bool) {
	let sliderWrapper = document.getElementById('slider-wrapper');
	sliderWrapper.style.display = bool ? 'block' : 'none';
}

function isTrashVisible(bool) {
	let trash = document.getElementsByClassName('ei-bin')[0];
	trash.style.display = bool ? 'inline-flex' : 'none';
}

function isMouseOverTrash(bool) {
	let trash = document.getElementsByClassName('ei-bin')[0];
	if(bool) return trash.classList.add('ei-bin-active');
	trash.classList.remove('ei-bin-active');
}


function addFabricEvents() {
	canvas.on('mouse:down', (event) => {
		if(painting) return;
		console.log(77777, " addFabricEvents 2 ")
		if(event.target) {
			canvas.bringToFront(event.target);
			isTrashVisible(true);
			if(event.target.type == 'i-text') {
				showStickers = false;
				painting = false;
				isITextSelected = true;
			} else isITextSelected = false;
		} else {
			isITextSelected = false;
			isTrashVisible(false);
		}
	})
	canvas.on('text:changed', (event) => {
		if(event.target && event.target.name == 'ITextNumber') {
			event.target.set('text', event.target.text.replace(/[^0-9]/g, ""))
		}
	})
	canvas.on('mouse:up', (event) => {
		canvas.renderAll();
		if(event.target) {
			let trash = document.getElementsByClassName('ei-bin')[0];
			let trashOffset = {
				x: trash.offsetLeft,
				y: trash.offsetTop
			}
			if((event.pointer.x >= trashOffset.x - 20 && event.pointer.x <= trashOffset.x + 60) && (event.pointer.y >= trashOffset.y - 20 && event.pointer.y <= trashOffset.y + 60)) {
				canvas.remove(canvas.getActiveObject());
				canvas.renderAll()
				isTrashVisible(false);
				isPaintBrushesVisible(false);
			}
			isMouseOverTrash(false);
		} else {
			isTrashVisible(false);
			if(!painting) isPaintBrushesVisible(false);
		}
	})
	canvas.on('object:moving', (event) => {
		if(event.target) {
			let trash = document.getElementsByClassName('ei-bin')[0];
			let trashOffset = {
				x: trash.offsetLeft,
				y: trash.offsetTop
			}
			if((event.pointer.x >= trashOffset.x - 20 && event.pointer.x <= trashOffset.x + 60) && (event.pointer.y >= trashOffset.y - 20 && event.pointer.y <= trashOffset.y + 60)) {
				return isMouseOverTrash(true);
			}
			isMouseOverTrash(false);
		}
	})
	canvas.on('mouse:down', (event) => {
		if(event.target && event.target.get('type') == 'i-text') {
			isITextSelected = true;
			isPaintBrushesVisible(true)
		}
	})
}