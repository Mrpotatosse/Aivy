const message_buffer = require('./../src/dofus/messages/buffer/message_buffer');

const current_buffer = new message_buffer(true);

const message = {
    __name: 'ChatClientMultiMessage',
    __instance_id: 1,
    channel: 0,
    content: 'test'
}

const write_buffer = current_buffer.parse_message(message);

console.log(write_buffer);

console.log(current_buffer.parse_data(write_buffer));