const buffer_reader = require('./../../messages/buffer/reader');

module.exports = socket => {
    console.log(`[Dofus MITM] client${socket.remoteAddress}:${socket.remotePort} connected`);

    socket.buffer_reader = new buffer_reader(true);

    socket.remote.buffer_reader = new buffer_reader(false);

    socket.last_packet_instance_id = 0;
    socket.server_messages_count_since_client = 0;
    socket.fake_message_created = 0;

    socket.get_current_instance_id = _ => {
        return socket.last_packet_instance_id + socket.server_messages_count_since_client + socket.fake_message_created;
    };
};