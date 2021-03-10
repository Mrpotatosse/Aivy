const {parser, toFiles} = require('./../src/botofu/index');
const path = require('path');

const output_path = path.join(__dirname, './../src/ui/client/protocol');

parser('D:/ANKAMA_DOFUS/DofusInvoker.swf', output_path, 'dofus_protocol.json', _ => {
    toFiles(path.join(output_path, 'dofus_protocol.json'), output_path);
});