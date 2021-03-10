const os = require('os');
const fs = require('fs');
const path = require('path');
const {execFile} = require('child_process');

const platform = os.platform();
let parser_path = '';

switch(platform){
    case 'win32':
    case 'win64':
        parser_path = path.join(__dirname, '/parser/botofu_protocol_parser_win');break;
    case 'linux':
        parser_path = path.join(__dirname, '/parser/botofu_protocol_parser_linux');break;
    default: // use linux build by default
        parser_path = path.join(__dirname, '/parser/botofu_protocol_parser_linux');break;
}

const parser = (dofus_invoker_path, output_folder, output_name, callback) => {
    const output_file_location = path.join(output_folder, output_name);
    const output_file_file_parent_name = path.dirname(output_file_location);

    fs.promises.mkdir(output_file_file_parent_name, {recursive: true}).then(x => {
        const p = execFile(parser_path, ['--indent', '1', dofus_invoker_path, output_file_location],
        {
            maxBuffer: 1024 * 32 // max 32 MB
        }, (err, stdout, stderr) => {
            if(err){
                console.error(err); return;
            }
            if(stdout){
                console.log(stdout); return;
            }
            console.log(stderr);        
        });

        p.on('exit', callback);
    });    
};

const toFiles = (json_path, output_folder) => {
    fs.promises.readFile(json_path).then(buffer => {
        const json_data = JSON.parse(buffer.toString());

        const messages = json_data.messages;
        const types = json_data.types;

        if(messages){
            const message_ids = {};
            messages.forEach(message => {
                message_ids[message.protocolID] = message.name;
                const message_name_path = path.join(output_folder, `/messages/${message.name}.json`);
                
                const message_parent = path.dirname(message_name_path);

                fs.promises.mkdir(message_parent, {recursive: true}).then(x => {
                    fs.promises.writeFile(message_name_path, JSON.stringify(message, null, '\t'));
                });
            });
            fs.promises.writeFile(path.join(output_folder, '/MessageIds.json'), JSON.stringify(message_ids, null, '\t'));
        }

        if(types){
            const type_ids = {};
            types.forEach(type => {
                type_ids[type.protocolID] = type.name;
                const type_name_path = path.join(output_folder, `/types/${type.name}.json`);
                    
                const type_parent = path.dirname(type_name_path);

                fs.promises.mkdir(type_parent, {recursive: true}).then(x => {
                    fs.promises.writeFile(type_name_path, JSON.stringify(type, null, '\t'));
                });
            });
            fs.promises.writeFile(path.join(output_folder, '/TypeIds.json'), JSON.stringify(type_ids, null, '\t'));
        }
    })
}

module.exports = {
    parser,
    toFiles    
}