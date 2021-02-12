const frida = require('frida');
const fs = require('fs');
const util = require('util');
const path = require('path');

const readFile = util.promisify(fs.readFile);

// hook start_function
let hook_options = {
    port: 0
}

const spawn_and_hook = async (target) => {
    const pid = await frida.spawn(target);
    await hook(pid);
    frida.resume(pid);
};

const hook = async (target) => {
    const session = await frida.attach(target);
    const script_source = await readFile(path.join(__dirname, 'script.js'), 'utf-8');
    const script_source_replaced = script_source.replace('PORT', `${hook_options.port}`).replace('PID', `${target}`);
    const script = await session.createScript(script_source_replaced);
    
    script.message.connect(script_connect_message);
    
    await script.load();
}

const script_connect_message = (message, data) => {
    console.log(message);
    console.log(data);
}

const setOptions = (options) => {
    hook_options = {
        ...hook_options,
        ...options
    };
}

module.exports = {
    spawn_and_hook: spawn_and_hook,
    hook: hook,
    setOptions: setOptions,
    hook_options: hook_options
};