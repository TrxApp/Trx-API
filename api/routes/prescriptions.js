const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const upload = multer({storage: storage});

const Prescriptions = require('../models/prescriptions');

router.post("/new", upload.single('image'), (req, res, next) => {
  const prescription = new Prescriptions({
    _id: new mongoose.Types.ObjectId(),
    email: req.body.email,
    pharmacy: req.body.pharmacy,
    image: req.file.path,
    date: new Date(),
    status: 'new'
  });
  prescription
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Submitted Prescription successfully",
        prescription: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get('/:pharmacyEmail', (req, res, next) => {
  const email = req.params.pharmacyEmail;
  Prescriptions.find({pharmacy: email})
    .exec()
    .then(doc => {
      console.log(doc)
      if(doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({message: 'No valid entry found for provided ID'});
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
});

router.patch('/inProgress/:prescriptionID', (req, res, next) => {
  const id = req.params.prescriptionID;
  Prescription.update({_id: id}, { $set: { status: req.body.newStatus} })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.patch('/completed/:prescriptionID', (req, res, next) => {
  const id = req.params.prescriptionID;
  Prescriptions.update({_id: id}, { $set: { status: 'completed'} })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
