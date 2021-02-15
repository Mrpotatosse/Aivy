const { parser } = require('../src/dofus/botofu_parser/index');
const {json_protocol_name} = require('../aivy_config.json');
parser('D:\\ANKAMA_DOFUS\\DofusInvoker.swf', `../${json_protocol_name}`);