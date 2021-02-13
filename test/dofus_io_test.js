const dofus_reader = require('../src/dofus/io/dofus_reader');
const dofus_writer = require('../src/dofus/io/dofus_writer');

const test_value = {
    byte: 43,
    bytes: [55,6,245,33,69,98,77,145,66,1,12],
    short: 666,
    ushort: 32000,
    int: 666666,
    uint: 66451623,
    long: 999999994256n,
    ulong: 123456789321n,
    double: 0.3333333,
    float: 0.1234,
    bool: true,
    varshort: 3214,
    varint: 666651,
    varlong: 999888777
}

const writer = new dofus_writer([]);
    writer.writeByte(test_value.byte);
    writer.writeBytes(test_value.bytes);
    writer.writeShort(test_value.short);
    writer.writeUnsignedShort(test_value.ushort);
    writer.writeInt(test_value.int);
    writer.writeUnsignedInt(test_value.uint);
    writer.writeLong(test_value.long);
    writer.writeUnsignedLong(test_value.ulong);
    writer.writeDouble(test_value.double);
    writer.writeFloat(test_value.float);
    writer.writeBoolean(test_value.bool);
    writer.writeVarShort(test_value.varshort);
    writer.writeVarInt(test_value.varint);
    writer.writeVarLong(test_value.varlong);

const reader = new dofus_reader(writer.data());
    console.assert(reader.readByte() === test_value.byte, `write/readByte error - expected value : ${test_value.byte}`);
    console.assert(reader.readBytes(test_value.bytes.length).toString() === test_value.bytes.toString(), `write/readByte error - expected value : ${test_value.bytes}`);
    console.assert(reader.readShort() === test_value.short, `write/readShort error - expected value : ${test_value.short}`);
    console.assert(reader.readUnsignedShort() === test_value.ushort, `write/readUnsignedShort error - expected value : ${test_value.ushort}`);
    console.assert(reader.readInt() === test_value.int, `write/readInt error - expected value : ${test_value.int}`);
    console.assert(reader.readUnsignedInt() === test_value.uint, `write/readUnsignedInt error - expected value : ${test_value.uint}`);
    console.assert(reader.readLong() === test_value.long, `write/readLong error - expected value : ${test_value.long}`);
    console.assert(reader.readUnsignedLong() === test_value.ulong, `write/readUnsignedLong error - expected value : ${test_value.ulong}`);
    console.assert(reader.readDouble() === test_value.double, `write/readDouble error - expected value : ${test_value.double}`);
    console.assert(reader.readFloat() === test_value.float, `write/readFloat error - expected value : ${test_value.float}`);
    console.assert(reader.readBoolean() === test_value.bool, `write/readBoolean error - expected value : ${test_value.bool}`);
    console.assert(reader.readVarShort() === test_value.varshort, `write/readVarInt error - expected value : ${test_value.varshort}`);
    console.assert(reader.readVarInt() === test_value.varint, `write/readVarShort error - expected value : ${test_value.varint}`);
    console.assert(reader.readVarLong() === test_value.varlong, `write/readVarLong error - expected value : ${test_value.varlong}`);

console.log('io test completed');