const { parser } = require('../src/dofus/botofu_parser/index');
const path = require('path');
parser('D:\\ANKAMA_DOFUS\\DofusInvoker.swf', path.join(__dirname, '../protocol_parsed_json.json'));