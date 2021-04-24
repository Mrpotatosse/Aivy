const fs = require('fs');
const path = require('path');

module.exports = (socket, message) => {
    const modulePath = path.join(__dirname, './modules.json');
    const value = JSON.parse(fs.readFileSync(modulePath).toString());

    socket.send(JSON.stringify({
        result_type: 'module_result',
        value
    }));
};