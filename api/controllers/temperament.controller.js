import Temperament from '../models/temperament.model.js'


export const saveTemperaments = async (req, res, next) => {
  try {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'x-api-key': process.env.API_KEY
    })

    const requestOptions = {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    }

    const response = await fetch(process.env.API_URL, requestOptions)
    const data = await response.json()

    const temperamentsSet = new Set();
   
    data.forEach(dog => {
      if (dog.temperament) {
        const temperaments = dog.temperament.split(',').map(temp => temp.trim())
        temperaments.forEach(temp => temperamentsSet.add(temp))
      }
    });

    for (const name of temperamentsSet) {
      try {
        const newTemperament = new Temperament({ name })
        await newTemperament.save()
      } catch (error) {
        if (error.code !== 11000) {
          return next(error)
        }
      }
    }
    res.status(200).json({ message: 'Temperaments in DataBase OK'})
  } catch (error) {
    next(error)
  }
}


export const getTemperaments = async (req, res, next) => {
  try {
    const temperaments = await Temperament.find().sort({ name: 1 }) 
    return res.status(200).json(temperaments)
  } catch (error) {
    return next(error)
  }
}

export const getTemperamentByName = async (req, res, next) => {
  try {
    const dog = req.body
   console.log(dog)
   
  } catch (error) {
    return next(error)
  }
}
