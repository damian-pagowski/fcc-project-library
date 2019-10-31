/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*
*/

var chaiHttp = require('chai-http')
var chai = require('chai')
var assert = chai.assert
var server = require('../server')

chai.use(chaiHttp)

suite('Functional Tests', function () {
  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function (done) {
    chai.request(server).get('/api/books').end(function (err, res) {
      assert.equal(res.status, 200)
      assert.isArray(res.body, 'response should be an array')
      assert.property(
        res.body[0],
        'commentcount',
        'Books in array should contain commentcount'
      )
      assert.property(
        res.body[0],
        'title',
        'Books in array should contain title'
      )
      assert.property(res.body[0], '_id', 'Books in array should contain _id')
      done()
    })
  })
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function () {
    let createdBookId
    const BOOK_TITLE = 'my favourite book'
    suite(
      'POST /api/books with title => create book object/expect book object',
      function () {
        test('Test POST /api/books with title', function (done) {
          chai
            .request(server)
            .post('/api/books')
            .send({ title: BOOK_TITLE })
            .end(function (err, res) {
              assert.equal(res.status, 201)
              assert.equal(res.body.title, BOOK_TITLE)
              assert.isArray(
                res.body.comments,
                'response should have comments array'
              )
              assert.equal(
                res.body.comments.length,
                0
              ), 'there should be no comments in response yet'
              assert.property(
                res.body,
                '_id',
                'response should have unique id'
              )
              createdBookId = res.body._id
              done()
            })
        })

        test('Test POST /api/books with no title given', function (done) {
          chai.request(server).post('/api/books').end(function (err, res) {
            assert.equal(res.status, 400)
            assert.property(
              res.body,
              'error',
              'Missing title should return error'
            )
            done()
          })
        })
      }
    )
    suite('GET /api/books => array of books', function () {
      test('Test GET /api/books', function (done) {
        chai.request(server).get('/api/books').end(function (err, res) {
          assert.equal(res.status, 200)
          assert.isArray(res.body, 'response should be an array')
          assert.property(
            res.body[0],
            'commentcount',
            'Books in array should contain commentcount'
          )
          assert.property(
            res.body[0],
            'title',
            'Books in array should contain title'
          )
          assert.property(
            res.body[0],
            '_id',
            'Books in array should contain _id'
          )
          done()
        })
      })
    })

    suite('GET /api/books/[id] => book object with [id]', function () {
      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai
          .request(server)
          .get('/api/books/5db99d56aff3611530f9accb')
          .end(function (err, res) {
            assert.equal(res.status, 404)
            assert.property(
              res.body,
              'error',
              'Response should contain error property'
            )
            assert.equal(
              res.body.error,
              'no book exists',
              'response should contain proper error message'
            )
            done()
          })
      })

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai
          .request(server)
          .get(`/api/books/${createdBookId}`)
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.equal(
              res.body.title,
              BOOK_TITLE,
              'response should contain valid book title'
            )
            assert.equal(
              res.body._id,
              createdBookId,
              'response should contain valid id'
            )
            assert.isArray(
              res.body.comments,
              'response should contains array of comments'
            )

            done()
          })
      })
    })

    suite(
      'POST /api/books/[id] => add comment/expect book object with id',
      function () {
        test('Test POST /api/books/[id] with comment', function (done) {
          chai
            .request(server)
            .post(`/api/books/${createdBookId}`)
            .send({ comment: 'average' })
            .end(function (err, res) {
              assert.equal(res.status, 201)
              assert.equal(
                res.body.title,
                BOOK_TITLE,
                'response should contain valid book title'
              )
              assert.equal(
                res.body._id,
                createdBookId,
                'response should contain valid id'
              )
              assert.isArray(
                res.body.comments,
                'response should contains array of comments'
              )
              assert.include(
                res.body.comments,
                'average',
                'array contains just created comment'
              )
              done()
            })
        })

        test('Test POST /api/books/[id] with missing comment attribute', function (
          done
        ) {
          chai
            .request(server)
            .post(`/api/books/${createdBookId}`)
            .end(function (err, res) {
              assert.equal(res.status, 400)
              assert.property(
                res.body,
                'error',
                'comment parameter is mandatory'
              )
              done()
            })
        })
      }
    )
    suite('DELETE /api/books/[id] => removing book', function () {
      test('Test DELETE /api/books/[id] - and clean up after test', function (done) {
        chai
          .request(server)
          .delete(`/api/books/${createdBookId}`)
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.property(
              res.body,
              'message',
              'response should contain message confirming successful delete'
            )
            assert.equal(
              res.body.message,
              'complete delete successful',
              'response should contain message confirming successful delete'
            )
            done()
          })
      })
    })
  })
})
