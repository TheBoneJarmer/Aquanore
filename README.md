# JarmerJS
JarmerJS is my personal light-weight 2D WebGL framework I use for my webgames. I started with a raw and barely stable version back in 2015 and kept updating and improving that version ever since. It had has many names but I decided last year to setle with JarmerJS.

## Installation
JarmerJS is available on NPM. But you can also just copy the file from this repository to your folder in case you are not using node.js for hosting a webserver.
```
npm install jarmerjs
```

## Usage
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>My Game</title>
    <meta charset="UTF-8" />
    <style>
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
    html, body {
        width: 100%;
        height: 100%;
    }
    body {
        background-color: #111;
        overflow: hidden;
    }
    </style>
</head>
<body>
    <canvas id="game" width="1024" height="768"></canvas>
    <script type="module" src="jarmer.js"></script>
    <script type="module">
        import { Jarmer, Camera, Cursor, Polygon } from "./jarmer.js";
        
        let shape = null;
        let angle = 0;
        let friction = 0;
        let size = 64;
        
        async function init() {
            await Jarmer.init();
            
            shape = new Polygon([
                (-size / 2), -(size / 2),
                size / 2, -(size / 2),
                -(size / 2), size / 2,
                -(size / 2), size / 2,
                size / 2, -(size / 2),
                size / 2, size / 2
            ]);
        }
        async function update() {
            angle += friction;
            
            if (Cursor.down) {
                friction += 0.1;
                
                if (friction > 10) {
                    friction = 10;
                }
            } else if (friction > 0) {
                friction -= 0.1;
            } else {
                friction = 0;
            }
        
            await Cursor.update();
        }
        async function render() {
            await Camera.render();
            
            await shape.render(Cursor.x, Cursor.y, angle, 0, 100, 255, 255);
        }
        async function loop() {
            await update();
            await render();
            
            requestAnimationFrame(loop);
        }
        async function resize() {
            await Jarmer.resize(window.innerWidth, window.innerHeight);
        }
        
        window.addEventListener("load", async () => {
            await init();
            await resize();
            await loop();
        });
        window.addEventListener("resize", async () => {
            await resize();
        });
    </script>
</body>
</html>
```

## Contribution
Pull requests are welcome but please do open an issue first to discuss what you would like to change.

## License
[MIT](./LICENSE)
