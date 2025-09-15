const express = require('express')
const mongoose = require('mongoose')

const { MONGODB_URI } = require('./utils/config')
const loginRouter = require('./controllers/login')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

const app = express()

mongoose.connect(MONGODB_URI)
    .then(res => logger.info('connected to MongoDb'))
    .catch(err => logger.info('error connecting to MongoDB:', err.message))

app.use(express.json())

app.use(middleware.requestLogger)

app.use(middleware.tokenExtractor)
app.use('/api/login', loginRouter)
app.use('/api/users', userRouter)
app.use('/api/blogs', blogRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app