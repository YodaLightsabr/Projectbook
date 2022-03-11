import fs from 'fs';
import os from 'os';
import path from 'path';

import express from 'express';

import { Database } from '@yodalightsabr/db';
import { open } from './open.js';

const db = Database.create(path.join(os.homedir(), '.projectbook'));
if (!fs.existsSync(path.join(os.homedir(), '.projectbook', 'projects'))) {
    fs.mkdirSync(path.join(os.homedir(), '.projectbook', 'projects'));
    fs.writeFileSync(path.join(os.homedir(), '.projectbook', 'projects', 'meta.json'), '{"length":0}', 'utf8');
}

function detectArgument (arg = '') {
    if (process.argv.includes(`-${arg}`)) return true;
    if (process.argv.includes(`--${arg}`)) return true;
    if (process.argv.includes(`-${arg[0]}`)) return true;
    return false;
}

function getProjects (query = { $equals: {} }) {
    return db.collection('projects').findAll(query);
}

let isWeb = false;
let isWebServerRunning = false;

if (detectArgument('web')) {
    isWeb = true;
    let port = 0;
    const app = express();
    app.get('/', (req, res) => {
        res.type('text/plain');
        res.send('Projectbook web interface is a work in progress.');
    });
    const server = app.listen(0, async () => {
        port = server.address().port;
        isWebServerRunning = true;
        try {
            await open(`http://localhost:${port}`);
            console.log('Opened Projectbook in your default browser. ');
        } catch (err) {
            console.log(`Projectbook couldn't open your browser automatically. Try clicking on or navigating to this link:\n\nhttp://localhost:${port}`)
        }
    });
} else {
    console.log(getProjects());
}