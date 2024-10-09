import {Sprite} from "./sprite";
import {Aquanore} from "./aquanore";
import {Texture} from "./texture";

export class Glyph {
    public id: number;
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public xoffset: number;
    public yoffset: number;
    public xadvance: number;
}

export class BitmapFont {
    private _tex: Texture = null;
    private _vertices: number[] = [];
    private _texcoords: number[] = [];
    private _glyphs: Glyph[] = [];

    private _vboVertices: WebGLBuffer;
    private _vboTexcoords: WebGLBuffer;
    private _vao: WebGLVertexArrayObject;

    public get tex() {
        return this._tex;
    }

    public get glyphs() {
        return this._glyphs;
    }

    public get vao() {
        return this._vao;
    }

    public constructor(path: string) {
        if (path.endsWith(".png") || path.endsWith(".fnt")) {
            throw new Error("Please provide the path without the extension");
        }

        this._tex = new Texture(path + ".png");
        this._tex.onLoad = async () => {
            try {
                const res = await fetch(path + ".fnt");

                if (res.status == 200) {
                    const body = await res.text();
                    this.parseGlyphs(body);
                } else {
                    console.error("Failed to load font '" + path + "'. Http response returned status " + res.status);
                }
            } catch (ex) {
                console.error(ex);
            }
        }
    }

    private parseGlyphs(data: string): void {
        const lines = data.split('\n');

        for (let line of lines) {
            const props = line.split(' ');
            const glyph = new Glyph();

            if (!line.startsWith("char")) {
                continue;
            }

            for (let prop of props) {
                const key = prop.split('=')[0];
                const value = prop.split('=')[1];

                if (key == "id") glyph.id = parseInt(value);
                if (key == "x") glyph.x = parseInt(value);
                if (key == "y") glyph.y = parseInt(value);
                if (key == "width") glyph.width = parseInt(value);
                if (key == "height") glyph.height = parseInt(value);
                if (key == "xoffset") glyph.xoffset = parseInt(value);
                if (key == "yoffset") glyph.yoffset = parseInt(value);
                if (key == "xadvance") glyph.xadvance = parseInt(value);
            }

            this._glyphs[glyph.id] = glyph;
        }

        this.generateBufferData();
        this.generateBuffers();
    }

    private generateBufferData(): void {
        for (let i=0; i<1024 * 64; i++) {
            this._vertices[i] = 0;
            this._texcoords[i] = 0;
        }

        for (let glyph of this._glyphs) {
            if (!glyph) {
                continue;
            }

            const i = glyph.id * 12;
            const tcX = glyph.x / this._tex.width;
            const tcY = glyph.y / this._tex.height;
            const tcW = glyph.width / this._tex.width;
            const tcH = glyph.height / this._tex.height;

            this._vertices[i + 0] = 0;
            this._vertices[i + 1] = 0;
            this._vertices[i + 2] = glyph.width;
            this._vertices[i + 3] = 0;
            this._vertices[i + 4] = 0;
            this._vertices[i + 5] = glyph.height;
            this._vertices[i + 6] = glyph.width;
            this._vertices[i + 7] = 0;
            this._vertices[i + 8] = 0;
            this._vertices[i + 9] = glyph.height;
            this._vertices[i + 10] = glyph.width;
            this._vertices[i + 11] = glyph.height;

            this._texcoords[i + 0] = tcX;
            this._texcoords[i + 1] = tcY;
            this._texcoords[i + 2] = tcX + tcW;
            this._texcoords[i + 3] = tcY;
            this._texcoords[i + 4] = tcX;
            this._texcoords[i + 5] = tcY + tcH;
            this._texcoords[i + 6] = tcX + tcW;
            this._texcoords[i + 7] = tcY;
            this._texcoords[i + 8] = tcX;
            this._texcoords[i + 9] = tcY + tcH;
            this._texcoords[i + 10] = tcX + tcW;
            this._texcoords[i + 11] = tcY + tcH;
        }
    }

    private generateBuffers(): void {
        const gl = Aquanore.ctx;

        this._vao = gl.createVertexArray();
        this._vboVertices = gl.createBuffer();
        this._vboTexcoords = gl.createBuffer();

        gl.bindVertexArray(this._vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._vboVertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._vboTexcoords);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._texcoords), gl.STATIC_DRAW);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(1);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
    }
}