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