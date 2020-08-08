import {Router} from 'express'

const route = Router()

route.get('/hello', (req, res) => {
  res.send('hello')
})

export default route
