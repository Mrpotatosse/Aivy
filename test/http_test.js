const {run, setOptions} = require('../src/server/http/index');
const http = require('http');

setOptions({
    host: '127.0.0.1',
    port: 8000
});

run();

http.request({
    hostname: 'localhost',
    port: 8000,
    path: '/ipredirect?ip=127.0.0.1&port=443&pid=4567',
    method: 'GET'
}).end();
