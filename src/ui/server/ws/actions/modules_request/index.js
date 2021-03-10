const fs = require('fs');
const path = require('path');

const execute_request = require('./../execute_request/index');

const module_path = path.join(__dirname, './modules.json');

const execute = (socket, message) => {
    let result = {
        result_type: 'modules_result'
    };

    fs.promises.readFile(module_path).then(buffer => {
        let modules = JSON.parse(buffer.toString());

        switch(message.request){
            case 'list':     
                result = {
                    ...result,
                    modules: modules
                };       

                modules
                .sort((a,b) => {
                    if(!a.auto_start) return -1;
                    if(!b.auto_start) return 1;
                    const a_auto_order = parseInt(a.auto_start);
                    const b_auto_order = parseInt(b.auto_start);

                    return a_auto_order - b_auto_order;
                })
                .forEach(mod => {
                    if(mod.option === 'true'){
                        if(mod.auto_start) execute_request(socket, {value: mod.code});
                    }                    
                });

                socket.send(JSON.stringify(result));
                break;
            case 'add': 
                const new_mod = message.value;
                
                modules = modules.filter(mod => {
                    return mod.name !== new_mod.name;
                });

                modules.push(new_mod);
                fs.promises.writeFile(module_path, JSON.stringify(modules, null, '\t'));
                break;
            case 'remove':
                const rmv_name = message.value;
                
                modules = modules.filter(mod => {
                    return mod.name !== rmv_name;
                });

                fs.promises.writeFile(module_path, JSON.stringify(modules, null, '\t'));
                
                result = {
                    ...result,
                    modules: modules
                };       
                socket.send(JSON.stringify(result));
                break;
        }
    });
}

module.exports = execute;