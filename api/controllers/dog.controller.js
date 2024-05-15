import Dog from '../models/dog.model.js'

export const createDog = async (req, res, next) => {
  try {
    const dog = await Dog.create(req.body)
    return res.status(201).json(dog)
  } catch (error) {
    next(error)
  }
}