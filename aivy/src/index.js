const websocket            = require('./server/websocket');
const websocket_handler    = require('./websocket/handler');
const websocket_connection = require('./websocket/connection');
const websocket_close      = require('./websocket/close');
const websocket_error      = require('./websocket/error');

global.websocket_server = websocket(
    websocket_connection,
    websocket_handler,
    websocket_close,
    websocket_error,
    { 
        host: '127.0.0.1', 
        port: 5556 
    }
);

const mitm                          = require('./server/mitm');
const mitm_started                  = require('./dofus/mitm/server_started');
const mitm_closed                   = require('./dofus/mitm/server_closed');
const mitm_error                    = require('./dofus/mitm/server_error');
const mitm_client_connected         = require('./dofus/mitm/client_connected');
const mitm_client_received_data     = require('./dofus/mitm/client_received_data');
const mitm_client_disconnected      = require('./dofus/mitm/client_disconnected');

global.mitm_server = mitm(
    mitm_started,
    mitm_closed,
    mitm_error,
    mitm_client_connected,
    mitm_client_received_data,
    mitm_client_disconnected
);