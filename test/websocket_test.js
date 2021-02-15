const {create_web_socket_server} = require('../src/server/web_socket/index');
const {web_socket_handler} = require('../src/web_socket_manager/index');

create_web_socket_server(web_socket_handler);