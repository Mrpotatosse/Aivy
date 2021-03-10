const init_player = require('./players');

const execute = (socket, message) => {
    init_player(socket);
}

module.exports = execute;