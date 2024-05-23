import express from 'express'
import { getTemperaments, saveTemperaments, getTemperamentByName } from '../controllers/temperament.controller.js'


const temperamentRouter = express.Router()

temperamentRouter.get('/save', saveTemperaments)
temperamentRouter.get('/all', getTemperaments)
temperamentRouter.get('/temp-name/:id', getTemperamentByName)

export default temperamentRouter