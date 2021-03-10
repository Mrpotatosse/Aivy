const ws = require('ws');

const websocket = (
    client_connection_handler,
    client_message_handler,
    client_close_handler,
    client_error_handler,
    server_option
) => {
    const server = new ws.Server(server_option);

    server.on('connection', socket => {
        client_connection_handler(socket);

        socket.on('message', message => {
            const message_json = JSON.parse(message);
            client_message_handler(socket, message_json);
        });

        socket.on('close', client_close_handler);
        socket.on('error', client_error_handler);
    });

    console.log(`websocket: http://${server_option.host}:${server_option.port}/`);
    return server;
}

module.exports = websocket;