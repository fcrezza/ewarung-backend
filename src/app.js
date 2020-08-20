import express from 'express'
/* eslint-disable-next-line */
import bodyParser from 'body-parser'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import 'express-async-errors'

import user from './components/user'
import errorMiddleware from './utils/errorMiddleware'

const app = express()
// 3rd party middleware
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
)
app.use(bodyParser.json())
app.use(cookieParser())
app.use(morgan('dev'))

// app middleware
app.use('/api/user', user)
app.use(errorMiddleware)

export default app
