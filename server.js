'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const apiRoutes = require('./routes/api.js')
const fccTestingRoutes = require('./routes/fcctesting.js')
const runner = require('./test-runner')
const helmet = require('helmet')
const APP_PORT = process.env.PORT || 3000
const app = express()
app.use(helmet({ noCache: true, hidePoweredBy: { setTo: 'PHP 4.2.0' } }))

app.use('/public', express.static(process.cwd() + '/public'))

app.use(cors({ origin: '*' })) // USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Index page (static HTML)
app.route('/').get(function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html')
})

// For FCC testing purposes
fccTestingRoutes(app)

// Routing for API
apiRoutes(app)

// 404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type('text').send('Not Found')
})

// Start our server and tests!
app.listen(APP_PORT, function () {
  console.log('Listening on port ' + APP_PORT)
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...')
    setTimeout(function () {
      try {
        runner.run()
      } catch (e) {
        const error = e
        console.log('Tests are not valid:')
        console.log(error)
      }
    }, 1500)
  }
})

module.exports = app // for unit/functional testing
