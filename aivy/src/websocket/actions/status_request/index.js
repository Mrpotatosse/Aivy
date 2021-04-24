module.exports = (socket, message) => {
    socket.send(JSON.stringify({
        result_type: 'status_result',
        value: {
            mitm: global.mitm_server?.isRunning
        }
    }));
};