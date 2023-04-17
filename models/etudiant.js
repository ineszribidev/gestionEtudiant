const mongoose = require("mongoose");
const etudiantSchema = mongoose.Schema({
  cin: {
    type: Number,
    required: true,
  },
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    // required: true,
  },
  image: {
    type: String,
    //  required: true,
  },
  created: {
    type: Date,
    // required: true,
    default: Date.now,
  },
  datebirth: {
    type: Date,
  },
  classe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "class",
  },
  token: String,
});

//exporter un shéma sous forme d'un modele
module.exports = Etudiant = mongoose.model("etudiant", etudiantSchema);
