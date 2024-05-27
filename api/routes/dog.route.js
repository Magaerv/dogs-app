import express from 'express'
import { createDog, deleteDog, getDog, getDogs, updateDog } from '../controllers/dog.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const dogRouter = express.Router()

dogRouter.post('/create', verifyToken, createDog)
dogRouter.delete('/delete/:id', verifyToken, deleteDog)
dogRouter.post('/update/:id', verifyToken, updateDog)
dogRouter.get('/get/:id', getDog)
dogRouter.get('/get', getDogs)

export default dogRouter