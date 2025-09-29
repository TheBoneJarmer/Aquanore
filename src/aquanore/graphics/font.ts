import { Aquanore } from "../aquanore";

export class Glyph {
    id: number;
    char: string;
    x: number;
    y: number;
    xoffset: number;
    yoffset: number;
    width: number;
    height: number;
    baseline: number;
}

export class Font {
    private static readonly CHARACTERS = `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!№;%:?*()_+-=.,/\\|"'@#$^&{}[]<> áéíóúýäëïöüÿàèìòùỳãẽĩõũỹñ€`;

    private _size: number;
    private _family: string;

    private _vao: WebGLVertexArrayObject;
    private _tex: WebGLTexture;
    private _texWidth: number;
    private _texHeight: number;

    private _glyphs: Glyph[];

    get id(): WebGLVertexArrayObject {
        return this._vao;
    }

    get tex(): WebGLTexture {
        return this._tex;
    }

    get texWidth(): number {
        return this._texWidth;
    }

    get texHeight(): number {
        return this._texHeight;
    }

    get glyphs(): Glyph[] {
        return this._glyphs;
    }

    constructor(size: number, family: string) {
        this._size = size;
        this._family = family;
        this._glyphs = [];

        this.generateGlyphs();
        this.generateTexture();
        this.generateVao();
    }

    private generateTexture() {
        const chars = Font.CHARACTERS;

        const cnv = document.createElement("canvas");
        cnv.width = this._size * chars.length;
        cnv.height = this._size;

        const ctx = cnv.getContext("2d")!;
        ctx.font = `${this._size}px ${this._family}`;
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";

        let advance = 0;

        for (let i = 0; i < chars.length; i++) {
            const char = chars[i];
            const metrics = ctx.measureText(char);
            const width = metrics.width;

            ctx.fillText(char, advance, 0);
            advance += width;
        }

        const gl = Aquanore.ctx;
        const data = ctx.getImageData(0, 0, cnv.width, cnv.height);
        const id = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, id);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);

        this._tex = id;
        this._texWidth = cnv.width;
        this._texHeight = cnv.height;
    }

    private generateGlyphs() {
        const chars = Font.CHARACTERS;

        const cnv = document.createElement("canvas");
        cnv.width = this._size * chars.length;
        cnv.height = this._size;

        const ctx = cnv.getContext("2d")!;
        ctx.font = `${this._size}px ${this._family}`;

        let advance: number = 0;
        let glyphs: Glyph[] = [];

        for (let i = 0; i < chars.length; i++) {
            const char = chars[i];
            const charX = advance;
            const charY = 0;

            const metrics = ctx.measureText(char);
            const width = metrics.width;
            const height = this._size;

            const glyph = new Glyph();
            glyph.id = char.charCodeAt(0);
            glyph.char = char;
            glyph.x = charX;
            glyph.y = charY;
            glyph.width = width;
            glyph.height = height;
            glyph.xoffset = 0;
            glyph.yoffset = 0;
            glyph.baseline = metrics.ideographicBaseline;

            glyphs.push(glyph);
            advance += width;
        }

        this._glyphs = glyphs;
    }

    private generateBufferData() {
        const vertices = [];
        const uvs = [];

        for (let i = 0; i < this._glyphs.length * 12; i++) {
            vertices[i] = 0;
            uvs[i] = 0;
        }

        for (let i = 0; i < this._glyphs.length * 12; i += 12) {
            const glyph = this._glyphs[i / 12];
            const tcX = glyph.x / this._texWidth;
            const tcY = glyph.y / this._texHeight;
            const tcW = glyph.width / this._texWidth;
            const tcH = glyph.height / this._texHeight;

            vertices[i + 0] = 0;
            vertices[i + 1] = 0;
            vertices[i + 2] = glyph.width;
            vertices[i + 3] = 0;
            vertices[i + 4] = 0;
            vertices[i + 5] = glyph.height;
            vertices[i + 6] = glyph.width;
            vertices[i + 7] = 0;
            vertices[i + 8] = 0;
            vertices[i + 9] = glyph.height;
            vertices[i + 10] = glyph.width;
            vertices[i + 11] = glyph.height;

            uvs[i + 0] = tcX;
            uvs[i + 1] = tcY;
            uvs[i + 2] = tcX + tcW;
            uvs[i + 3] = tcY;
            uvs[i + 4] = tcX;
            uvs[i + 5] = tcY + tcH;
            uvs[i + 6] = tcX + tcW;
            uvs[i + 7] = tcY;
            uvs[i + 8] = tcX;
            uvs[i + 9] = tcY + tcH;
            uvs[i + 10] = tcX + tcW;
            uvs[i + 11] = tcY + tcH;
        }

        return {
            vertices: vertices,
            uvs: uvs
        };
    }

    private generateVao() {
        const gl = Aquanore.ctx;

        const data = this.generateBufferData();
        const vertices = data.vertices;
        const uvs = data.uvs;

        const vao = gl.createVertexArray();
        const vboVertices = gl.createBuffer();
        const vboTexcoords = gl.createBuffer();

        gl.bindVertexArray(vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, vboVertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        gl.bindBuffer(gl.ARRAY_BUFFER, vboTexcoords);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(1);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);

        this._vao = vao;
    }
}