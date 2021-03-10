const websocket = require('./../../../server/websocket/index');
const message_handler = require('./handlers/index');

const connection_handler = socket => console.log('ws client connected');

const close_handler = _ => console.log('ws client closed');

const error_handler = error => console.error(error);

const open_ws = (option) => {
    return websocket(connection_handler, message_handler, close_handler, error_handler, option);
}

module.exports = open_ws;