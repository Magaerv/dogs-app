import express from 'express'
import { createDog, deleteDog, updateDog, getDog } from '../controllers/dog.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const dogRouter = express.Router()

dogRouter.post('/create', verifyToken, createDog)
dogRouter.delete('/delete/:id', verifyToken, deleteDog)
dogRouter.post('/update/:id', verifyToken, updateDog)
dogRouter.get('/get/:id', getDog)

export default dogRouter