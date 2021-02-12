const http = require('http');
const url = require('url');

let http_options = {
    host: '',
    port: 0
}

let server;

const setOptions = (options) => {
    http_options = {
        ...http_options,
        ...options
    };
}

const run = () => {
    server = http.createServer(request_listener).listen(http_options.port, http_options.host, () => {
        console.log(`http: http://${http_options.host}:${http_options.port}`)
    });
};

const request_listener = (request, result) => {
    switch(request.method){
        case 'GET': 
            const url_result = url.parse(request.url, true);
            const queries = url_result.query;
            switch(url_result.pathname){
                case '/ipredirect': 
                    console.log(`ip=${queries.ip} port=${queries.port} pid=${queries.pid}`);
                    
                    result.writeHead(200);
                    result.end();
                    break;
                default: 
                    result.writeHead(500);
                    result.end('Page not found');
                    break;
            }
        break;
        /*case 'POST': 
            result.writeHead(500);
            result.end('Page not found');
            break;*/
    }
};

module.exports = {
    setOptions: setOptions,
    run: run
}