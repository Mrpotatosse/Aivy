const message_buffer = require('./buffer/message_buffer');
const data_writer = require('./buffer/data_writer');
const { dofus_message_handler } = require('./handlers/index');
const { decode } = require('./data/message_data');
const { dofus_reader, dofus_writer } = require('./../io/index');

const dofus_client_data_handler = async (socket, data, from_client) => {
    const socket_receiver = from_client ? socket : socket.remote;
    const result = socket_receiver.message_buffer.parse_data(data);

    const instance_writer = new dofus_writer(Buffer.from([]));

    for (let i = 0; i < result.length; i++) {
        const r = result[i];

        const message_data_parsed = decode(r.message_id, new dofus_reader(r.message_data_buffer));
        
        if(from_client){
            socket.last_instance_id = r.instance_id;
            socket.server_messages_count = 0;
            
            instance_writer.writeBytes(data_writer(r.message_id, socket.last_instance_id + socket.fake_message_created, r.message_data_buffer));
        }else{
            socket.server_messages_count++;
        }

        await dofus_message_handler(socket, {
            ...r,
            message_data_parsed: message_data_parsed
        });
    }

    if(from_client){// rewrite instance_id        
        return instance_writer.data();
    }
    
    return data;
}

const dofus_client_connected_handler = (socket) => {
    socket.message_buffer = new message_buffer(true);
    socket.remote.message_buffer = new message_buffer(false);

    socket.fake_message_created = 0;
    socket.last_instance_id = 0;
    socket.server_messages_count = 0;

    console.log('dofus client connected');
}

const dofus_client_closed_handler = (socket) => {
    console.log('dofus client closed');
}

module.exports = {
    dofus_client_connected_handler,
    dofus_client_closed_handler,
    dofus_client_data_handler,
}