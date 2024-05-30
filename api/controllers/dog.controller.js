import mongoose from 'mongoose'
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
    const id = req.params.id
    
    const isDatabaseId = mongoose.Types.ObjectId.isValid(id)

    if (!isDatabaseId) {
      const response = await fetch(`${process.env.API_URL}`, {
        headers: {
          'x-api-key': process.env.API_KEY
        }
      })

      if (response.status === 404) {
        return next(errorHandler(404, 'Dog not found'))
      }

      const apiData = await response.json();

      const apiDog = apiData.find(dog => dog.id == id)

      if (!apiDog) {
        return next(errorHandler(404, 'Dog not found'))
      }

      return res.status(200).json(apiDog);
    } else {
      const dog = await Dog.findById(id)
      if (!dog) {
        return next(errorHandler(404, 'Dog not found'))
      }
      res.status(200).json(dog)
    }
  } catch (error) {
    next(error)
  }
};


  export const getDogs = async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || 30
      const startIndex = parseInt(req.query.startIndex) || 0
      const searchTerm = req.query.searchTerm || ''
      const sort = req.query.sort || 'createdAt'
      const order = req.query.order === 'asc' ? 1 : -1
      const fromDb = req.query.fromDb === 'true'
      const fromApi = req.query.fromApi === 'true'
      const temperament = req.query.temperament || '';

      let dbDogs = []
      let apiDogs = []

      let dbFilter = { name: { $regex: searchTerm, $options: 'i' } }
      if (temperament && temperament !== 'All') {
        dbFilter = {
          ...dbFilter,
          temperament: { $elemMatch: { $regex: new RegExp(`^${temperament}$`, 'i') } }
        }
      }

      if (fromDb || (!fromDb && !fromApi)) {
        dbDogs = await Dog.find(dbFilter).lean().exec()
      }

      if (fromApi || (!fromApi && !fromDb)) {
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
          .filter(dog => {
            if (dog.name.toLowerCase().includes(searchTerm.toLowerCase())) {
              if (temperament && temperament !== 'All') {
                if (dog.temperament) {
                  const temperaments = dog.temperament.split(',').map(temp => temp.trim())
                  return temperaments.some(t => new RegExp(`^${temperament}$`, 'i').test(t))
                }
                return false
              }
              return true
            }
            return false
          })
          .map(dog => ({ ...dog, fromDb: false }))
      }

      let combinedDogs = []
      if ((fromDb && fromApi) || (!fromDb && !fromApi)) {
        combinedDogs = [...dbDogs, ...apiDogs]
      } else if (fromDb) {
        combinedDogs = dbDogs
      } else if (fromApi) {
        combinedDogs = apiDogs
      }

      const uniqueDogs = combinedDogs.reduce((acc, dog) => {
        const id = dog._id || dog.id
        if (!acc.some(existingDog => existingDog._id === id || existingDog.id === id)) {
          acc.push(dog)
        }
        return acc
      }, []);

      uniqueDogs.sort((a, b) => {
        if (a[sort] < b[sort]) return order === 1 ? -1 : 1
        if (a[sort] > b[sort]) return order === 1 ? 1 : -1
        return 0
      })

      const paginatedDogs = uniqueDogs.slice(startIndex, startIndex + limit)

      if (!paginatedDogs.length) {
        return next(new Error('Dogs not found'))
      }

      return res.status(200).json(paginatedDogs)
    } catch (error) {
      next(error)
    }
}