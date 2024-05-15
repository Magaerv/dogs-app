import mongoose from 'mongoose'

const dogSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  image: {
    type: Array,
    required: true,
  },
  height: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
  life_span: {
    type: String,
    required: true,
  },
  origin: {
    type: String,
    required: true,
  },
  createBD: {
    type: Boolean,
    default: true,
    required: true,
  },
  userRef: {
    type: String,
    required: true,
  }
},
  { timestamps: true }
)

const Dog = mongoose.model('Dog', dogSchema)

export default Dog