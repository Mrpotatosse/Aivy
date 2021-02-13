const frida = require('frida');
const fs = require('fs');
const util = require('util');
const path = require('path');
const axios = require('axios');

const readFile = util.promisify(fs.readFile);

let hook_options = {
    ip_send_host: 'localhost',
    ip_send_port: 8000,
    ip_send_path: '/setipredirect',
    redirection_port: 5555,
}

const spawn_and_hook = async (target) => {
    const pid = await frida.spawn(target);
    await hook(pid);
    frida.resume(pid);
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
    if(message.type === 'send'){        
        try{
            const post_form = JSON.parse(message.payload);
            axios
            .post(`http://${hook_options.ip_send_host}:${hook_options.ip_send_port}${hook_options.ip_send_path}`, post_form)
            .catch(error => console.error(error));
        }catch(exception){
            console.error(exception);
        }
    }
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