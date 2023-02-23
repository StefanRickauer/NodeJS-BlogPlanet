// Module einbinden
const mongoose = require("mongoose");
const DatabaseSchema = mongoose.Schema;
const plm = require("passport-local-mongoose");

// Schema erzeugen 
const userSchema = new DatabaseSchema({
  fname: {
    type: String,
    required: true,
    maxLength: 150
  },
  lname: {
    type: String,
    required: true,
    maxLength: 150
  }
});

// Durch Nutzung des Plugins werden bei Registrierung automatisch Username + gehashtes Passwort + Salt hinzugefügt.
userSchema.plugin(plm);

// Export zur Verwendung in anderen Modulen
module.exports = mongoose.model("User", userSchema);
