import Dog from '../models/dog.model.js'
import Temperament from '../models/temperament.model.js'
import { errorHandler } from '../utils/error.js'

export const createDog = async (req, res, next) => {
  try {
    const { temperament, ...dogData } = req.body

    const temperamentIds = await Promise.all(temperament.map(async name => {
      const foundTemperament = await Temperament.findOne({ name })
      if (!foundTemperament) {
        throw new Error(`Temperament not found: ${name}`)
      }
      return foundTemperament.name
    }));

    const dog = await Dog.create({ ...dogData, temperament: temperamentIds })

    return res.status(201).json(dog)
  } catch (error) {
    if (error.message.startsWith('Temperament not found')) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: error.message,
      })
    }
    return next(error);
  }
}


export const deleteDog = async (req, res, next) => {
  const dog = await Dog.findById(req.params.id)

  if (!dog) {
    return next(errorHandler(404, 'Dog not found.'))
  }

  if (req.user.id !== dog.userRef) {
    return next(errorHandler(401, 'You can only delete your own dogs.'))
  }

  try {
    await Dog.findByIdAndDelete(req.params.id)
    res.status(200).json('Dog has been deleted.')
  } catch (error) {
    next(error)
  }
}


export const updateDog = async (req, res, next) => {
  const dog = await Dog.findById(req.params.id)

  if (!dog) {
    return next(errorHandler(404, 'Dog not found.'))
  }

  if (req.user.id !== dog.userRef) {
    return next(errorHandler(401, 'You can only update your own dogs.'))
  }

  try {
    const updatedDog = await Dog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.status(200).json(updatedDog)
  } catch (error) {
    next(error)
  }
}

export const getDog = async (req, res, next) => {
  try {
    const dog = await Dog.findById(req.params.id)
    if (!dog) {
      return next(errorHandler(404, 'Dog not found'))
    }
    res.status(200).json(dog)
  } catch (error) {
    next(error)
  }
}

