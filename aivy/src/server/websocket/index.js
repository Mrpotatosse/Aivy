const ws = require('ws');

const websocket = (
    client_connection_handler,
    client_message_handler,
    client_close_handler,
    client_error_handler,
    {host, port}
) => {
    const server = new ws.Server({host, port});

    server.on('connection', socket => {
        client_connection_handler(socket);

        socket.on('message', message => {
            const message_json = JSON.parse(message);
            client_message_handler(socket, message_json);
        });

        socket.on('close', client_close_handler);
        socket.on('error', client_error_handler);
    });

    server.broadcastClients = (message) => {
        server.clients.forEach(socket => {
            socket.send(JSON.stringify(message));
        });
    }

    console.log(`websocket: http://${host}:${port}/`);

    process.on('SIGINT', _ => {
        server.close();
    });
    return server;
}

module.exports = websocket;