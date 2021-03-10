const frida = require('frida');
const fs = require('fs');
const util = require('util');
const path = require('path');

const readFile = util.promisify(fs.readFile);

const spawn_and_hook = async (target, redirection_port) => {
    // create process
    const pid = await frida.spawn(target);
    // start hook
    await hook(pid, redirection_port);
    // resume process
    frida.resume(pid);
    return pid;
};

const hook = async (target, redirection_port) => {
    // attach frida to process
    const session = await frida.attach(target);
    // get detour script 
    const script_source = await readFile(path.join(__dirname, 'script.js'), 'utf-8');
    // replace PORT and PROCESSID on detour script
    const script_source_replaced = script_source
                                    .replace('PORT', `${redirection_port}`)
                                    .replace('PROCESSID', `${target}`);
    // create script
    const script = await session.createScript(script_source_replaced);
    // init error message
    script.message.connect(script_connect_message);
    
    await script.load();
}

const script_connect_message = async (message, _) => {
    console.log(message);
}

module.exports = {
    spawn_and_hook: spawn_and_hook,
    hook: hook
};