import * as fs from "node:fs/promises";

const files = await ls("./shaders");
const srcFile = "./src/aquanore/graphics/shaders/shader-sources.js";

// Generate the source code
await rm(srcFile);
await write(srcFile, `export class ShaderSources {`);

for (let i=0; i<files.length; i++) {
    const file = files[i];
    const content = await read(`./shaders/${file}`);
    const name = shaderName(file);

    await write(srcFile, `\tstatic get ${name}() {`);
    await write(srcFile, `\t\treturn \"${content}\";`);
    await write(srcFile, `\t}`);
    
    if (i < files.length - 1) {
        await write(srcFile, ``);
    }
}

await write(srcFile, `}`);

/* IO */
async function rm(path) {
    await fs.rm(path, {
        force: true
    });
}

async function read(path) {
    let result = "";
    let file = await fs.open(path);

    for await (let line of file.readLines()) {
       result += `${line}\\n`; 
    }

    return result;
}

async function write(path, text) {
    await fs.writeFile(path, `${text}\n`, { flag: "a" });
}

async function ls(path) {
    return await fs.readdir(path);
}

/* CONVERSION */
function shaderName(file) {
    return file.replace(".glsl", "").toUpperCase();
}