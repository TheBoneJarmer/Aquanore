import { exec } from "child_process";
import * as fs from "fs";

const files = await ls("./shaders");

for (let file of files) {
    const options = {
        interval: 500
    };

    fs.watchFile(`./shaders/${file}`, options, (curr, prev) => watch(file, curr, prev));
}

/* IO */
async function ls(path) {
    return fs.readdirSync(path);
}

/* CALLBACKS */
function watch(file, curr, prev) {
    const prc = exec("node ./generate-shaders.js");
    const stdout = [];
    const stderr = [];

    prc.stdout.on("data", (chunk) => {
        const str = chunk.toString('utf8');

        if (str.length == 0) {
            return;
        }

        stdout.push(str);
    });

    prc.stdout.on("end", () => {
        if (stdout.length == 0) {
            return;
        }

        console.log(stdout.join());
    });

    prc.stdout.on("error", (err) => {
        console.error(`Failed to process stdout stream: ${err}`);
    });

    prc.stderr.on("data", (chunk) => {
        const str = chunk.toString('utf8');

        if (str.length == 0) {
            return;
        }

        stderr.push(str);
    });

    prc.stderr.on("end", () => {
        if (stderr.length == 0) {
            return;
        }

        console.error(stderr.join());
    });

    prc.stderr.on("error", (err) => {
        console.error(`Failed to process stderr stream: ${err}`);
    });

    prc.on("close", (code) => {
        if (code == 0) {
            console.log(`Updated ${file}`);
        } else {
            console.error(`Failed to update shaders (${code})`);
        }
    });

    prc.on("error", (err) => {
        console.error(err);
    });
}