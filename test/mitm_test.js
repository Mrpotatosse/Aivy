const {createMITMServer} = require('../src/server/mitm/index');
const server = createMITMServer((data, from_client) => {
    console.log(from_client ? '[client]' : '[server]', data);
    return data;
});
server.listen(5555);