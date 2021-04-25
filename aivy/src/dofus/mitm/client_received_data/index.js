const { dofus_reader, dofus_writer } = require('../../io');
const {dofus_message_handler} = require('./../../messages/handler');
const {decode} = require('./../../messages/data');
const buffer_writer = require('./../../messages/buffer/writer');

module.exports = async (socket, data, from_client) => {
    const receiver_socket = from_client ? socket : socket.remote;
    const result = receiver_socket.buffer_reader.parse_data(data);

    const instance_rewriter = new dofus_writer([]);
    
    for(let i = 0;i<result.length;i++){
        const r = result[i];
        const message_data_parsed = decode(r.message_id, new dofus_reader(r.message_data_buffer));
        
        if(from_client){
            socket.last_packet_instance_id = r.instance_id ? r.instance_id : 0;
            socket.server_messages_count_since_client = 0;
            
            const new_data = new buffer_writer(from_client).parse_message({
                message_id: r.message_id,
                instance_id: socket.last_packet_instance_id + socket.fake_message_created,
                data: r.message_data_buffer
            });
            
            instance_rewriter.writeBytes(new_data);
        }else{
            socket.server_messages_count_since_client++;
        }
    
        await dofus_message_handler(socket, {
            ...r,
            message_data_parsed
        });
    }   

    if(from_client){
        return instance_rewriter.data();
    }

    return data;
};