const net = require('net');

/**
 * Request format : ORIGINAL xxx.xxx.xxx.xxx:xxxxx xxxxx
 *                  ORIGINAL IP:PORT PID
 * 
 * @param {String} request 
 */
const parse_client_connection_request = request => {
    // split by ' '
    const request_splitted = request.split(' ');
    // get ip and port as string
    const ip_port = request_splitted[1];
    // get pid as string
    const pid = request_splitted[2];
    // split ip and port
    const ip_port_splitted = ip_port.split(':');

    return {
        host: ip_port_splitted[0],
        port: parseInt(ip_port_splitted[1]),
        pid: parseInt(pid)
    };
}

/**
 * Create new MITM server
 * 
 * @param {_ => void} server_listening_handler 
 * @param {_ => void)} server_close_handler 
 * @param {Error => void} server_error_handler 
 * @param {Socket => void} client_connection_handler 
 * @param {Socket * Buffer * Boolean => void} client_data_handler 
 */
const mitm = (
    server_listening_handler,
    server_close_handler,
    server_error_handler,
    client_connection_handler,
    client_data_handler,
    client_close_handler) => {
    // create new server
    const server = new net.Server();
    // init clients Set
    server.clients = new Set();

    // set listening event
    server.on('listening', server_listening_handler);
    // set close event
    server.on('close', server_close_handler);
    // set error event
    server.on('error', server_error_handler);

    server.on('connection', socket => {
        // remove client from server function
        const mitm_client_remove = _ => {
            // if not closing
            if (!socket.is_closing) {
                // set is_closing to true
                socket.is_closing = true;
                // destroy socket
                socket.destroy();
                // destroy remote
                socket.remote.destroy();
                // remove socket from clients list
                server.clients.delete(socket);
                // call close event
                client_close_handler();
            }
        }
        // write error function
        const mitm_client_error = error => {
            mitm_client_remove();
        }

        // create new remote client
        socket.remote = new net.Socket();

        // set client close event
        socket.on('close', mitm_client_remove);
        // set client error event
        socket.on('error', mitm_client_error);
        // set client data event
        socket.on('data', data => {
            // get data as string
            const data_string = data.toString();
            // if string is original ip sent from hook script
            if (data_string.startsWith('ORIGINAL')) {
                // parse original ip string and save original_ip on client
                socket.original_informations = parse_client_connection_request(data_string);
                // set remote close event
                socket.remote.on('close', mitm_client_remove);
                // set remote error event
                socket.remote.on('error', mitm_client_error);
                // set remote data event
                socket.remote.on('data', remote_data => {
                    // handle event and data sent
                    // send data from server to client
                    if (remote_data.length > 0 && !socket.is_closing){
                        client_data_handler(socket, remote_data, false).then(buffer => {
                            if(buffer.length > 0) socket.write(buffer);
                        });
                    } 
                });
                // connect remote to original server
                socket.remote.connect({
                    host: socket.original_informations.host,
                    port: socket.original_informations.port
                });
            } else {
                // handle event and data sent
                // send data from client to server
                if (data.length > 0 && !socket.is_closing) {
                    client_data_handler(socket, data, true).then(buffer => {
                        if(buffer.length > 0) socket.remote.write(buffer);
                    });
                }
            }
        });
        // add client to clients list
        server.clients.add(socket);
        // handle client connection event
        client_connection_handler(socket);
    });

    return server;
}

module.exports = mitm;