const moduleAlias = require("module-alias");

if (process.env.MODE === "debug") {
  moduleAlias.addAlias("app", __dirname + "/../src");
} else {
  moduleAlias.addAlias("app", __dirname + "/../build");
}


moduleAlias();