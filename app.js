// Module einbinden
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");

const errorController = require("./controllers/errorController");
const blogRoutes = require("./routes/blogPlanetRoutes");

/* Erzeuge Express Anwendung, nutze und initialisiere Middleware, nutze statische Routen (z.B. für CSS-Dateien)  */
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

/* Stelle Verbindung zur Datenbank her */
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true}, err => {
  if(err) {
    console.log(err);
  } else {
    console.log("[+] Established connection to database");
  }
});

/* Alle Routen der Webanwendung */
app.use(blogRoutes);
/* Page-not-found Route absichtlich in separater Datei => falls neue Routen hinzukommen MUSS errorController ganz unten stehen.
   Durch separaten Code wird verhindert, dass versehentlich errorController nicht ganz unten steht und "Page not found" für Seiten ausgegeben wird,
   die tatsächlich erreichbar wären. */
app.use(errorController.getNotFound);

/* Starte Server */
app.listen(process.env.PORT, err => {
  if(err) {
    console.log(err);
  } else {
    console.log("[+] Server listening on port " + process.env.PORT);
  }
});
