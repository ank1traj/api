import express from "express";
import bcryptjs from "bcryptjs";
const bcrypt = bcryptjs;
import "dotenv/config";
import { v4 as uuidv4 } from "uuid";

import User from "../../models/User";
import { registerValidation } from "../../utils/validation";

const router = express.Router();

router.get("/:id", (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(user);
    }
  });
});

router.post("/add", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(401).send(error.details[0].message);

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists)
    return res.status(400).send("Email already exists in system!");

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    _id: uuidv4(),
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: hashedPassword,
    accountType: req.body.accountType,
  });

  try {
    const newUser = await user.save();
    res.send({
      _id: newUser._id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      password: newUser.password,
      dateCreated: newUser.dateCreated,
      accountType: newUser.accountType,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(user);
    }
  });
});

router.delete("/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(user);
    }
  });
});

export default router;
