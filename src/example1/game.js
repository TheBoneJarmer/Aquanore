import { Jarmer, Sprite, Keyboard, Camera, Keys } from "../jarmer.js";

let sprite = null;

let frame = 0;
let frameTime = 0;
let direction = 0;
let x = 0;
let y = 0;
let goalX = x;
let goalY = y;

async function resize() {
	const canvas = document.getElementById('game');
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

async function init() {
	await Jarmer.init();
	await Jarmer.prepare('game');
	
	sprite = new Sprite('game', 'npc.png', 16, 16, 0, 0, 4, 4);
}

async function update() {
	if (x === goalX && y === goalY) {
		if (Keyboard.keyDown(Keys.up)) {
			goalY -= 64;
		}
		
		if (Keyboard.keyDown(Keys.down)) {
			goalY += 64;
		}
		
		if (Keyboard.keyDown(Keys.left)) {
			goalX -= 64;
		}
		
		if (Keyboard.keyDown(Keys.right)) {
			goalX += 64;
		}
	} else {
		const speed = 4;
		
		if (x < goalX - speed) {
			x += speed;
			direction = 2;
		} else if (x > goalX + speed) {
			x -= speed;
			direction = 3;
		} else {
			x = goalX;
		}
		
		if (y < goalY - speed) {
			y += speed;
			direction = 0;
		} else if (y > goalY + speed) {
			y -= speed;
			direction = 1;
		} else {
			y = goalY;
		}
		
		if (frameTime < 8) {
			frameTime++;
		} else {
			frameTime = 0;
			frame++;
		}
		
		if (frame === 4) {
			frame = 0;
		}
	}
	
	await Keyboard.update();
}

async function render() {
	await Camera.render('game');
	await sprite.render('game', x, y, (direction * 4) + frame, 3, 0, 255, 255, 255, 255);
}

async function main() {
	await update();
	await render();
	
	requestAnimationFrame(main);
}

addEventListener('resize', async () => {
	await resize();	
});

addEventListener("load", async () => {
	await resize();
	await init();
	await main();
});
