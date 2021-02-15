const {create_MITM_server} = require('../src/server/mitm/index');
const server = create_MITM_server(_ => {}, (socket, data, from_client) => {
    console.log(from_client ? '[client]' : '[server]', data);
    return data;
});
//server.listen(5555);

const {dofus_data_buffer_handler, dofus_new_client_handler} = require('../src/dofus/messages/index');

const dofus_mitm_server = create_MITM_server(dofus_new_client_handler, dofus_data_buffer_handler);
dofus_mitm_server.listen(5555);