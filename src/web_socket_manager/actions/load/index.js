const path = require('path');
const fs = require('fs');

const execute = (socket, request) => {
    const script_folder_location = path.join(__dirname, './../../../../saved_scripts');
    const script_file_location = path.join(script_folder_location, request.value);
    const script_file_parent_name = path.dirname(script_file_location);

    fs.promises.mkdir(script_file_parent_name, {recursive: true}).then(x => {
        if(fs.existsSync(script_file_location)){
            fs.promises.readFile(script_file_location).then(y => {
                const result = {
                    result_type: 'load_result',
                    result_data: y.toString()
                };
    
                socket.send(JSON.stringify(result));
            }); 
        }else{
            const result = {
                result_type: 'load_result',
                result_data: `/**\n * Vive les femmes\n * No file found at ${script_file_location} ! */`
            };
            socket.send(JSON.stringify(result));
        }       
    });
}

module.exports = execute;