
export class Jarmer {
    static #mobile = false;
    static #canvas = null;
    static #ctx = null;

    static get isMobile() {
        return this.#mobile;
    }
    
    static getCanvas(id) {
    	return this.#canvas[id];
    }
    
    static getContext(id) {
    	return this.#ctx[id];
    }
    
    static async init() {
    	this.#canvas = {};
    	this.#ctx = {};
    
        await Cursor.init();
        await Keyboard.init();
        await Shaders.init();
    }
    
    static async prepare(id) {
    	this.#canvas[id] = document.getElementById(id);
    	this.#ctx[id] = this.#canvas[id].getContext("webgl");
    
    	await Cursor.prepare(id);
    	await Keyboard.prepare(id);
    	
    	await this.#initShaderDefault(id);
        await this.#initShaderTexture(id);	
    }
    
    static async #initShaderDefault(id) {
        let vSource = "";
        let fSource = "";

        vSource += "attribute vec2 aposition;\n";
        vSource += "uniform vec2 uresolution;\n";
        vSource += "uniform vec2 urotation;\n";
        vSource += "uniform vec2 utranslation;\n";
        vSource += "\n";
        vSource += "void main() {\n";
        vSource += "vec2 rotatedPosition = vec2(aposition.x * urotation.y + aposition.y * urotation.x, aposition.y * urotation.y - aposition.x * urotation.x);\n";
        vSource += "vec2 zeroToOne = (rotatedPosition + utranslation) / uresolution;\n";
        vSource += "vec2 zeroToTwo = zeroToOne * 2.0;\n";
        vSource += "vec2 clipSpace = zeroToTwo - 1.0;\n";
        vSource += "gl_Position = vec4(clipSpace.x, -clipSpace.y, 0, 1);\n";
        vSource += "}\n";

        fSource += "precision mediump float;\n";
        fSource += "uniform vec4 ucolor;\n";
        fSource += "\n";
        fSource += "void main() {\n";
        fSource += "gl_FragColor = ucolor;\n";
        fSource += "}\n";

        Shaders.default[id] = new Shader(id, vSource, fSource);
    }
    static async #initShaderTexture(id) {
        let vSource = "";
        let fSource = "";

        vSource += "attribute vec2 aposition;\n";
        vSource += "attribute vec2 atexcoord;\n";
        vSource += "uniform vec2 uresolution;\n";
        vSource += "uniform vec2 urotation;\n";
        vSource += "uniform vec2 utranslation;\n";
        vSource += "varying vec2 vtexcoord;\n";
        vSource += "\n";
        vSource += "void main() {\n";
        vSource += "vec2 rotatedPosition = vec2(aposition.x * urotation.y + aposition.y * urotation.x, aposition.y * urotation.y - aposition.x * urotation.x);\n";
        vSource += "vec2 zeroToOne = (rotatedPosition + utranslation) / uresolution;\n";
        vSource += "vec2 zeroToTwo = zeroToOne * 2.0;\n";
        vSource += "vec2 clipSpace = zeroToTwo - 1.0;\n";
        vSource += "\n";
        vSource += "vtexcoord = atexcoord;\n";
        vSource += "\n";
        vSource += "gl_Position = vec4(clipSpace.x, -clipSpace.y, 0, 1);\n";
        vSource += "}\n";

        fSource += "precision mediump float;\n";
        fSource += "uniform sampler2D uimage;\n";
        fSource += "uniform vec4 ucolor;\n";
        fSource += "varying vec2 vtexcoord;\n";
        fSource += "void main() {\n";
        fSource += "gl_FragColor = texture2D(uimage, vtexcoord) * ucolor;\n";
        fSource += "}";

        Shaders.texture[id] = new Shader(id, vSource, fSource);
    }
}

export class Shaders {
    static default = null;
    static texture = null;
    
    static async init() {
    	this.default = {};
    	this.texture = {};
    }
}

