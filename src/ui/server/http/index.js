const http = require('./../../../server/http/index');
const fs = require('fs');
const util = require('util');
const path = require('path');

const readFile = util.promisify(fs.readFile);

const get_extension = url => {
    let extension = url.split('.').pop();
    switch (extension) {
        case 'ico':
        case 'png': 
        case 'jpeg': 
        case 'gif': extension = 'image/' + extension; break;
        case 'js': extension = 'text/javascript'; break;
        case 'json': extension = 'application/json'; break;
        default: extension = 'text/' + extension; break;
    }
    return extension;
}

const read_file = async (location, content_type, response) => {
    try {
        const location_without_args = location.split('?').shift();

        if (location_without_args !== location) {
            content_type = get_extension(location_without_args);
        }

        const full_path = path.join(__dirname, `./../../client/${location_without_args}`);
        const file_content = await readFile(full_path, { encoding: 'utf-8' });

        response.setHeader('Content-type', content_type);
        response.end(file_content);
    } catch {
        response.setHeader('Content-type', 'text/html');
        response.end(await readFile(path.join(__dirname, './../../client/page_not_found.html'), { encoding: 'utf-8' }));
    }
}

const init_http_get = server => {
    server.get('/index', async (_, response) => {
        await read_file('/index.html', 'text/html', response);
    });

    server.get('*', async (request, response) => {
        const extension = get_extension(request.url);
        await read_file(request.url.substr(1, request.url.length), extension, response);
    });
}

const open_http = (port, callback) => {
    const server = http();
    init_http_get(server);

    server.listen(port, callback);
    return server;
}

module.exports = open_http;