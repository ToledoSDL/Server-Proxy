const proxy = require("redbird")({ port: 80 });
proxy.register("hws.ltoledo.dev", "http://localhost:3000");
proxy.register("toledocontab.ltoledo.dev", "http://localhost:3001");
