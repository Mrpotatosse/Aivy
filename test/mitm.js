const mitm = require('./../src/server/mitm/index');

const mitm_server = mitm(_ => console.log('server listening'),
                         _ => console.log('server closed'),
                         error => console.error(error),
                         socket => console.log('new client connected to server'),
                         (socket, data, from_client) => {
                             console.log(data);
                             return data;
                         },
                         socket => console.log('client closed'));

mitm_server.listen(5555);