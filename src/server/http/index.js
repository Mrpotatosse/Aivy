const express = require('express');
const {urlencoded, json, raw} = require('body-parser');

const http = () => {
    const server = express();

    server.use(urlencoded({ extended: true }));
    server.use(json());
    server.use(raw());

    const get_server_url = request => {
        return `${request.protocol}://${request.get('host')}`;
    }

    server.get('/', async (request, response) => {  
        response.redirect(`${get_server_url(request)}/index`);
    });
    
    server.get('/home', async (request, response) => {
        response.redirect(`${get_server_url(request)}/index`);
    });

    return server;
}

module.exports = http;