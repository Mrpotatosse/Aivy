const { custom_stream_buffer } = require('./custom_stream_buffer');

const UINT16_MAX_VALUE = 0x10000;
const INT16_MAX_VALUE = 0x7FFF;

const MASK_10000000 = 0x80;
const MASK_01111111 = 0x7F;

class dofus_reader extends custom_stream_buffer{
    constructor(buffer){
        super(buffer);
    }    

    readByte(){
        const result = this.buffer[this.position]; // get result
        this.skip(1); // increment pos
        return result; // return result
    }

    readBytes(count){
        if(count <= 0) return [];
        if(count > this.remnant()) throw 'Not enough data to read'; 
        return [...Array(count).keys()].map(_ => {
            return this.readByte();
        });
    }

    readShort(){
        const bytes = this.readBytes(2);
        return Buffer.from(bytes).readInt16BE();
    }

    readUnsignedShort(){
        const bytes = this.readBytes(2);
        return Buffer.from(bytes).readUInt16BE();
    }

    readInt(){        
        const bytes = this.readBytes(4);
        return Buffer.from(bytes).readInt32BE();
    }

    readUnsignedInt(){        
        const bytes = this.readBytes(4);
        return Buffer.from(bytes).readUInt32BE();
    }

    readLong(){        
        const bytes = this.readBytes(8);
        return Buffer.from(bytes).readBigInt64BE();
    }

    readUnsignedLong(){        
        const bytes = this.readBytes(8);
        return Buffer.from(bytes).readBigUInt64BE();
    }

    readBoolean(){
        return this.readByte() == 1;
    }

    readDouble(){   
        const bytes = this.readBytes(8);
        return parseFloat(Buffer.from(bytes).readDoubleBE().toFixed(16));
    }

    readFloat(){
        const bytes = this.readBytes(4);
        return parseFloat(Buffer.from(bytes).readFloatBE().toFixed(8));
    }

    readUTF(){
        const length = this.readUnsignedShort();
        const bytes = this.readBytes(length);
        return new TextDecoder('utf-8').decode(new Uint8Array(bytes));
    }

    readVarShort(){
        let value = 0;
        let size = 0;
        while(size < 16){ 
            let b = this.readByte();
            let bit = (b & MASK_10000000) == MASK_10000000;
            if(size > 0) value = value | ((b & MASK_01111111) << size);
            else value = value | (b & MASK_01111111);
            size = size + 7;
            if(!bit) {
                if(value > INT16_MAX_VALUE) value = value - UINT16_MAX_VALUE;
                return value;
            }
        }

        throw "Too much data !";
    }

    readVarInt(){
        let value = 0;
        let size = 0;
        while(size < 32){ 
            let b = this.readByte();
            let bit = (b & MASK_10000000) == MASK_10000000;
            if(size > 0) value = value | ((b & MASK_01111111) << size);
            else value = value | (b & MASK_01111111);
            size = size + 7;
            if(!bit) {
                return value;
            }
        }

        throw "Too much data !";
    }

    readVarLong(){
        let low = 0;
        let high = 0;
        let size = 0;
        let lastByte = 0;
        while(size < 28){
            lastByte = this.readByte();
            if((lastByte & MASK_10000000) == MASK_10000000){
                low = low | ((lastByte & MASK_01111111) << size);
                size = size + 7;
            }else{
                low = low | (lastByte << size);
                return low;
            }
        }
        lastByte = this.readByte();
        if((lastByte & MASK_10000000) == MASK_10000000){
            low = low | ((lastByte & MASK_01111111) << size);
            high = (lastByte & MASK_01111111) >> size;
            size = 3;
            while(size < 32){
                lastByte = this.readByte();
                if((lastByte & MASK_10000000) == MASK_10000000){
                    high = high | ((lastByte & MASK_01111111) << size);
                }else break;
                size = size + 7;
            }
            high = high | (lastByte << size);
            return (low & 0xFFFFFFFF) | (high << 32);
        }
        low = low | (lastByte << size);
        high = lastByte >> 4;
        return (low & 0xFFFFFFFF) | (high << 32);
    }
}

module.exports = dofus_reader;