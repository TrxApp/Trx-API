const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/users');

router.post('/signup', (req, res, next) => {
  User.find({email: req.body.email})
    .exec()
    .then(user => {
      if (user.length >= 1) {
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
              const user = new User({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                phone: req.body.phone,
                address: req.body.address,
                healthCard: req.body.healthCard,
                email: req.body.email,
                password: hash
              });
              user
                .save()
                .then(result => {
                  res.status(201).json({
                    message: 'User Created'
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
  User.find({ email: req.body.email})
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

router.get('/:userEmail', (req, res, next) => {
  const email = req.params.userEmail;
  User.findOne({email: email})
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

router.delete('/:userId', (req, res, next) => {
  User.remove({_id: req.params.id})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'User Deleted'
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