export class Camera {
    static async render(id) {
    	const ctx = Jarmer.getContext(id);
    	const canvas = Jarmer.getCanvas(id);
    
        ctx.enable(ctx.BLEND);
        ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
        ctx.viewport(0, 0, canvas.width, canvas.height);
        ctx.clear(ctx.COLOR_BUFFER_BIT);
    }
}

/* INPUT */
export class Cursor {
    static x = 0;
    static y = 0;
    static down = false;
    static up = false;
    
    static async init() {
    
    }

    static async prepare(id) {
    	const canvas = Jarmer.getCanvas(id);
    
        if (Jarmer.isMobile) {
            canvas.addEventListener("touchstart", function(e) {
                Cursor.down = true;
                Cursor.x = e.changedTouches[0].clientX - canvas.getBoundingClientRect().left;
                Cursor.y = e.changedTouches[0].clientY - canvas.getBoundingClientRect().top;
            });
            canvas.addEventListener("touchmove", function(e) {
                Cursor.x = e.changedTouches[0].clientX - canvas.getBoundingClientRect().left;
                Cursor.y = e.changedTouches[0].clientY - canvas.getBoundingClientRect().top;
            });
            canvas.addEventListener("touchend", function(e) {
                Cursor.x = e.changedTouches[0].clientX - canvas.getBoundingClientRect().left;
                Cursor.y = e.changedTouches[0].clientY - canvas.getBoundingClientRect().top;
                Cursor.down = false;
                Cursor.up = true;
            });
        } else {
            canvas.addEventListener("mousedown", function(e) {
                Cursor.down = true;
                Cursor.x = e.clientX - canvas.getBoundingClientRect().left;
                Cursor.y = e.clientY - canvas.getBoundingClientRect().top;
            });
            canvas.addEventListener("mousemove", function(e) {
                Cursor.x = e.clientX - canvas.getBoundingClientRect().left;
                Cursor.y = e.clientY - canvas.getBoundingClientRect().top;
            });
            canvas.addEventListener("mouseup", function(e) {
                Cursor.x = e.clientX - canvas.getBoundingClientRect().left;
                Cursor.y = e.clientY - canvas.getBoundingClientRect().top;
                Cursor.down = false;
                Cursor.up = true;
            });
        }
    }
    static async update() {
        this.up = false;
    }
}
export class Keyboard {
    static #states = [];

    static keyDown(key) {
        for (let i=0; i<Keyboard.#states.length; i++) {
            const state = Keyboard.#states[i];

            if (key === "Any" && state.down) {
                return true;
            }

            if (state.key === key) {
                return state.down;
            }
        }

        return false;
    }
    static keyUp(key) {
        for (let i=0; i<Keyboard.#states.length; i++) {
            const state = Keyboard.#states[i];

            if (key === "Any" && state.up) {
                return true;
            }

            if (state.key === key) {
                return state.up;
            }
        }

        return false;
    }

    static async init() {
        this.#states = [];

        this.addState(Keys.up);
        this.addState(Keys.down);
        this.addState(Keys.left);
        this.addState(Keys.right);
        this.addState(Keys.space);

        window.addEventListener("keydown", function(e) {
            for (let i=0; i<Keyboard.#states.length; i++) {
                const state = Keyboard.#states[i];

                if (state.key === e.key) {
                    state.down = true;
                }
            }
        });
        window.addEventListener("keyup", function(e) {
            for (let i=0; i<Keyboard.#states.length; i++) {
                const state = Keyboard.#states[i];

                if (state.key === e.key) {
                    state.down = false;
                    state.up = true;
                }
            }
        });
    }
    
    static async prepare(id) {
    
    }
    
    static async update() {
        for (let i=0; i<Keyboard.#states.length; i++) {
            Keyboard.#states[i].up = false;
        }
    };

    static addState(key) {
        this.#states.push({
            key: key,
            down: false,
            up: false
        });
    }
}

export class Keys {
    static any = "Any";
    static up = "ArrowUp";
    static down = "ArrowDown";
    static left = "ArrowLeft";
    static right = "ArrowRight";
    static space = "Space";
}

