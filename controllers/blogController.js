// Module einbinden
const User = require("../models/user");
const Record = require("../models/record");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

/* Nutze lokale Authentifizierung */
passport.use(User.createStrategy());
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});


// Export zur Verwendung in anderen Modulen

/* GET - ungesicherte Routen
   =========================
*/

exports.getLanding = (req, res) => {
  res.render("landing", {
    pageTitle: "Blog Planet - Willkommen",
    favRef: "images/favicon.ico",
    bootstrapCssRef: "bootstrap/css/bootstrap.min.css",
    cssRef: "css/landingStyles.css",
    bootstrapJsRef: "bootstrap/js/bootstrap.bundle.min.js"
  });
};

exports.getRegister = (req, res) => {
  res.render("register", {
    pageTitle: "Blog Planet - Registrierung",
    favRef: "images/favicon.ico",
    bootstrapCssRef: "bootstrap/css/bootstrap.min.css",
    cssRef: "css/registerLoginStyles.css",
    bootstrapJsRef: "bootstrap/js/bootstrap.bundle.min.js"
  });
};

exports.getLogin = (req, res) => {
  res.render("login", {
    pageTitle: "Blog Planet - Anmeldung",
    favRef: "images/favicon.ico",
    bootstrapCssRef: "bootstrap/css/bootstrap.min.css",
    cssRef: "css/registerLoginStyles.css",
    bootstrapJsRef: "bootstrap/js/bootstrap.bundle.min.js"
  });
};

exports.getHome = (req, res) => {
  // Für dynamischen Link "meine Blogs"
  let userID = "notAuthenticated";
  if (req.isAuthenticated()) {
    userID = req.user._id;
  }

  // Suche alle Dokumente, damit diese angezeigt werden können
  Record.find( {"title": { $ne: null }}, (err, foundEntries) => {
    if (err) {
      console.log(err);
    } else {
      if (foundEntries) {
        res.render("home", {
          pageTitle: "Blog Planet - Startseite",
          favRef: "images/favicon.ico",
          bootstrapCssRef: "bootstrap/css/bootstrap.min.css",
          cssRef: "css/homeCollectionStyles.css",
          logoRef: "images/BlogPlanet_Logo-sm.png",
          btnRef: "images/logout-btn.svg",
          author: userID,
          userEntries: foundEntries,
          bootstrapJsRef: "bootstrap/js/bootstrap.bundle.min.js"
        });
      }
    }
  });
};

exports.getRecord = (req, res) => {
  // Für dynamischen Link "meine Blogs"
  let userID = "notAuthenticated";
  if (req.isAuthenticated()) {
    userID = req.user._id;
  }

  const requestedBlogID = req.params.blogID;

  // Suche ein bestimmtes Dokument, damit dieses angezeigt werden kann
  Record.findOne({_id: requestedBlogID}, (err, entry) => {
    if(err) {
      console.log(err);
      res.redirect("/home");
    } else {
      res.render("record", {
        pageTitle: "Blog Planet - Beitrag lesen",
        favRef: "../images/favicon.ico",
        bootstrapCssRef: "../bootstrap/css/bootstrap.min.css",
        cssRef: "../css/recordStyles.css",
        logoRef: "../images/BlogPlanet_Logo-sm.png",
        btnRef: "../images/logout-btn.svg",
        author: userID,
        requestedEntry: entry,
        bootstrapJsRef: "../bootstrap/js/bootstrap.bundle.min.js"
      });
    }
  });
};


/*  GET - gesicherte Routen
    =======================
*/

exports.getCreate = (req, res) => {
  if (req.isAuthenticated()) {
    res.render("create", {
      pageTitle: "Blog Planet - Beitrag verfassen",
      favRef: "images/favicon.ico",
      bootstrapCssRef: "bootstrap/css/bootstrap.min.css",
      cssRef: "css/createEditStyles.css",
      logoRef: "images/BlogPlanet_Logo-sm.png",
      btnRef: "images/logout-btn.svg",
      author: req.user._id,
      headline: "",
      content: "",
      formAction: "/create",
      bootstrapJsRef: "bootstrap/js/bootstrap.bundle.min.js"
    });
  } else {
    res.redirect("/login");
  }
};

