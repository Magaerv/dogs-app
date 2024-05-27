import mongoose from 'mongoose'

const dogSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  image: {
    type: [String],
    required: true,
  },
  height: {
    metric: {
      type: String,
      default: "",
    }
  },
  weight: {
    metric: {
      type: String,
      default: "",
    }
  },
  bred_for: {
    type: String,
    default: "",
  },
  breed_group: {
    type: String,
    default: "",
  },
  life_span: {
    type: String,
    default: "",
  },
  temperament: [{
    type: String,
    ref: 'Temperament',
    required: true,
  }],
  origin: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  userRef: {
    type: String,
    required: true,
  }
  ,
  fromDb: {
    type: Boolean,
    default: true,
  }

},
  { timestamps: true }
)

const Dog = mongoose.model('Dog', dogSchema)

export default Dog