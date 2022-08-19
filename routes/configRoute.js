const indexRoute = require("./index");
const userRoute = require("./users");
const personRoute = require("./persons");
const testRoute = require("./test");

exports.corsAccessControl = (app) => {
    app.all('*', (req, res, next) => {
      if (!req.get('Origin')) return next();
      res.set('Access-Control-Allow-Origin', '*');
      res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
      res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,auth-token');
      next();
    });
  }

  exports.routesInit = (app) => {
    app.use("/", indexRoute);
    app.use("/persons", personRoute);
    app.use("/users", userRoute);
    app.use("/test", testRoute);
  
    app.use((req, res) => {
      res.status(404).json({ msg: "404 page not found" })
    })
  }