import mongoose from 'mongoose'

const temperamentSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
  }
},
  { timestamps: true }
)

const Temperament = mongoose.model('Temperament', temperamentSchema)

export default Temperament