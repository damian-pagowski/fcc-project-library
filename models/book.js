const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: { type: [String], default: [] }
})

bookSchema.methods.addComment = function (str) {
  this.comments.push(str)
}

module.exports = mongoose.model('Book', bookSchema)