/* MATH */
export class MathHelper {
    static toRad(deg) {
        return deg * Math.PI / 180;
    }
    static toDeg(rad) {
        return rad / Math.PI * 180;
    }

    static radiansBetweenVectors(x1, y1, x2, y2) {
        const x = x2 - x1;
        const y = y2 - y1;
        let theta = Math.atan2(y, x);

        if (theta < 0) {
            theta += 2 * Math.PI;
        }

        return theta;
    }
    static degreesBetweenVectors(x1, y1, x2, y2) {
        return this.toDeg(this.radiansBetweenVectors(x1, y1, x2, y2));
    }
    static distanceBetweenVectors(x1, y1, x2, y2) {
        const x = x1 - x2;
	    const y = y1 - y2;

	    return Math.sqrt((x * x) + (y * y));    
    }
}

 /* PHYSICS */
export class Physics {
    static Collision = {
        rectangle: function(x1,y1, w1, h1, x2, y2, w2, h2)	{
            return x1 + w1 > x2 & x1 < x2 + w2 & y1 + h1 > y2 & y1 < y2 + h2;
        },
    
        circle: function(x1, y1, r1, x2, y2, r2) {
            const distance = MathHelper.distanceBetweenVectors(x1, y1, x2, y2);
            const length = r1 + r2;
    
            return distance < length;
        }
    }
}

/* MISC */
export class Utils {
    static rgbaToHex(r, g, b, a) {
        let output = "#";

        output += r.toString(16).padStart(2, "0");
        output += g.toString(16).padStart(2, "0");
        output += b.toString(16).padStart(2, "0");
        output += a.toString(16).padStart(2, "0");

        return output;
    }
    static hexToRGBA(hex) {
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 255;
        let value = hex.replace("#", "");

        r = parseInt(value[0] + value[1], 16);
        g = parseInt(value[2] + value[3], 16);
        b = parseInt(value[4] + value[5], 16);

        if (value.length > 6) {
            a = parseInt(value[6] + value[7], 16);
        }

        return {
            r: r,
            g: g,
            b: b,
            a: a
        }
    }
}

/* ASSETS */
export class Shader {
    program = null;

    constructor(id, vsource, fsource) {
        this.#init(id, vsource, fsource);
    }

    #init(id, vsource, fsource) {
    	const ctx = Jarmer.getContext(id);
        const vshader = ctx.createShader(ctx.VERTEX_SHADER);
        const fshader = ctx.createShader(ctx.FRAGMENT_SHADER);
        this.program = ctx.createProgram();

        ctx.shaderSource(vshader, vsource);
        ctx.shaderSource(fshader, fsource);
        ctx.compileShader(vshader);
        ctx.compileShader(fshader);

        const status1 = ctx.getShaderParameter(vshader, ctx.COMPILE_STATUS);
        const status2 = ctx.getShaderParameter(fshader, ctx.COMPILE_STATUS);

        if (status1 === false) {
            console.error("GLSL compile error occured");
            console.error(ctx.getShaderInfoLog(vshader));
        }
        if (status2 === false) {
            console.error("GLSL compile error occured");
            console.error(ctx.getShaderInfoLog(fshader));
        }

        ctx.attachShader(this.program, vshader);
        ctx.attachShader(this.program, fshader);
        ctx.linkProgram(this.program);
        ctx.deleteShader(vshader);
        ctx.deleteShader(fshader);
    }
}

export class Sprite {
    #texture = null;
    #vbuffer = null;
    #tcbuffer = null;
    #shader = null;

    #framesHor = 0;
    #framesVert = 0;
    #frameWidth = 0;
    #frameHeight = 0;
    #offsetX = 0;
    #offsetY = 0;
    #scaleX = 0;
    #scaleY = 0;

    #totalVertices = [];
    #totalTexCoords = [];

    get framesHor() {
        return this.#framesHor;
    }

    get framesVert() {
        return this.#framesVert;
    }

