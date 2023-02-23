// Module einbinden
const mongoose = require("mongoose");
const DatabaseSchema = mongoose.Schema;

// Schema erzeugen
const recordSchema = new DatabaseSchema({
  title: {
    type: String,
    required: true,
    maxLength: 150
  },
  text: {
    type: String,
    required: true,
    maxLength: 100000
  },
  authorID: { type: DatabaseSchema.Types.ObjectId, ref: "User"},
  // Denormalisiert, weil effektiver 
  authorName: String
});

// Export zur Verwendung in anderen Modulen
module.exports = mongoose.model("Record", recordSchema);
