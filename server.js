const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const session = require("express-session");

const sequelize = require("./config/connection");
const routes = require("./controllers");
const helpers = require("./utils/helpers");

const app = express();
const PORT = process.env.PORT || 3001;
const hbs = exphbs.create({ helpers });
const sequelizeStore = require("connect-session-sequelize")(session.Store);

const sess = {
  secret: "Super secret secret",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new sequelizeStore({
    db: sequelize,
  }),
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sess));

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(routes);

// sync sequelize models to the database, then turn on the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`APP INITIALIZED ON PORT ${PORT}!`);
  });
});
