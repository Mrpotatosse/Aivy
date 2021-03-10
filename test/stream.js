const {custom_stream, custom_reader, custom_writer} = require('./../src/io/index');

const test_stability = _ => {
    const len = 100000;
    console.log('writer');
    const writer = new custom_writer(Buffer.from([]));
    for(let i = 0;i<len;i++) writer.writeLong(955656);
        
    console.log('reader');
    const reader = new custom_reader(writer.data());
    for(let i = 0;i<len;i++) reader.readLong();
        
    console.log('stream');
    const stream = new custom_stream(Buffer.from([]));
    for(let i = 0;i<len;i++) stream.add(Buffer.from([255,255,255,255,255,255,255,255])); 
    
    stream.clear();
    console.log('stream test ended');
}

const test_reader = _ => {
    const add_len = 100000;
    const reader = new custom_reader(Buffer.from([]));
    for(let i = 0;i<add_len;i++) reader.add(Buffer.from([1,2,3,4]));
    console.log(reader);
    for(let i = 0;i<add_len;i++) reader.readInt();
    console.log(reader);
}

test_stability();
test_reader();