const indexRoute = require("./index");
const userRoute = require("./user");
const personRoute = require("./person");
const categoryRoute = require("./category");
const imageRoute = require("./image");
const reviewRoute = require("./review");
const tattooRoute = require("./tattoo");
const blogRoute = require("./blog");
const message = require("./message");
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
    app.use("/categories", categoryRoute);
    app.use("/images", imageRoute);
    app.use("/reviews", reviewRoute);
    app.use("/tattoos", tattooRoute);
    app.use("/or-fadida-blog", blogRoute);
    app.use("/messenger", message);
    app.use("/tests", testRoute);
    app.use((req, res) => {
      res.status(404).json({ msg: "404 page not found" })
    })
  }