    constructor(id, url, frameWidth, frameHeight, offsetX, offsetY, scaleX, scaleY) {
        this.#shader = Shaders.texture[id];

        this.#frameWidth = frameWidth;
        this.#frameHeight = frameHeight;
        this.#offsetX = offsetX;
        this.#offsetY = offsetY;
        this.#scaleX = scaleX;
        this.#scaleY = scaleY;

        this.#load(id, url);
    }

    #load(id, url) {
        let img = new Image();
        img.src = url;
        img.onload = () => {
            this.width = img.width;
            this.height = img.height;
            this.#framesHor = this.width / this.#frameWidth;
            this.#framesVert = this.height / this.#frameHeight;

			this.#generateTexture(id, img);
            this.#generateBuffers(id);
        }
    }
    
    #generateTexture(id, img) {
    	const ctx = Jarmer.getContext(id);   	
    	const texture = ctx.createTexture();
    	
        ctx.bindTexture(ctx.TEXTURE_2D, texture);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
        ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, img);
        
        this.#texture = texture;
    }
    
    #generateBuffers(id) {
    	const ctx = Jarmer.getContext(id);
    	
        this.#vbuffer = ctx.createBuffer();
        this.#tcbuffer = ctx.createBuffer();

        for (let frameVert=0; frameVert<this.#framesVert; frameVert++) {
            for (let frameHor=0; frameHor<this.#framesHor; frameHor++) {
                const width = (this.width * this.#scaleX) / this.#framesHor;
                const height = (this.height * this.#scaleY) / this.#framesVert;

                const clipWidth = this.width / this.#framesHor;
                const clipHeight = this.height / this.#framesVert;
                const clipX = clipWidth * frameHor;
                const clipY = clipHeight * frameVert;

                const tcX = (1 / this.width) * clipX;
                const tcY = (1 / this.height) * clipY;
                const tcWidth = 1 / (this.width / clipWidth);
                const tcHeight = 1 / (this.height / clipHeight);

                const vertices = [
                    this.#offsetX, this.#offsetY,
                    this.#offsetX + width, this.#offsetY,
                    this.#offsetX, this.#offsetY + height,
                    this.#offsetX + width, this.#offsetY,
                    this.#offsetX, this.#offsetY + height,
                    this.#offsetX + width, this.#offsetY + height
                ];

                const texcoords = [
                    tcX, tcY,
                    tcX + tcWidth, tcY,
                    tcX, tcY + tcHeight,
                    tcX + tcWidth, tcY,
                    tcX, tcY + tcHeight,
                    tcX + tcWidth, tcY + tcHeight
                ];

                this.#totalVertices = this.#totalVertices.concat(vertices);
                this.#totalTexCoords = this.#totalTexCoords.concat(texcoords);
            }
        }

        let positionAttribLocation = ctx.getAttribLocation(this.#shader.program, "aposition");
        let texcoordAttribLocation = ctx.getAttribLocation(this.#shader.program, "atexcoord");

        ctx.enableVertexAttribArray(positionAttribLocation);
        ctx.enableVertexAttribArray(texcoordAttribLocation);

        ctx.bindBuffer(ctx.ARRAY_BUFFER, this.#vbuffer);
        ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(this.#totalVertices), ctx.STATIC_DRAW);
        ctx.vertexAttribPointer(positionAttribLocation, 2, ctx.FLOAT, false, 0, 0);

        ctx.bindBuffer(ctx.ARRAY_BUFFER, this.#tcbuffer);
        ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(this.#totalTexCoords), ctx.STATIC_DRAW);
        ctx.vertexAttribPointer(texcoordAttribLocation, 2, ctx.FLOAT, false, 0, 0);
    }

    async render(id, x, y, frameHor, frameVert, angle, r, g, b, a) {
    	const ctx = Jarmer.getContext(id);
    	const canvas = Jarmer.getCanvas(id);
    	
        if (!this.#texture) {
            return;
        }

        const frameIndex = (this.#framesHor * frameVert) + frameHor;
        const cos = Math.cos(MathHelper.toRad(angle + 90));
        const sin = Math.sin(MathHelper.toRad(angle + 90));

        const positionAttribLocation = ctx.getAttribLocation(this.#shader.program, "aposition");
        const texcoordAttribLocation = ctx.getAttribLocation(this.#shader.program, "atexcoord");
        const translationUniformLocation = ctx.getUniformLocation(this.#shader.program, "utranslation");
        const rotationUniformLocation = ctx.getUniformLocation(this.#shader.program, "urotation");
        const resolutionUniformLocation = ctx.getUniformLocation(this.#shader.program, "uresolution");
        const colorUniformLocation = ctx.getUniformLocation(this.#shader.program, "ucolor");

        ctx.bindBuffer(ctx.ARRAY_BUFFER, this.#vbuffer);
        ctx.vertexAttribPointer(positionAttribLocation, 2, ctx.FLOAT, false, 0, 0);
        ctx.bindBuffer(ctx.ARRAY_BUFFER, this.#tcbuffer);
        ctx.vertexAttribPointer(texcoordAttribLocation, 2, ctx.FLOAT, false, 0, 0);

        ctx.bindTexture(ctx.TEXTURE_2D, this.#texture);
        ctx.useProgram(this.#shader.program);

        ctx.uniform2f(translationUniformLocation, x, y);
        ctx.uniform2f(rotationUniformLocation, cos, sin);
        ctx.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
        ctx.uniform4f(colorUniformLocation, r / 255.0, g / 255.0, b / 255.0, a / 255.0);

        ctx.drawArrays(ctx.TRIANGLES, frameIndex * 6, 6);

        ctx.useProgram(null);
        ctx.bindTexture(ctx.TEXTURE_2D, null);
    }
}

export class Polygon {
    #shader = null;
    #buffer = null;
    #vertices = [];

    constructor(id, vertices) {
        this.#shader = Shaders.default[id];
        this.#vertices = vertices;

        this.#generateBuffers(id);
    }

    #generateBuffers(id) {
    	const ctx = Jarmer.getContext(id);
        const positionAttribLocation = ctx.getAttribLocation(this.#shader.program, "aposition");

		this.#buffer = ctx.createBuffer();
        ctx.enableVertexAttribArray(positionAttribLocation);
        ctx.bindBuffer(ctx.ARRAY_BUFFER, this.#buffer);
        ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(this.#vertices), ctx.STATIC_DRAW);
        ctx.vertexAttribPointer(positionAttribLocation, 2, ctx.FLOAT, false, 0, 0);
    }

    render(id, x, y, angle, r, g, b, a, polygonMode = ctx.TRIANGLES) {
    	const ctx = Jarmer.getContext(id);
        const cos = Math.cos(MathHelper.toRad(angle + 90));
        const sin = Math.sin(MathHelper.toRad(angle + 90));

        const positionAttribLocation = ctx.getAttribLocation(this.#shader.program, "aposition");
        const rotationUniformLocation = ctx.getUniformLocation(this.#shader.program, "urotation");
        const translationUniformLocation = ctx.getUniformLocation(this.#shader.program, "utranslation");
        const resolutionUniformLocation = ctx.getUniformLocation(this.#shader.program, "uresolution");
        const colorUniformLocation = ctx.getUniformLocation(this.#shader.program, "ucolor");

        ctx.bindBuffer(ctx.ARRAY_BUFFER, this.#buffer);
        ctx.vertexAttribPointer(positionAttribLocation, 2, ctx.FLOAT, false, 0, 0);
        ctx.bindTexture(ctx.TEXTURE_2D, null);
        ctx.useProgram(this.#shader.program);
        ctx.uniform2f(translationUniformLocation, x, y);
        ctx.uniform2f(rotationUniformLocation, cos, sin);
        ctx.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
        ctx.uniform4f(colorUniformLocation, r / 255.0, g / 255.0, b / 255.0, a / 255.0);
        ctx.drawArrays(polygonMode, 0, this.#vertices.length / 2);
    }
}
