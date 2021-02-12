const {spawn_and_hook, setOptions} = require('../src/hook/index');

setOptions({
    port: 5556
});

spawn_and_hook('D:\\ANKAMA_DOFUS\\Dofus.exe');