const {createServer} = require('../src/server/mitm/index');

const server = createServer(() => {});

server.listen(5556);