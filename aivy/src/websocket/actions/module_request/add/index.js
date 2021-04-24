const fs = require('fs');
const path = require('path');

module.exports = (socket, message) => {
    const modulePath = path.join(__dirname, './../modules.json');
    const current_modules = JSON.parse(fs.readFileSync(modulePath).toString());
    const current_mod = current_modules.find(x => x.id === message.value.id);
    const new_mod = {
        ...current_mod,
        ...message.value
    };

    const value = [...current_modules.filter(x => !message.value.id || x.id !== message.value.id), new_mod];

    fs.writeFileSync(modulePath, JSON.stringify(value, null, '\t'));

    socket.send(JSON.stringify({
        result_type: 'module_result',
        value
    }));
};