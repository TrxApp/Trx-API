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

const Pharmacies = require('../models/pharmacies');

router.get('/', (req, res, next) => {
  Pharmacies.find()
    .exec()
    .then(docs => {
      console.log(docs);
      if (docs.length >= 0) {
        res.status(200).json(docs);
      } else {
        res.status(404).json({
          message: 'No entries found!'
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.post('/', (req, res, next) => {
  Pharmacies.find({email: req.body.email})
    .exec()
    .then(pharmacy => {
      if (pharmacy.length >= 1) {
        return res.status(409).json({
          message: 'Email already exists'
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if(err) {
              return res.status(500).json({
                error: err
              });
            } else {
              const pharmacy = new Pharmacies({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                province: req.body.province,
                postalCode: req.body.postalCode,
                password: hash
              });
              pharmacy
                .save()
                .then(result => {
                  res.status(201).json({
                    message: 'Pharmacy Created'
                  });
                })
                .catch(err => {
                  console.log(err);
                  res.status(500).json({
                    error: err
                  });
              });
            }
          });
      }
    })
    .catch();
  });

  router.post('/login', (req, res, next) => {
    Pharmacies.find({ email: req.body.email})
      .exec()
      .then(user => {
        if(user.length < 1) {
          return res.status(401).json({
            message: 'Auth failed'
          });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: 'Auth failed'
            });
          }
          if (result) {
            const token = jwt.sign({
              email: user[0].email,
              userId: user[0]._id
            },
            'secret',
            {
              expiresIn: '1h'
            }
          );
            return res.status(200).json({
              message: 'Auth Successful',
              token: token
            })
          }
          res.status(401).json({
            message: 'Auth failed'
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      })
  });

router.get('/:pharmacyID', (req, res, next) => {
  const id = req.params.pharmacyID;
  Pharmacies.findById(id)
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

router.patch('/:pharmacyID', (req, res, next) => {
  const id = req.params.pharmacyID;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Pharmacies.update({_id: id}, { $set: updateOps })
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

router.delete('/:pharmacyID', (req, res, next) => {
  const id = req.params.pharmacyID
  Pharmacies.remove({_id: id})
    .exec()
    .then(res => {
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
