const custom_stream = require('./custom_stream');
/**
 * custom BigEndian reader class
 */
class custom_reader extends custom_stream{
    constructor(buffer){
        super(buffer);
    }
    /**
     * return BigEndian UnsignedByte 
     */
    readByte(){
        // get result
        const result = this.buffer.readUInt8(this.position);
        // increment position
        this.skip(1);
        // return result
        return result;
    }  
    /**
     * return BigEndian UnsignedBytesArray as Buffer
     * 
     * @param {Number} count 
     */
    readBytes(count){
        // return empty buffer if count <= 0
        if(count <= 0) return Buffer.from([]);
        // throw exception if not enough data to read
        if(count > this.remnantLength()) throw 'Not enough data to read';
        // create an empty array and map with this.readByte to increment pos
        return Buffer.from([...Array(count).keys()].map(_ => {
            return this.readByte();
        }));
    }
    
    readShort(){
        return this.readBytes(2).readInt16BE();
    }

    readUnsignedShort(){
        return this.readBytes(2).readUInt16BE();
    }

    readInt(){        
        return this.readBytes(4).readInt32BE();
    }

    readUnsignedInt(){        
        return this.readBytes(4).readUInt32BE();
    }

    readLong(){        
        return this.readBytes(8).readBigInt64BE();
    }

    readUnsignedLong(){        
        return this.readBytes(8).readBigUInt64BE();
    }

    readBoolean(){
        return this.readByte() == 1;
    }

    readDouble(){   
        return parseFloat(this.readBytes(8).readDoubleBE().toFixed(16));
    }

    readFloat(){
        return parseFloat(this.readBytes(4).readFloatBE().toFixed(8));
    }

    readUTF(){
        const length = this.readUnsignedShort();
        return new TextDecoder('utf-8').decode(this.readBytes(length));
    }
}

module.exports = custom_reader;