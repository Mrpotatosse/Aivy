class custom_stream_buffer {
    constructor(buffer){
        this.buffer = buffer;
        this.position = 0;
    }

    skip(count){
        this.position = this.position + count;
    }

    remnant(){
        return this.buffer.length - this.position;
    }

    length(){
        return this.buffer.length;
    }

    add(buffer){
        this.buffer = [...this.buffer, ...buffer];
    }

    data(){
        return this.buffer;
    }

    clear(count=undefined){
        if(count === undefined || count < 0){
            this.buffer = [];
        }else{
            this.buffer = this.buffer.slice(count);
        }
        this.position = 0;
    }

    currentPosition(){
        return this.position;
    }

    setPosition(position){
        if(position < 0 || position >= this.length()) throw 'Position is out of buffer';
        this.position = position;
    }
}

const wrapper_set_flag = (flag, offset, value) => {    
    return value ? (flag | (1 << offset)) : (flag & 255 - (1 << offset));
}

const wrapper_get_flag = (flag, offset) => {
    return (flag & (1 << offset)) != 0;
}

module.exports = {
    custom_stream_buffer: custom_stream_buffer,
    bbw_set_flag: wrapper_set_flag,
    bbw_get_flag: wrapper_get_flag
};