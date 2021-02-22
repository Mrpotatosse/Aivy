const exec = require('child_process').exec;

//const pid = process.argv[2];

const PIDCheckingIntervalle = [];

const isPIDRunning = (query, fn) => {
    let platform = process.platform;
    let cmd = '';

    if(isNaN(query)) {
        fn(false);
        return;
    }

    switch (platform) {
        case 'awin64':
        case 'win32': cmd = `tasklist /fi "pid eq ${query}`; break;
        case 'darwin': 
        case 'linux' : cmd = `ps -p ${query}`; break;
        default: break;
    }

    exec(cmd, (_, stdout, __) => {
        fn(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1)
    });
}

const add_on_pid_closed = (pid, fn) => {
    const interval = setInterval(() => {
        isPIDRunning(`${pid}`, status => {
            if(!status){
                fn();
                clearInterval(interval);
            }
        });
    }, 1000);

    const pid_event = {
        pid, 
        interval
    };

    PIDCheckingIntervalle.push(pid_event);
} 



/*isPIDRunning(pid, (status) => {
    console.log(status); // true|false
})*/