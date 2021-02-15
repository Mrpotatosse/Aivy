const run_test = () => {
    // test
    //require('./dofus_io_test');

    // aivy init
    require('./parser_test'); // parse protocol
    require('./hook_test'); // hook 1 client
    require('./http_test'); // open http server
    require('./mitm_test'); // open mitm server
    require('./websocket_test');
}

run_test();