/*const http = require('./../src/server/http/index');

const port = 8080;
const http_server = http();

const init_http_get = server => {
    server.get('/dofus_protocol.json', async (request, response) => {
        response.setHeader('Content-type', 'application/json');
        response.end(JSON.stringify({
            messages: [],
            types: []
        }));
    });
}

init_http_get(http_server);

http_server.listen(port, _ => {
    console.log(`http_server: http://localhost:${port}/`);
});*/
const open_http = require('./../src/ui/server/http/index');

const port = 8080;
open_http(port,  _ => {
    console.log(`http_server: http://localhost:${port}/`);
});