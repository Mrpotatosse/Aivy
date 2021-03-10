/*const websocket = require('./../src/server/websocket/index');

const serv = websocket(
socket => {
    console.log('ws_client connected');
},
message => {
    console.log(message);
},
_ => console.log('ws_client leaved'),
error => console.error(error), 
{
    host: 'localhost',
    port: 4443
});
*/

const open_ws = require('./../src/ui/server/ws/index');

open_ws({
    host: 'localhost',
    port: 4443
});
