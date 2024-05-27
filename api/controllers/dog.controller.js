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
    }))

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
    return next(error)
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
      const response = await fetch(process.env.API_URL / `${req.params.id}`, {
        headers: {
          'x-api-key': process.env.API_KEY
        }
      })

      if (response.status === 404) {
        return next(errorHandler(404, 'Dog not found'))
      }

      const apiDog = await response.json()
      return res.status(200).json(apiDog)
    }
    res.status(200).json(dog)
  } catch (error) {
    next(error)
  }
}


export const getDogs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 12
    const startIndex = parseInt(req.query.startIndex) || 0
    const searchTerm = req.query.searchTerm || ''
    const sort = req.query.sort || 'createdAt'
    const order = req.query.order === 'asc' ? 1 : -1
    const fromDb = req.query.fromDb === 'true'
    const fromApi = req.query.fromApi === 'true'

    let dbDogs = []
    let apiDogs = []

    if (fromDb) {
      dbDogs = await Dog.find({
        name: { $regex: searchTerm, $options: 'i' },
      }).lean()
    }

   if (fromApi) {
      const response = await fetch(process.env.API_URL, {
        headers: {
          'x-api-key': process.env.API_KEY,
        },
      })

      if (!response.ok) {
        throw new Error('Error fetching data from external API')
      }

      const apiDogsResponse = await response.json()

      apiDogs = apiDogsResponse
        .filter(dog => dog.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(dog => ({ ...dog, fromDb: false }))
    }

    const combinedDogs = [...dbDogs, ...apiDogs]

    combinedDogs.sort((a, b) => {
      if (a[sort] < b[sort]) return order === 1 ? -1 : 1
      if (a[sort] > b[sort]) return order === 1 ? 1 : -1
      return 0
    })

    const paginatedDogs = combinedDogs.slice(startIndex, startIndex + limit)

    if (!paginatedDogs.length) {
      return next(errorHandler(404, 'Dogs not found'))
    }

    return res.status(200).json(paginatedDogs)
  } catch (error) {
    next(error)
  }
}