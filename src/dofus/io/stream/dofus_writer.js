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