exports.getEdit = (req, res) => {
  if (req.isAuthenticated()) {
    const requestedBlogID = req.params.blogID;

    // Stelle sicher, dass Nutzer auch Autor des zu bearbeitenden Blogeintrags ist
    Record.findOne( {_id: requestedBlogID, authorID: req.user._id }, (err, entry) => {
      // edit = create, bis auf Referenzen (Pfade), Inhalt der Eingabefelder und formAction
      res.render("create", {
        pageTitle: "Blog Planet - Beitrag bearbeiten",
        favRef: "../images/favicon.ico",
        bootstrapCssRef: "../bootstrap/css/bootstrap.min.css",
        cssRef: "../css/createEditStyles.css",
        logoRef: "../images/BlogPlanet_Logo-sm.png",
        btnRef: "../images/logout-btn.svg",
        author: req.user._id,
        headline: entry.title,
        content: entry.text,
        formAction: "/edit/" + requestedBlogID,
        bootstrapJsRef: "../bootstrap/js/bootstrap.bundle.min.js"
      });
    });
  } else {
    res.redirect("/login");
  }
};

exports.getDelete = (req, res) => {
  if(req.isAuthenticated()) {
    const requestedBlogID = req.params.blogID;

    // Stelle sicher, dass Nutzer auch Autor des zu löschenden Blogeintrags ist
    Record.deleteOne( {_id: requestedBlogID, authorID: req.user._id}, (err) => {
      if(err) {
        console.log(err);
      }
      res.redirect("/collection/" + req.user._id);
    } );
  } else {
    res.redirect("/login");
  }
};

exports.getCollection = (req, res) => {
  if (req.isAuthenticated()) {

    // Suche alle Dokumente des angemeldeten Nutzers, um diese anzuzeigen.
    Record.find( { authorID: req.user._id }, (err, entries) => {
      if(err) {
        console.log(err);
        res.redirect("/home");
      } else {
        res.render("collection", {
          pageTitle: "Blog Planet - Meine Beiträge",
          favRef: "../images/favicon.ico",
          bootstrapCssRef: "../bootstrap/css/bootstrap.min.css",
          cssRef: "../css/homeCollectionStyles.css",
          logoRef: "../images/BlogPlanet_Logo-sm.png",
          btnRef: "../images/logout-btn.svg",
          author: req.user._id,
          authorEntries: entries,
          bootstrapJsRef: "../bootstrap/js/bootstrap.bundle.min.js"
        });
      }
    });
  } else {
    res.redirect("/login");
  }
};


/* GET - gesichert + ungesichert
   =============================
*/

exports.getLogout = (req, res) => {
  // Nur angemeldete Nutzer werden abgemeldet
  if (req.isAuthenticated()) {
    req.logout((err) => {
      if (err) {
        console.log(err);
      }
    });
  }
  // Immer zu login weiterleiten
  res.redirect("/login");
};


/* POST - ungesicherte Routen
   ==========================
*/

exports.postRegister = (req, res) => {
  /* Registriere Nutzer (speichere in Datenbank); Es kann für jeden "Username" nur ein Account angelegt werden
     (deswegen ist Username = Emailadresse, weil jede Emailadress nur einmal existiert; Siehe: views/register.ejs, Zeile 19) */
  User.register({
      username: req.body.username,
      fname: req.body.fname,
      lname: req.body.lname
    },
    req.body.password, (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/home");
        });
      }
    });
};

exports.postLogin = (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  // Melde Nutzer an
  req.login(user, (err) => {
    if (err) {
      console.log(err);
      res.redirect("/login");
    } else {
      passport.authenticate("local", {
        failureRedirect: '/login'
      })(req, res, () => {
        res.redirect("/home");
      });
    }
  });
};


/* POST -gesicherte Routen
   =======================
*/

exports.postCreate = (req, res) => {
  if(req.isAuthenticated()) {

    const blogPost = new Record({
      title: req.body.title,
      text: req.body.content,
      authorID: req.user._id,
      authorName: req.user.fname + " " + req.user.lname
    });

    // Speichere Beitrag in Datenbank
    blogPost.save(err => {
      if (err) {
        console.log(err);
        res.redirect("/create");
      }
    });
    res.redirect("/collection/" + req.user._id);
  } else {
    res.redirect("/login");
  }
};

exports.postEdit = (req, res) => {
  if(req.isAuthenticated()) {
    const requestedBlogID = req.params.blogID;

    // Stelle sicher, dass Nutzer auch Autor des zu bearbeitenden Blogeintrags ist
    Record.findOne( {_id: requestedBlogID, authorID: req.user._id }, (err, entry) => {
      entry.title = req.body.title;
      entry.text = req.body.content;

      // Mongoose erlaubt Updates mittels save()-Methode
      entry.save(err => {
        if(err) {
          console.log(err);
          res.redirect("/edit/" + requestedBlogID);
        }
      });
    });
    res.redirect("/collection/" + req.user._id);
  } else {
    res.redirect("/login");
  }
};
