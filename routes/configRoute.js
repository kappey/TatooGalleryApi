const indexRoute = require("./index");
const userRoute = require("./user");
const personRoute = require("./person");
const categoryRoute = require("./category");
const imageRoute = require("./image");
const reviewRoute = require("./review");
const tatooRoute = require("./tatoo");
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
    app.use("/person", personRoute);
    app.use("/user", userRoute);
    app.use("/category", categoryRoute);
    app.use("/image", imageRoute);
    app.use("/review", reviewRoute);
    app.use("/tatoo", tatooRoute);
    app.use("/test", testRoute);
    app.use((req, res) => {
      res.status(404).json({ msg: "404 page not found" })
    })
  }