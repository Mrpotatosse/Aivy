const init_dofus_event = _ => {
    require('./actor_event/index');
}

const events_manager = {
    character_selected_success_event: []
}

const set_event = (name, fn) => {
    if(!events_manager[name]) events_manager[name] = [fn];
    else events_manager[name].push(fn); 
}

const get_event = name => {
    return events_manager[name];
}

module.exports = {
    init_dofus_event,
    set_event,
    get_event
};
