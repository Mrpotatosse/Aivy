const { exec } = require('child_process');
const path = require('path');

console.log('# # # # [Aivy] # # # #');

const launch = _ => {
    const aivyxr = exec('npm start', { cwd: path.join(__dirname, './aivyxr') });
    aivyxr.stdout.pipe(process.stdout);
    const aivy = exec('npm start', { cwd: path.join(__dirname, './aivy') });
    aivy.stdout.pipe(process.stdout);
}

launch();