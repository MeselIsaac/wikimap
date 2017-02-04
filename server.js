"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const mapsRoutes = require("./routes/maps");
const usersRoutes = require("./routes/users");
const markersRoutes = require("./routes/markers");
const users_mapsRoutes = require("./routes/users_maps");
const profileMaps = require("./routes/profilemaps");
// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// // Mount all resource routes
app.use("/api/users", usersRoutes(knex));

app.use("/maps", mapsRoutes(knex));
app.use("/api/maps", mapsRoutes(knex));
app.use("/api/markers", markersRoutes(knex));
app.use("/api/users_maps", users_mapsRoutes(knex));
app.use("/api/profilemaps", profileMaps(knex));


// HOME PAGE
app.get("/", (req, res) => {
  res.render("index");
});


//CREATE PAGE
app.get("/maps/new", (req, res) => {
  let templateVars = {
    mapId: req.params.id,
    // username: req.session.user_id
  }
  res.render("create", templateVars);
});

app.get("/view", (req, res) => {
  res.render("viewedit");
});

app.get("/profile", (req, res) => {
  res.render("profile");

})

app.get("/maps/:id", (req, res) => {
  let templateVars = {
    mapId: req.params.id,
    // username: req.session.user_id
  }
  res.render("viewedit", templateVars)

})



app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
