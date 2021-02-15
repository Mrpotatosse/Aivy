const os = require('os');
const path = require('path');
const {execFile} = require('child_process');
const {json_protocol_name} = require('../../../aivy_config.json');

const platform = os.platform();
let parser_path = '';

switch(platform){
    case 'win32':
    case 'win64':
        parser_path = path.join(__dirname, 'botofu_protocol_parser_win');break;
    case 'linux':
        parser_path = path.join(__dirname, 'botofu_protocol_parser_linux');break;
    default: // use linux build by default
        parser_path = path.join(__dirname, 'botofu_protocol_parser_linux');break;
}

const parser = (dofus_invoker_path) => {
    execFile(parser_path, ['--indent', '1', dofus_invoker_path, path.join(__dirname, `../../../${json_protocol_name}`)],
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
};

module.exports = {
    parser: parser
}