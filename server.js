const express = require("express");
const mongoose = require("mongoose");
const etudiant = require("./models/etudiant");
const classe = require("./models/class");
const bodyParser = require("body-parser");
const path = require("path");

const { findOneAndDelete } = require("./models/etudiant");
const uploadFile = require("./middlewares/Upload");
const app = express();
app.locals.moment = require("moment");
app.use(express.static(__dirname + "/public"));

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json
app.use(bodyParser.json());

// déclaration EJS pour les views
app.set("views", "./views");
app.set("view engine", "ejs");
app.get("/", async (req, res) => {
  const classes = await classe.find();
  res.render("racine/home", {
    classes: classes,
  });
});
// app.use(express.static(path.join(__dirname, "public")));

//implementer toutes les méthodes necessaires crud
app.get("/etudiants", async (req, res) => {
  const listetudiants = await etudiant.find({}).populate("classe");

  res.render("etudiants/listetudiants", {
    listetud: listetudiants,
  });
});
//ajouter un etudiant

app.post("/ajouter_etudiant", async (req, res) => {
  try {
    await uploadFile(req, res);

    let imageUrl = "";

    if (req.file == undefined) {
      imageUrl = "";
    } else {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    console.log(req.body);
    const new_etudiant = new Etudiant({
      nom: req.body.nom,
      cin: req.body.cin,
      prenom: req.body.prenom,
      email: req.body.email,
      datebirth: req.body.datebirth,
      image: imageUrl,
      classe: req.body.classe_id,
    });

    await new_etudiant.save();
    res.redirect("/etudiants");
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send("Une erreur est survenue lors de l'ajout de l'étudiant.");
  }
});

//supprimer un etudiant
app.get("/delete/:id", async (req, res) => {
  try {
    await etudiant.findOneAndDelete({ _id: req.params.id });
    res.redirect("back");
  } catch (err) {
    res.send(err);
  }
});

//modifier un etudiant

app.get("/edit/:id", async (req, res, next) => {
  try {
    const dataetud = await etudiant.findOne({ _id: req.params.id });
    const classes = await classe.find();
    console.log("dataetud", dataetud);
    return res.render(path.join(__dirname, "./views/etudiants", "edit"), {
      data: dataetud,
      id: req.params.id,
      classes: classes,
    });
  } catch (error) {
    next(error);
  }
});

app.post("/edit", async (req, res) => {
  try {
    await uploadFile(req, res);
    let imageUrl = "";
    if (req.file == undefined) {
      imageUrl = "";
    } else {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    // Récupérer les données du formulaire
    const nom = req.body.nom;
    const cin = req.body.cin;
    const prenom = req.body.prenom;
    const email = req.body.email;
    const datebirth = req.body.datebirth;
    const classe = req.body.classe_id;

    // Vérifier que toutes les données sont présentes
    if (!nom || !cin || !prenom || !email || !datebirth || !classe) {
      return res
        .status(400)
        .send({ message: "Toutes les données sont requises" });
    }

    // Stocker le chemin vers l'image dans une constante
    const imagePath = req.file ? "/uploads/" + req.file.filename : null;

    // Récupérer l'étudiant à mettre à jour
    const etudiantToUpdate = await etudiant.findById(req.body._id);
    if (!etudiantToUpdate) {
      return res.status(404).send({ message: "L'étudiant n'existe pas" });
    }

    // Mettre à jour les informations de l'étudiant
    etudiantToUpdate.nom = nom;
    etudiantToUpdate.cin = cin;
    etudiantToUpdate.prenom = prenom;
    etudiantToUpdate.email = email;
    etudiantToUpdate.datebirth = datebirth;
    etudiantToUpdate.classe = classe;

    if (imagePath) {
      etudiantToUpdate.image = imagePath;
    }

    // Sauvegarder l'étudiant mis à jour dans la base de données
    const result = await etudiant.updateOne(
      { _id: req.body._id },
      etudiantToUpdate
    );
    if (result) {
      res.redirect("/etudiants");
    } else {
      return res.status(500).send({ message: "La mise à jour a échoué" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
const classRouter = require("./routes/classRouter");
const _class = require("./models/class");
app.use("/class", classRouter);

const authRouter = require("./routes/authRouter");
app.use("/auth", authRouter);

//se connecter notre serveur par notre base de donnée
mongoose
  //   .connect(
  //     "mongodb+srv://crud:firstProject@cluster0.ciooxi2.mongodb.net/users?retryWrites=true&w=majority"
  //   )
  .connect(`mongodb://127.0.0.1:27017/etudiant`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));
///////////////////
app.listen(5000, () => console.log("serveur en marche"));
