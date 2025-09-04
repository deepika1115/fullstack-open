const mongoose = require("mongoose")

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(res => console.log('connected to MongoDb'))
    .catch(err => console.log('error connecting to MongoDB:', err.message))

const personSchema = new mongoose.Schema({
    name : {
      type: String,
      minLength: 3
    },
    number : {
      type: String,
      minLength: 8,
      validate: {
        validator: v => {
          return /^\d{2,3}-\d+$/.test(v);
        },
        message: props => "Invalid phone number. Use format like 09-1234556 or 040-22334455."
      },
    }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)