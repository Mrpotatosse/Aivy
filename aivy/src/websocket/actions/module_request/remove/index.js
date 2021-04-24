const fs = require('fs');
const path = require('path');

module.exports = (socket, message) => {
    const modulePath = path.join(__dirname, './../modules.json');
    const value = JSON.parse(fs.readFileSync(modulePath).toString()).filter(x => x.id !== message.value);

    fs.writeFileSync(modulePath, JSON.stringify(value, null, '\t'));

    socket.send(JSON.stringify({
        result_type: 'module_result',
        value
    }));
};