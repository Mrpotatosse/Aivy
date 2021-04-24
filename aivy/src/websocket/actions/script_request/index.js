const fs = require('fs');
const path = require('path');

module.exports = (socket, message) => {
    const modulePath = path.join(__dirname, './customs');
    const scripts = fs.readdirSync(modulePath).filter(x => x.endsWith('.js'));
    socket.send(JSON.stringify({
        result_type: 'script_result',
        value: scripts.map((value => {
            const filePath = path.join(__dirname, path.join('./customs', value));

            return {
                name: value,
                value: fs.readFileSync(filePath).toString()
            };
        }))
    }));
};