const ws = require('ws');

let web_socket_options = {
    host: '127.0.0.1',
    port: 5556
}

const set_web_socket_options = options => {
    web_socket_options = {
        ...web_socket_options,
        ...options
    }
}

const create_web_socket_server = (web_socket_handler) => {
    const server = new ws.Server(web_socket_options);

    server.on('connection', socket => {
        console.log('ws client connected');

        socket.on('message', message => {
            const message_request = JSON.parse(message);
            web_socket_handler(socket, message_request);
        });

        socket.on('close', _ => {
            console.log('ws client leaved');
        });

        socket.on('error', error => {
            console.error(error);
        })
    });

    console.log(`websocket: http://${web_socket_options.host}:${web_socket_options.port}`);
    
    return server;
}

module.exports = {
    create_web_socket_server: create_web_socket_server,
    set_web_socket_options:set_web_socket_options,
    web_socket_options: web_socket_options
}