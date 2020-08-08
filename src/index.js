import express from 'express'

import routes from './routes'

const app = express()
const port = process.env.PORT || 4000

app.get('/', (req, res) => {
  res.send('hello world')
})

app.use('/api', routes)

app.listen(port, () => {
  console.log(`server listen on port ${port}`)
})
