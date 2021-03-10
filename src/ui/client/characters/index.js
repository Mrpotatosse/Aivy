const parse_args = _ => {
    const location_splitted = window.location.href.split('?');

    const args = location_splitted[1];
    const args_splitted = args.split('&');
    
    const args_obj = {};

    args_splitted.forEach(arg_s => {
        const arg = arg_s.split('=');
        args_obj[arg[0]] = arg[1];
    });

    return args_obj;
}

const init_from_arg = arg_obj => {
    const id_s = arg_obj.id.split('_');

    const name = id_s[0];
    const id = parseInt(id_s[1]);

    
}

init_from_arg(parse_args(window.location.href));