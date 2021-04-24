const wrapper_set_flag = (flag, offset, value) => {    
    return value ? (flag | (1 << offset)) : (flag & 255 - (1 << offset));
}

const wrapper_get_flag = (flag, offset) => {
    return (flag & (1 << offset)) != 0;
}

module.exports = {
    wrapper_set_flag,
    wrapper_get_flag
}