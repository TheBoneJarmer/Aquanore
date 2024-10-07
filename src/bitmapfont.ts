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

    public get vao() {
        return this._vao;
    }

    public constructor(path: string) {
        if (path.endsWith(".png") || path.endsWith(".fnt")) {
            throw new Error("Please provide the path without the extension");
        }

        this.loadSprite(path);
        this.loadGlyphs(path);
    }

    private loadSprite(path: string): void {
        this._tex = new Texture(path + ".png");
    }

    private loadGlyphs(path: string): void {
        fetch(path + ".fnt")
            .then((res) => {
                if (res.status == 200) {
                    res.text().then((body) => {
                        this.parseGlyphs(body);
                    });
                } else {
                    console.error("Failed to load font '" + path + "'. Http response returned status " + res.status);
                }
            })
            .catch((err) => {
                console.error("Failed to load font '" + path + "': " + err);
            });
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

        // Wait for the texture to have loaded
        while (this._tex.id == null) {

        }

        this.generateBufferData();
        this.generateBuffers();
    }

    private generateBufferData(): void {
        let i = 0;

        for (let glyph of this._glyphs) {
            if (!glyph) {
                continue;
            }

            const tcW = 1.0 / this._tex.width;
            const tcH = 1.0 / this._tex.height;
            const tcX =

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

            i += 12;
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