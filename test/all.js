const run_test = () => {
    require('./dofus_io_test');
    require('./parser_test');
    require('./hook_test');
    //require('./http_test');
    require('./mitm_test');
}

run_test();