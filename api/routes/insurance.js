const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Insurance = require('../models/insurance');

router.get('/:userEmail', (req, res, next) => {
  const email = req.params.userEmail;
  Insurance.find({email: email})
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

router.post('/', (req, res, next) => {
  const insurance = new Insurance({
    _id: new mongoose.Types.ObjectId(),
    email: req.body.email,
    name: req.body.name,
    memberID: req.body.memberID,
    groupNumber: req.body.groupNumber,
    relationship: req.body.relationship
  });
  insurance
  .save()
  .then(result => {
    console.log(result);
    res.status(200).json({
      messge: 'Handling POST requests for insurance',
      insurance: result
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    })
  });
});

router.get('/single/:insuranceId', (req, res, next) => {
  const id = req.params.insuranceId;
  Insurance.findById(id)
  .exec()
  .then(doc => {
    console.log(doc)
    if (doc) {
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

router.delete('/:insuranceId', (req, res, next) => {
  Insurance.remove({_id: req.params.id})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Insurance Deleted'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
  });
});

module.exports = router;
