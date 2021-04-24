const fs = require('fs');
const path = require('path');

module.exports = (socket, message) => {
    const option_path = path.join(__dirname, './option.json');
    const option = JSON.parse(fs.readFileSync(option_path).toString());

    // save current option in global, idk if that's a good idea
    global.AIVY_OPTION = option;

    socket.send(JSON.stringify({
        result_type: 'option_result',
        value: option
    }));
};