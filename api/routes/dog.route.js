import express from 'express'
import { createDog } from '../controllers/dog.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const dogRouter = express.Router()

dogRouter.post('/create', verifyToken, createDog)


export default dogRouter