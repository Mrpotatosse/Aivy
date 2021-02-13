const { custom_stream_buffer } = require('./custom_stream_buffer');

const UINT16_MAX_VALUE = 0x10000;
const INT16_MAX_VALUE = 0x7FFF;

const MASK_10000000 = 0x80;
const MASK_01111111 = 0x7F;

class dofus_writer extends custom_stream_buffer{
    constructor(buffer){
        super(buffer);
    }

    writeByte(value){
        this.buffer[this.position] = value;// write value
        this.skip(1); // increment pos
    }

    writeBytes(value){
        value.forEach(v => this.writeByte(v));
    }

    writeShort(value){
        const buf = Buffer.allocUnsafe(2);
        buf.writeInt16BE(value);
        this.writeBytes([...buf]);
    }

    writeUnsignedShort(value){
        const buf = Buffer.allocUnsafe(2);
        buf.writeUInt16BE(value);
        this.writeBytes([...buf]);
    }

    writeInt(value){        
        const buf = Buffer.allocUnsafe(4);
        buf.writeInt32BE(value);
        this.writeBytes([...buf]);
    }

    writeUnsignedInt(value){        
        const buf = Buffer.allocUnsafe(4);
        buf.writeUInt32BE(value);
        this.writeBytes([...buf]);
    }

    writeLong(value){        
        const buf = Buffer.allocUnsafe(8);
        buf.writeBigInt64BE(BigInt(value));
        this.writeBytes([...buf]);
    }

    writeUnsignedLong(value){        
        const buf = Buffer.allocUnsafe(8);
        buf.writeBigUInt64BE(BigInt(value));
        this.writeBytes([...buf]);
    }

    writeBoolean(value){
        if(value) this.writeByte(1);
        else this.writeByte(0);
    }

    writeDouble(value){   
        const buf = Buffer.allocUnsafe(8);
        buf.writeDoubleBE(value);
        this.writeBytes([...buf]);
    }

    writeFloat(value){
        const buf = Buffer.allocUnsafe(4);
        buf.writeFloatBE(value);
        this.writeBytes([...buf]);
    }

    writeUTF(value){
        const bytes = new TextEncoder('utf-8').encode(value);
        this.writeUnsignedShort(bytes.length);
        this.writeBytes(bytes);
    }

    writeVarShort(value){
        if(value <= MASK_01111111){
            this.writeByte(value);
        }else{
            let i = 0;
            while(value !== 0){
                let b = value & MASK_01111111;
                i = i + 1;
                value = value >> 7;
                if(value > 0){
                    b = b | MASK_10000000;
                }
                this.writeByte(b);
            }
        }
    }

    // same as writeVarShort can juste do this :
    // writeVarInt(value){
    //  this.writevarShort(value);
    // }
    writeVarInt(value){
        if(value <= MASK_01111111){
            this.writeByte(value);
        }else{
            let i = 0;
            while(value !== 0){
                let b = value & MASK_01111111;
                i = i + 1;
                value = value >> 7;
                if(value > 0){
                    b = b | MASK_10000000;
                }
                this.writeByte(b);
            }
        }
    }

    writeVarLong(value){
        if(value >> 32 === 0){
            this.writeVarInt(value);
        }else{
            let low = value & 0xFFFFFFFF;
            let high = value >> 32;
            for(let i = 0; i < 4;i++){
                this.writeByte(low & MASK_01111111 | MASK_10000000);
                low = low >> 7;
            }
            if((high & 0xFFFFFFF8) === 0){
                this.writeByte(high << 4 | low);
            }else{
                this.writeByte((high << 4 | low) & MASK_01111111 | MASK_10000000);
                high = high >> 3;
                while(high >= MASK_10000000){
                    this.writeByte(high & MASK_01111111 | MASK_10000000);
                    high = high >> 7;
                }
                this.writeByte(high);
            }
        }
    }
}

module.exports = dofus_writer;