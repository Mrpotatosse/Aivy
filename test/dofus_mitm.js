const mitm = require('./../src/server/mitm/index');
const {dofus_client_connected_handler, dofus_client_closed_handler, dofus_client_data_handler} = require('./../src/dofus/messages/index');

const mitm_server = mitm(_ => console.log('dofus mitm server listening'),
                         _ => console.log('dofus mitm server closed'),
                         error => console.error(error),
                         dofus_client_connected_handler,
                         dofus_client_data_handler,
                         dofus_client_closed_handler);

mitm_server.listen(5555);