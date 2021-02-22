/**
 * THIS WAS ONLY FOR TEST
 * 
 * 
 * 
 * 
 */
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const util = require('util');
const path = require('path');
const url = require('url');

const readFile = util.promisify(fs.readFile);

let http_options = {
    host: 'localhost',
    port: 8000
}

const base_url = `http://${http_options.host}:${http_options.port}/`;

const set_http_options = (options) => {
    http_options = {
        ...http_options,
        ...options
    };
}

const server = express();
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(bodyParser.raw());

server.get('/', (_, response) => {
    response.redirect(`${base_url}index`);
});

server.get('/home', async (_, response) => {
    response.redirect(`${base_url}index`);
});

server.get('/index', (_, response) => {
    read_file('index.html', 'text/html', response);
});

server.get('*', (request, response) => {
    let extension = request.url.split('.').pop();
    switch(extension){
        case 'js': extension = 'javascript'; break;
    }
    read_file(request.url.substr(1, request.url.length), 'text/' + extension, response);
});

/**
 * local from ui folder
 */
const read_file = async (location, content_type, response) => {
    try{
        const full_path = path.join(__dirname, `../../ui/${location}`);
        const file_content = await readFile(full_path, {encoding: 'utf-8'}); 
        response.setHeader('Content-type', content_type);
        response.end(file_content);
    }catch{ 
        response.setHeader('Content-type', 'text/html');
        response.end(await readFile(path.join(__dirname, '../../ui/page_not_found.html'), {encoding: 'utf-8'}));
    }
}

const run_http = () => {
    server.listen(http_options.port, () => {
        console.log(`http: ${base_url}`)
    });
};

module.exports = {
    set_http_options: set_http_options,
    run_http: run_http
}