const express = require('express');
const bodyParser = require('body-parser');
const { set_ip_information, get_ip_information } = require('./ipredirect');

let http_options = {
    host: 'localhost',
    port: 8000
}

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

server.post('/setipredirect', (request, response) => {
    const ip_information = {
        ip: request.body.ip,
        port: request.body.port,
        pid: request.body.pid
    }

    set_ip_information(ip_information);
    response.end();
});

server.post('/getipredirect', (request, response) => {
    const ip = get_ip_information();
    response.end(JSON.stringify(ip));
});

const run = () => {
    server.listen(http_options.port, () => {
        console.log(`http: http://${http_options.host}:${http_options.port}`)
    });
};

module.exports = {
    set_http_options: set_http_options,
    run: run
}