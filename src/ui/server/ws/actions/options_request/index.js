const fs = require('fs');
const path = require('path');
const set_option = require('./options');

const execute = (socket, message) => {
    const options_path = path.join(__dirname, './options.json');
    fs.promises.readFile(options_path).then(buffer => {
        const options = JSON.parse(buffer.toString());
    
        if(message.change){
            options.forEach(option => {
                if(option.text === message.change.name) option.checked = message.change.checked;  
            });
    
            fs.promises.writeFile(options_path, JSON.stringify(options, null, '\t'));
        }else{
            const result = {
                result_type: 'options_result',
                options: options
            };
            
            socket.send(JSON.stringify(result));
        }

        set_option(socket, options);
    });    
}

module.exports = execute;