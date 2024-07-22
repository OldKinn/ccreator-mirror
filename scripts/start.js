import path from 'node:path';
import { exec } from 'node:child_process';

// 启动进程
const start = (command, cwd) => {
    const child = exec(command, {
        cwd,
        encoding: 'utf8',
        windowsHide: true
    }, (err, stdout, stderr) => {
        if (err) console.error(err);
        console.log(stdout);
        console.log(stderr);
    });
    child.stdout.on('data', (data) => {
        console.log(data);
    });
};

start('npm run dev', path.join(import.meta.dirname, '../'));
