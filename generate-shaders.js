import * as fs from "node:fs/promises";

const files = await ls("./shaders");

// Generate the class source string
console.log("export class ShaderSources {");

for (let i=0; i<files.length; i++) {
    const file = files[i];
    const content = await read(`./shaders/${file}`);
    const name = shaderName(file);

    console.log(`\tstatic readonly ${name} = "${content}"`);
}

console.log(`}`);

/* IO */
async function read(path) {
    let result = "";
    let file = await fs.open(path);

    for await (let line of file.readLines()) {
       result += `${line}\\n`; 
    }

    return result;
}

async function ls(path) {
    return await fs.readdir(path);
}

/* CONVERSION */
function shaderName(file) {
    return file.replace(".glsl", "").toUpperCase();
}