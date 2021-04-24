const {custom_reader} = require('./../../../io/index');

const UINT16_MAX_VALUE = 0x10000;
const INT16_MAX_VALUE = 0x7FFF;

const MASK_10000000 = 0x80;
const MASK_01111111 = 0x7F;

class dofus_reader extends custom_reader{
    constructor(buffer){
        super(buffer);
    }

    readVarShort(){
        let value = 0;
        let size = 0;
        while(size < 16){ 
            let b = this.readByte();
            let bit = (b & MASK_10000000) === MASK_10000000;
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
            let bit = (b & MASK_10000000) === MASK_10000000;
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
        while(true){
            lastByte = this.readByte();
            if(size === 28){
                break;
            }
            if(lastByte >= 128){
                low = low | (lastByte & 127) << size;
                size += 7;
                continue;
            }
            low = low | lastByte << size;
            return low;
        }
        if(lastByte >= 128){
            lastByte = lastByte & 127;
            low = low | lastByte << size;
            high = lastByte >>> 4;
            size = 3;
            while(true){
                lastByte = this.readByte();
                if(size < 32){
                    if(lastByte >= 128){
                        high = high | (lastByte & 127) << size;
                    }else{
                        break;
                    }
                }
                size += 7;
            }
            high = high | lastByte << size;
            return (high * 4294967296) + low;
        }

        low = low | lastByte << size;
        high = lastByte >>> 4;
        return (high * 4294967296) + low;
    }
}

module.exports = dofus_reader;