const test = require('node:test')
const assert = require('node:assert/strict')
const Person = require('../models/person')

test('a valid person passes schema validation', () => {
  const person = new Person({ name: 'Ada Lovelace', number: '040-1234567' })
  assert.equal(person.validateSync(), undefined)
})

test('names shorter than three characters are rejected', () => {
  const person = new Person({ name: 'Al', number: '040-1234567' })
  assert.ok(person.validateSync()?.errors.name)
})

test('phone number format and length are validated', () => {
  for (const number of ['1234567', '1-22334455', '10-22-334455']) {
    const person = new Person({ name: 'Ada Lovelace', number })
    assert.ok(person.validateSync()?.errors.number)
  }
})
