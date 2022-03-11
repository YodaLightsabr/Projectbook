import child_process from 'child_process';

export const open = (url) => {
    return new Promise((resolve, reject) => {
        const start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
        child_process.exec(start + ' ' + url, (err, stdout, stderr) => {
            if (err) {
                return reject(err);
            } else {
                return resolve({ stdout, stderr });
            }
        });
    });
}