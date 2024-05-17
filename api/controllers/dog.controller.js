import Dog from '../models/dog.model.js'
import { errorHandler } from '../utils/error.js'

export const createDog = async (req, res, next) => {
  try {
    const dog = await Dog.create(req.body)
    return res.status(201).json(dog)
  } catch (error) {
    next(error)
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