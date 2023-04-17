const express = require("express");
const mongoose = require("mongoose");
var path = require("path");
const Classe = require("../models/class");
const app = express();

// déclaration EJS pour les views
app.set("views", "./views");
app.set("view engine", "ejs");
app.get("/", async (req, res) => {
  const classes = await classe.find();
  res.render("racine/home", {
    classes: classes,
  });
});
app.use(express.static(path.join(__dirname, "public")));
//add class
exports.createClass = async (req, res) => {
  try {
    console.log(req.body);
    const new_classe = new Classe({
      name: req.body.name,
      capacity: req.body.capacity,
    });

    await new_classe.save();
    res.send("ajout effectué avec succes");
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send("Une erreur est survenue lors de l'ajout de la classe.");
  }
};
//get all classes
exports.getClasses = async (req, res) => {
  try {
    const classes = await Classe.find();
    res.status(200).send(classes);
  } catch (error) {
    res.status(500).send(error);
  }
};
