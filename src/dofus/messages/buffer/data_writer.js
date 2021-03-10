const { dofus_writer } = require('./../../io/index');

const data_writer = (message_id, instance_id, data) => {
    const packet_stream = new dofus_writer([]);

    const data_len = data.length;

    const length_bytes_count =
        data_len > 0xFFFF ? 3 :
            (data_len > 0xFF ? 2 :
                (data_len > 0 ? 1 : 0));

    packet_stream.writeUnsignedShort((message_id << 2) | length_bytes_count);

    if (instance_id) {
        packet_stream.writeUnsignedInt(instance_id);
    }

    switch (length_bytes_count) {
        case 1: packet_stream.writeByte(data_len); break;
        case 2: packet_stream.writeShort(data_len); break;
        case 3:
            packet_stream.writeByte((data_len >> 16) & 255);
            packet_stream.writeShort(data_len & 0xFFFF); break;
    }

    packet_stream.writeBytes(data);
    return packet_stream.data();
}

module.exports = data_writer;