/**
 * Custom stream class that contains
 */
class custom_stream{
    /**
     * 
     * @param {Buffer} buffer 
     */
    constructor(buffer){
        this.init(buffer);
    }
    /**
     * init function
     * 
     * @param {Buffer} buffer 
     */
    init(buffer){
        // init buffer
        this.buffer = Buffer.from([...buffer, ...Buffer.alloc(10000, 0)]);
        // init position
        this.position = 0;
        // init last position
        this.last_position = buffer.length;
    }

    /**
     * return position + count
     * 
     * @param {Number} count 
     */
    skip(count){
        this.position = this.position + count;
    }
    /**
     * return this.buffer sliced from position to end
     */
    remnantData(){
        return this.buffer.slice(this.position, this.remnantLength());
    }
    /**
     * return buffer length - position
     */
    remnantLength(){
        return this.last_position - this.position;
    }
    /**
     * return used buffer length
     */
    dataLength(){
        return this.last_position;
    }
    /**
     * return buffer length
     */
    length(){
        return this.buffer.length;
    }
    /**
     * create new buffer from spreading current buffer and adding buffer
     * 
     * @param  {Buffer} buffer 
     */
    add(buffer){
        // check if there's more space
        const cond1 = this.last_position > this.length();
        // check if there's more space to add new data
        const cond2 = this.last_position + buffer.length >= this.length();
        if(cond1 || cond2){
            // increase space 
            this.buffer = Buffer.from([...this.buffer, ...Buffer.alloc((this.length() * 2) + buffer.length, 0)]);
        }
        buffer.forEach(byte => {
            // add new data
            this.buffer.writeUInt8(byte, this.last_position);
            // increment last position
            this.last_position += 1;
        });
    }
    /**
     * return current buffer
     */
    data(){
        return this.buffer.slice(0, this.last_position);
    }
    /**
     * remove all vallue before count and reinitiliaze position 
     * 
     * @param {Number} count 
     */
    clear(count=undefined){
        // check clear all condition
        if(count === undefined || count < 0 || count >= this.length()){
            // clear all
            this.init(Buffer.from([]));
        }else{
            // save buffer
            const save = this.remnantData().slice(count);
            // slice
            this.init(Buffer.from([]));
            // add saved buffer
            this.add(save);
        }
    }
    /**
     * return position
     */
    currentPosition(){
        return this.position;
    }
    /**
     * set position
     * 
     * @param {Number} position 
     */
    setPosition(position){        
        // check if out of bounds
        if(position < 0 || position >= this.length()) throw 'Position is out of bounds';
        this.position = position;
    }
}

module.exports = custom_stream;