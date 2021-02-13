const {createMITMServer} = require('../src/server/mitm/index');
const server = createMITMServer(_ => {}, (socket, data, from_client) => {
    console.log(from_client ? '[client]' : '[server]', data);
    return data;
});
//server.listen(5555);

const {dofus_data_buffer_handler, dofus_new_client_handler} = require('../src/dofus/messages/index');
const dofus_mitm_server = createMITMServer(dofus_new_client_handler, dofus_data_buffer_handler);
dofus_mitm_server.listen(5555);