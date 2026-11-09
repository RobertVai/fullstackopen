require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const path = require('node:path')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(cors())


morgan.token('post-body', request =>
  request.method === 'POST' ? JSON.stringify(request.body) : '-'
)
app.use(morgan('tiny :post-body'))

app.use(express.static(path.join(__dirname, 'dist')))

app.get('/info', async (_request, response) => {
  const count = await Person.countDocuments({})
  response.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`)
})

app.get('/api/persons', async (_request, response) => {
  const persons = await Person.find({})
  response.json(persons)
})

app.get('/api/persons/:id', async (request, response) => {
  const person = await Person.findById(request.params.id)
  if (!person) return response.status(404).end()
  response.json(person)
})

app.post('/api/persons', async (request, response) => {
  const name = typeof request.body.name === 'string' ? request.body.name.trim() : ''
  const number = typeof request.body.number === 'string' ? request.body.number.trim() : ''

  if (!name || !number) {
    return response.status(400).json({ error: 'name and number are required' })
  }

  const existingPerson = await Person.findOne({ name })
  if (existingPerson) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  const person = new Person({ name, number })
  const savedPerson = await person.save()
  response.status(201).json(savedPerson)
})

app.put('/api/persons/:id', async (request, response) => {
  const name = typeof request.body.name === 'string' ? request.body.name.trim() : ''
  const number = typeof request.body.number === 'string' ? request.body.number.trim() : ''
  if (!name || !number) {
    return response.status(400).json({ error: 'name and number are required' })
  }

  const updatedPerson = await Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true }
  )

  if (!updatedPerson) return response.status(404).end()
  response.json(updatedPerson)
})

app.delete('/api/persons/:id', async (request, response) => {
  await Person.findByIdAndDelete(request.params.id)
  response.status(204).end()
})


app.get('/', (_request, response) => {
  response.type('text').send('Phonebook API is running. Build the frontend with npm run build:ui.')
})

app.use((_request, response) => {
  response.status(404).json({ error: 'unknown endpoint' })
})

app.use((error, _request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
})

const start = async () => {
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('USERNAME:PASSWORD')) {
    throw new Error('Set a real MONGODB_URI in your .env file or hosting environment')
  }

  await mongoose.connect(process.env.MONGODB_URI)
  const port = process.env.PORT || 3001
  app.listen(port, () => console.log(`Phonebook server running on port ${port}`))
}

start().catch(error => {
  console.error('Could not start Phonebook:', error.message)
  process.exitCode = 1
})
