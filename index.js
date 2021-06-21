#!/usr/bin/env node

const fs = require('fs');
const {spawn} = require('child_process');

const chokidar = require('chokidar');
const debounce = require('lodash.debounce');
const chalk = require('chalk');
const program = require('caporal');

program
    .version('0.0.1')
    .argument('[filename]', 'Name of a file to execute')
    .action(async ({filename}) => {
        const name = filename || 'index.js';

        try {
            await fs.promises.access(name);
        } catch (e) {
            throw new Error(`Couldn't find the file ${filename}`);
        }

        let proc;
        const start = debounce(() => {
            if (proc) {
                proc.kill();
            }
            console.log(chalk.blue('>>>>> Starting process...'));
            proc = spawn('node', [filename], {stdio: 'inherit'});
        }, 100);

        chokidar
            .watch('.')
            .on('add', start)
            .on('change', start)
            .on('unlink', start);
    });

program.parse(process.argv);