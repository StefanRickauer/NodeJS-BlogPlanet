// Module einbinden
const path = require("path");
const express = require("express");
const blogController = require("../controllers/blogController");

// Erzeuge Router-Objekt, das sich um Anfragen kümmert
const router = express.Router();

// Definiere Routen für die Webanwendung

// GET - ungesicherte Routen
router.get("/", blogController.getLanding);
router.get("/register", blogController.getRegister);
router.get("/login", blogController.getLogin);
router.get("/home", blogController.getHome);
router.get("/blog/:blogID", blogController.getRecord);

//  GET - gesicherte Routen
router.get("/create", blogController.getCreate);
router.get("/edit/:blogID", blogController.getEdit);
router.get("/delete/:blogID", blogController.getDelete);
router.get("/collection/:author", blogController.getCollection);

// GET - gesichert + ungesichert
router.get("/logout", blogController.getLogout);


// POST - ungesicherte Routen
router.post("/register", blogController.postRegister);
router.post("/login", blogController.postLogin);

// POST -gesicherte Routen
router.post("/create", blogController.postCreate);
router.post("/edit/:blogID", blogController.postEdit);

// Export zur Verwendung in anderen Modulen
module.exports = router;
