const config = require("./config/auth.config");
const db = require("../models/etudiant");

const PORT = process.env.PORT || 8080;
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const etudiant = require("../models/etudiant");

exports.signin = async (req, res) => {
  console.log("req.body.email", req.body.email.toLowerCase());

  if (!req.body.email) {
    return res.status(500).send({
      message: "emailRequired",
    });
  }
  if (!req.body.password) {
    return res.status(500).send({
      message: "passwordRequired",
    });
  }

  console.log("user collection", etudiant);
  try {
    const user = await etudiant
      .findOne({
        email: req.body.email.toLowerCase(),
      })
      .exec();

    if (!user) {
      return res.status(404).send({
        message: "userNotFound",
      });
    }

    console.log("user exist", user);

    var token = jwt.sign(
      {
        id: user._id,
      },
      config.secret,
      {
        expiresIn: 86400, // 24 hours
      }
    );
    var refreshToken = jwt.sign(
      { id: user._id },
      config.refreshTokenSecret,
      {}
    );

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "invalidPassword",
      });
    }

    await etudiant.updateOne(
      { _id: user._id },
      {
        $set: {
          token: token,
        },
      }
    );

    // Fetch the updated user data after the update
    const updatedUser = await etudiant.findById(user._id);

    console.log("updatedUser", updatedUser);

    // Send the updated user data as the response
    res.status(200).send(updatedUser);
  } catch (err) {
    res.status(500).send({
      message: err.message || "An error occurred while signin in",
    });
  }
};
