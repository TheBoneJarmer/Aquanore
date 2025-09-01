import * as fs from "node:fs/promises";

const files = await ls("./shaders");
const dest = "./src/aquanore/graphics/shaders/shader-sources.js";

await rm(dest);
await write("export class ShaderSources {");

for (let i=0; i<files.length; i++) {
    const file = files[i];
    const content = await read(`./shaders/${file}`);
    const name = shaderName(file);

    //write(`\tstatic ${name} = \"${content}\";`);
    await write(`\tstatic get ${name}() {`);
    await write(`\t\treturn \"${content}\";`);
    await write(`\t}`);
    
    if (i < files.length - 1) {
        await write(``);
    }
}

await write("};");

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

async function write(text) {
    fs.writeFile(dest, `${text}\n`, { flag: "a" });
}

async function ls(path) {
    return await fs.readdir(path);
}

/* CONVERSION */
function shaderName(file) {
    return file.replace(".glsl", "").toUpperCase();
}