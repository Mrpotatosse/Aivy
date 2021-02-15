const package_json = require('./package.json');
const {hook_redirection_port, json_protocol_name} = require('./aivy_config.json');
const path = require('path');

console.log(`- - - Aivy (${package_json.version}) - - -`);
const argv = process.argv;

const process_path = argv[0];
const launch_path = argv[1];

const dofus_folder_path = argv[2];
const dofus_invoker_path = path.join(dofus_folder_path, 'DofusInvoker.swf');

const {parser} = require('./src/dofus/botofu_parser/index');
parser(dofus_invoker_path, json_protocol_name, _ => {
    const {hook, dofus, ws_server, mitm_server, http_server} = require('./index');

    const dofus_exe_path = path.join(dofus_folder_path, 'Dofus.exe');

    hook.spawn_and_hook(dofus_exe_path);
    http_server.run_http();
    mitm_server.create_MITM_server(dofus.messages.dofus_new_client_handler, dofus.messages.dofus_data_buffer_handler).listen(hook_redirection_port);
    ws_server.create_web_socket_server(ws_server.web_socket_handler);
}); // parse
