const dofus_reader = require('../io/dofus_reader');
const dofus_writer = require('../io/dofus_writer');
const {d_messages, decode, encode } = require('./message_data');
class message_buffer {
    constructor(from_client){
        this.from_client = from_client;
        this.reader = new dofus_reader([]);
    }

    parse_message(){

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

            let instance_id = -1;
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
                    result.push({
                        from_client: this.from_client,
                        header: header,
                        static_header: static_header,
                        id: id,
                        instance_id: instance_id,
                        data_length: length,
                        header_data_blob: this.reader.data().slice(start_pos, this.reader.currentPosition() - length),
                        message_data_blob: message_data_blob,
                        message_data_parsed: message_data_parsed,
                        message_metadata: message_metadata
                    });
                }else{            
                    result = undefined;
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
    message_buffer: message_buffer
}