const {custom_writer} = require('./../../../io/index');

const MASK_10000000 = 0x80;
const MASK_01111111 = 0x7F;

class dofus_writer extends custom_writer{
    constructor(buffer){
        super(buffer);
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
        const writeInt32 = (value) => {
            while(value >= 128){
                this.writeByte(value & 127 | 128);
                value = value >>> 7;
            }
            this.writeByte(value);
        }

        let low = value;
        let high = parseInt(Math.floor(value / 4294967296));
        let size = 0;
        if(high === 0){
            writeInt32(low);
        }else{
            for(size = 0;size < 4; size++){
                this.writeByte(low & 127 | 128);
                low = low >>> 7;
            }
            if((high & 268435455 << 3) === 0){
                this.writeByte(high << 4 | low);
            }else{
                this.writeByte((high << 4 | low) & 127 | 128);
                writeInt32(high >>> 3); 
            }
        }
    }
}

module.exports = dofus_writer;