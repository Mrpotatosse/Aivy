const frida = require('frida');
const fs = require('fs');
const util = require('util');
const path = require('path');

const readFile = util.promisify(fs.readFile);

let hook_options = {
    redirection_port: 5555,
}

const spawn_and_hook = async (target) => {
    const pid = await frida.spawn(target);
    await hook(pid);
    frida.resume(pid);
    return pid;
};

const hook = async (target) => {
    const session = await frida.attach(target);
    const script_source = await readFile(path.join(__dirname, 'script.js'), 'utf-8');
    const script_source_replaced = script_source
                                    .replace('PORT', `${hook_options.redirection_port}`)
                                    .replace('PROCESSID', `${target}`);
    const script = await session.createScript(script_source_replaced);

    script.message.connect(script_connect_message);
    
    await script.load();
}

const script_connect_message = async (message, _) => {
    console.log(message);
}

const set_hook_options = (options) => {
    hook_options = {
        ...hook_options,
        ...options
    };
}

module.exports = {
    spawn_and_hook: spawn_and_hook,
    hook: hook,
    set_hook_options: set_hook_options,
    hook_options: hook_options
};