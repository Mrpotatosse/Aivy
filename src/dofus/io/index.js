const dofus_writer = require('./stream/dofus_writer');
const dofus_reader = require('./stream/dofus_reader');
const {wrapper_get_flag, wrapper_set_flag} = require('./stream/boolean_wrapper');

module.exports = {
    dofus_writer,
    dofus_reader,
    
    wrapper_get_flag,
    wrapper_set_flag
}