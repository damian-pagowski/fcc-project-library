/*
*
*
*       Complete the API routing below
*
*
*/

'use strict'

const expect = require('chai').expect
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const MONGODB_CONNECTION_STRING = process.env.MONGOLAB_URI
const mongoose = require('mongoose')
const Book = require('../models/book')

mongoose.connect(MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

module.exports = function (app) {
  app
    .route('/api/books')
    .get(function (req, res) {
      Book.find()
        .then(data => {
          const rspData = data.map(cp => ({
            _id: cp._id,
            title: cp.title,
            commentcount: cp.comments.length
          }))
          res.json(rspData)
        })
        .catch(error => res.status(400).json({ error }))
    })
    .post(function (req, res) {
      const title = req.body.title
      let book = new Book(req.body)
      book
        .save()
        .then(data => res.status(201).json(data))
        .catch(error => res.status(400).json({ error }))
    })
    .delete(function (req, res) {
      Book.remove({})
        .then(data => res.json({ message: 'complete delete successful' }))
        .catch(error => res.status(400).json({ error }))
    })

  app
    .route('/api/books/:id')
    .get(function (req, res) {
      const bookid = req.params.id
      Book.findById(bookid)
        .then(book => {
          if (book) {
            res.json(book)
          } else {
            res.status(404).json({ error: 'no book exists' })
          }
        })
        .catch(error => res.status(400).json({ error }))
    })
    .post(function (req, res) {
      const bookid = req.params.id
      const comment = req.body.comment
      if (!comment) {
        return res.status(400).json({error : "comment parameter is mandatory"})
      }
      Book.findById(bookid)
        .then(book => {
          book.addComment(comment)
          book.save().then(data => res.status(201).json(data))
        })
        .catch(error => res.status(400).json(error))
    })
    .delete(function (req, res) {
      const bookid = req.params.id
      Book.remove({ _id: bookid })
        .then(data => res.json({ message: 'complete delete successful' }))
        .catch(error => res.status(400).json(error))
    })
}
