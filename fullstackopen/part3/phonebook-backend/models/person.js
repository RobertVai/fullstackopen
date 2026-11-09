const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must contain at least 3 characters'],
    trim: true,
  },
  number: {
    type: String,
    required: [true, 'Number is required'],
    minlength: [8, 'Phone number must contain at least 8 characters'],
    validate: {
      validator: value => /^\d{2,3}-\d+$/.test(value),
      message: 'Phone number must have the format XX-XXXXXX or XXX-XXXXX',
    },
  },
})

personSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
