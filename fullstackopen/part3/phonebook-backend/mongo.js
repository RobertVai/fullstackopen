require('dotenv').config()
const mongoose = require('mongoose')
const Person = require('./models/person')


const main = async () => {
  const [password, name, number] = process.argv.slice(2)
  if (!password || (name && !number) || (!name && number)) {
    console.log('Usage: node mongo.js PASSWORD ["Person Name" "09-1234567"]')
    process.exitCode = 1
    return
  }

  const template = process.env.MONGODB_URI_TEMPLATE
  const uri = template
    ? template.replace('{PASSWORD}', encodeURIComponent(password))
    : process.env.MONGODB_URI

  if (!uri || uri.includes('USERNAME:PASSWORD')) {
    throw new Error('Set MONGODB_URI_TEMPLATE or MONGODB_URI in .env')
  }

  await mongoose.connect(uri)
  try {
    if (name && number) {
      const person = new Person({ name, number })
      await person.save()
      console.log(`added ${name} number ${number} to phonebook`)
    } else {
      const persons = await Person.find({})
      console.log('phonebook:')
      for (const person of persons) {
        console.log(`${person.name} ${person.number}`)
      }
    }
  } finally {
    await mongoose.connection.close()
  }
}

main().catch(error => {
  console.error(error.message)
  process.exitCode = 1
})
