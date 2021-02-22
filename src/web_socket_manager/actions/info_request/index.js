const {getRunner} = require('./../../../../runner');

const execute = (socket, _) => {
    const mitm = getRunner()['mitm'];

    const data_snd = [...mitm.clients].filter(x => x.dofus_informations).map(x => {
        return {    
            process_id: x.process_id,
            dofus_informations: x.dofus_informations
        };
    });

    const result = {
        result_type: 'info_result',
        result_data: data_snd
    };

    socket.send(JSON.stringify(result));
}

module.exports = execute;