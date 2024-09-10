# Aquanore
Aquanore is a light-weight 2D WebGL framework for creating web games. I started with a raw and barely stable version back in 2015 and kept updating and improving that version ever since. As of today it is a polished library that can be used for creating HTML5 games for both desktop and mobile!

Aquanore is written in TypeScript and therefore has a type definition available. It can however also be used in vanilla JavaScript. The design goal is to keep it simple and sexy and make it as easy and straightforward as possible to setup a game real quick.

## Installing
```
npm install aquanore
```

## Docs
Go to the [docs](./docs/aquanore.md)

## Example usage
```html
<!DOCTYPE html>
<html>
<head>
    <title>Aquanore Example</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,height=device-height,initial-scale=1.0" />

    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
    </style>
</head>
<body>
<script src="path_to_main.js" type="module"></script>
</body>
</html>
```

```js
import {Aquanore, Polygon, Renderer, Color, Vector2, AquanoreOptions} from "aquanore";

let polygon = null;
let angle = 0;

// Initialize everything. Must. be. ran. before anything else!
const options = new AquanoreOptions();
Aquanore.init(options);

// Assign the onLoad event with a callback function which will is ran before the game loop. Use this to load content and state initialization.
Aquanore.onLoad = () => {
    const vertices = [0, 0, 32, 0, 0, 32, 32, 0, 0, 32, 32, 32 ];
    const texcoords = [0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1 ];

    polygon = new Polygon(vertices, texcoords);
};

// The update loop runs continiously and is meant for updating your game state/animations/motions/etc.
Aquanore.onUpdate = (deltaTime) => {
    angle += deltaTime / 10.0;
};

// The render loop is used for well, drawing polygons and sprites.
Aquanore.onRender = () => {
    const pos = new Vector2(window.innerWidth / 2, window.innerHeight / 2);
    const scale = new Vector2(1,1);
    const origin = new Vector2(16, 16);
    const offset = new Vector2(0, 0);
    const color = new Color(255, 255, 255, 255);

    Renderer.drawPolygon(polygon, null, pos, scale, origin, offset, angle, false, false, color);
};

Aquanore.run();
```

## Contribution
For now I will not accept pull requests as the library still needs some expected fine-tuning from my end. But please do open a pull request.

## License
[MIT](./LICENSE)
