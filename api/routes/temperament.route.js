import express from 'express'
import { getTemperaments, saveTemperaments } from '../controllers/temperament.controller.js'


const temperamentRouter = express.Router()

temperamentRouter.get('/save', saveTemperaments)
temperamentRouter.get('/all', getTemperaments)

export default temperamentRouter