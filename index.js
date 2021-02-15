'use strict';

const package_json = require('./package.json');
const aivy_config = require('./aivy_config.json');

const {spawn_and_hook, hook, hook_options, set_hook_options} = require('./src/hook/index');

set_hook_options({
    redirection_port: aivy_config.hook_redirection_port
});

const {run_http, set_http_options} = require('./src/server/http');

set_http_options({
    host: aivy_config.http_server_host,
    port: aivy_config.http_server_port
});

const {create_MITM_server} = require('./src/server/mitm');
const {create_web_socket_server, set_web_socket_options, web_socket_options} = require('./src/server/web_socket');
const {web_socket_handler} = require('./src/web_socket_manager/index');

set_web_socket_options({
    host: aivy_config.web_socket_server_host,
    port: aivy_config.web_socket_server_port
});

const {parser} = require('./src/dofus/botofu_parser/index');
const dofus_writer = require('./src/dofus/io/dofus_writer');
const dofus_reader = require('./src/dofus/io/dofus_reader');
const {custom_stream_buffer, bbw_get_flag, bbw_set_flag} = require('./src/dofus/io/custom_stream_buffer');
const {message_buffer} = require('./src/dofus/messages/message_buffer');
const {encode, decode} = require('./src/dofus/messages/message_data');
const {dofus_message_handler, d2handler_class, add_handler, remove_handler} = require('./src/dofus/messages/message_handler');
const {dofus_data_buffer_handler, dofus_new_client_handler} = require('./src/dofus/messages/index');

module.exports = {
    hook: {
        spawn_and_hook, 
        hook, 
        set_hook_options,
        hook_options
    },
    http_server:{
        run_http,
        set_http_options
    },
    mitm_server:{
        create_MITM_server
    },
    ws_server:{
        create_web_socket_server,
        set_web_socket_options,
        web_socket_options,

        web_socket_handler
    },
    dofus:{
        parser: parser,
        io:{
            dofus_writer,
            dofus_reader,
            custom_stream_buffer,
            bbw_get_flag,
            bbw_set_flag
        },
        messages:{
            message_buffer,
            encode,
            decode,

            dofus_data_buffer_handler,
            dofus_new_client_handler,

            dofus_message_handler,
            d2handler_class, 
            add_handler,
            remove_handler            
        }
    },
    package_informations: package_json
}