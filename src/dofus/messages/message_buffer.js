const dofus_reader = require('../io/dofus_reader');
const dofus_writer = require('../io/dofus_writer');
const {d_messages, decode, encode } = require('./message_data');

let last_message_instance_id = 0;
let server_message_count_since_last = 0;
let fake_message_created = 0;

const fake_message_instance_id = () => {
    return last_message_instance_id + server_message_count_since_last + fake_message_created;
}

const increase_fake_message = () => {
    fake_message_created++;
}

const decrease_fake_message = () => {
    fake_message_created--;
}

class message_buffer {
    constructor(from_client){
        this.from_client = from_client;
        this.reader = new dofus_reader([]);
    }

    parse_message(message){
        const packet_stream = new dofus_writer([]);        
        const metadata = d_messages.filter(v => v.name === message.__name).shift();   
        
        const data_stream = encode(metadata, message);
        const data_len = data_stream.length();

        const length_bytes_count = 
            data_len > 0xFFFF ? 3 :
            (data_len > 0xFF ? 2 :
            (data_len > 0 ? 1 : 0));
        
        const header = (metadata.protocolID << 2) | length_bytes_count;
        packet_stream.writeUnsignedShort(header);

        if(this.from_client){
            packet_stream.writeUnsignedInt(message.__instance_id);
        }

        switch(length_bytes_count){
            case 1: packet_stream.writeByte(data_len); break;
            case 2: packet_stream.writeShort(data_len); break;
            case 3: 
                packet_stream.writeByte((data_len >> 16) & 255);
                packet_stream.writeShort(data_len & 0xFFFF); break;
        }

        packet_stream.writeBytes(data_stream.data());
        return Buffer.from(packet_stream.data());
    }

    parse_data(data){
        this.reader.add([...data]);

        let result = [];
        let start_pos = 0;

        while(this.reader.currentPosition() < this.reader.length()){
            start_pos = this.reader.currentPosition();
            if(this.reader.remnant() < 2) break;

            const header = this.reader.readUnsignedShort();

            const static_header = header & 3;
            const id = header >> 2;

            let instance_id = undefined;
            if(this.from_client){
                instance_id = this.reader.readUnsignedInt();
            }

            if(this.reader.length() - this.reader.currentPosition() < static_header) {
                this.reader.setPosition(start_pos);
                break;                
            }

            let length = 0;
            for (let i = static_header - 1; i >= 0; i--)
            {
                length = length | (this.reader.readByte() << (i * 8));
            }

            if(length <= this.reader.remnant()){
                const message_metadata = d_messages.filter(m => m.protocolID === (id === 2262 ? 6253 /* RDM thx ankamouille */ : id)).shift();

                if(message_metadata){
                    const message_data_blob = this.reader.readBytes(length);
                    const message_data_parsed = decode(message_metadata, new dofus_reader(message_data_blob));
                    const header_data_blob_base = this.reader.data().slice(start_pos, this.reader.currentPosition() - length);

                    const header_data_blob_writer = new dofus_writer([]);
                    header_data_blob_writer.writeUnsignedShort(header);
                    if(this.from_client){
                        server_message_count_since_last = 0;
                        last_message_instance_id = instance_id;
                        header_data_blob_writer.writeUnsignedInt(fake_message_instance_id());// rewrite instance_id
                    }else{
                        server_message_count_since_last++;
                    }
                    const slice_start = 2 + (this.from_client ? 4 : 0);
                    header_data_blob_writer.writeBytes(header_data_blob_base.slice(slice_start, slice_start + static_header)); // rewrite length

                    result.push({
                        from_client: this.from_client,
                        header: header,
                        static_header: static_header,
                        id: id,
                        instance_id: instance_id,
                        data_length: length,
                        header_data_blob_base: header_data_blob_base,
                        new_header_data_blob: header_data_blob_writer.data(),
                        message_data_blob: message_data_blob,
                        message_data_parsed: message_data_parsed,
                        message_metadata: message_metadata
                    });                    
                }else{            
                    this.reader.skip(length);
                }

                const last_pos = this.reader.currentPosition();
                this.reader.clear(last_pos - start_pos);
            }
            else{
                this.reader.setPosition(start_pos);
                break;
            }
        }

        return result;
    }
}

module.exports = {
    message_buffer: message_buffer,
    fake_message_instance_id: fake_message_instance_id,
    increase_fake_message: increase_fake_message,
    decrease_fake_message: decrease_fake_message
}