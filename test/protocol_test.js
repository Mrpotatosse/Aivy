const { json_protocol_name } = require('../aivy_config.json');
const protocol = require(`../${json_protocol_name}`);

console.log(protocol.messages.filter(x => x.name === 'ProtocolRequired'));