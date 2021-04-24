const { dofus_reader } = require('./../../../io/index');

class buffer_reader {
    constructor(from_client) {
        this.from_client = from_client;
        this.reader = new dofus_reader(Buffer.from([]));
    }

    parse_data(buffer) {
        this.reader.add(buffer);

        const result = [];

        while (this.reader.currentPosition() < this.reader.remnantLength()) {
            const data = this.reader.readBytes(this.reader.remnantLength());
            const tmp_reader = new dofus_reader(data);
            this.reader.clear();

            if (data.length < 2) {
                this.reader.add(data);
                break;
            }

            const header = tmp_reader.readUnsignedShort();

            const static_header = header & 3;
            const message_id = ((header >> 2) === 2262) ? 6253 : (header >> 2);

            const instance_id = this.from_client ? tmp_reader.readUnsignedInt() : undefined;

            if (tmp_reader.remnantLength() < static_header) {
                this.reader.add(data);
                break;
            }

            let length = 0;
            for (let i = static_header - 1; i >= 0; i--) {
                length = length | (tmp_reader.readByte() << (i * 8));
            }
            
            if (length <= tmp_reader.remnantLength()) {
                result.push({
                    from_client: this.from_client,
                    message_id,
                    header,
                    static_header,
                    instance_id,
                    message_data_buffer: tmp_reader.readBytes(length)
                });

                const remnant_length = tmp_reader.remnantLength();
                const remnant_data = tmp_reader.readBytes(remnant_length);
                if (remnant_length > 0) this.reader.add(remnant_data);
            } else {
                this.reader.add(data);
                break;
            }
        }

        return result;
    }
}

module.exports = buffer_reader;