import express from 'express'
import { google, signin, signup, signout } from '../controllers/auth.controller.js'

const authRouter = express.Router()

authRouter.post('/signup', signup)
authRouter.post('/signin', signin)
authRouter.post('/google', google)
authRouter.get('/signout', signout)

export default authRouter