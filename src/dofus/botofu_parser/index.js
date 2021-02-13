const os = require('os');
const path = require('path');
const {execFileSync} = require('child_process');

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

const parser = (dofus_invoker_path, output_json_path) => {
    execFileSync(parser_path, ['--indent', '1', dofus_invoker_path, output_json_path],
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