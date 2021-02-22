let runner = {};

const setRunner = (name, value) => {
    runner[name] = value;
}

const getRunner = _ => {
    return runner;
}

module.exports = {
    setRunner: setRunner,
    getRunner: getRunner
}