import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import type { NotificationData, Person } from './types'

const App = () => {
  const [persons, setPersons] = useState<Person[]>([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [query, setQuery] = useState('')
  const [notification, setNotification] = useState<NotificationData | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showNotification = (message: string, type: NotificationData['type']) => {
    setNotification({ message, type })
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setNotification(null), 5000)
  }

  useEffect(() => {
    personService
      .getAll()
      .then(setPersons)
      .catch(() => showNotification('Could not load contacts. Check that the server is running.', 'error'))

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const resetForm = () => {
    setNewName('')
    setNewNumber('')
  }

  const handleError = (error: unknown, person?: Person) => {
    if (axios.isAxiosError(error) && error.response?.status === 404 && person) {
      setPersons((previous) => previous.filter((item) => item.id !== person.id))
      showNotification(`${person.name} was already removed from the server.`, 'error')
      return
    }

    showNotification('Request failed. Please try again.', 'error')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = newName.trim()
    const number = newNumber.trim()
    if (!name || !number) return

    const existing = persons.find((person) => person.name.toLowerCase() === name.toLowerCase())

    if (existing) {
      if (existing.number === number) {
        window.alert(`${existing.name} is already added to phonebook`)
        return
      }

      if (!window.confirm(`${existing.name} is already added to phonebook. Replace the old number?`)) {
        return
      }

      try {
        const updated = await personService.update(existing.id, {
          name: existing.name,
          number,
        })
        setPersons((previous) => previous.map((person) => person.id === updated.id ? updated : person))
        showNotification(`Updated ${existing.name}'s number`, 'success')
        resetForm()
      } catch (error) {
        handleError(error, existing)
      }
      return
    }

    try {
      const created = await personService.create({ name, number })
      setPersons((previous) => [...previous, created])
      showNotification(`Added ${created.name}`, 'success')
      resetForm()
    } catch (error) {
      handleError(error)
    }
  }

  const handleDelete = async (person: Person) => {
    if (!window.confirm(`Delete ${person.name}?`)) return

    try {
      await personService.remove(person.id)
      setPersons((previous) => previous.filter((item) => item.id !== person.id))
      showNotification(`Deleted ${person.name}`, 'success')
    } catch (error) {
      handleError(error, person)
    }
  }

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <main className="page">
      <header className="heading">
        <span className="eyebrow">Full Stack Open · Part 2</span>
        <h1>Phonebook</h1>
        <p>Keep your contacts in one place.</p>
      </header>

      <Notification notification={notification} />

      <section className="panel">
        <h2>Add a contact</h2>
        <PersonForm
          name={newName}
          number={newNumber}
          onNameChange={setNewName}
          onNumberChange={setNewNumber}
          onSubmit={handleSubmit}
        />
      </section>

      <section className="panel">
        <h2>Contacts ({persons.length})</h2>
        <Filter query={query} onQueryChange={setQuery} />
        {filteredPersons.length > 0 ? (
          <Persons persons={filteredPersons} onDelete={handleDelete} />
        ) : (
          <p className="empty">No contacts found.</p>
        )}
      </section>
    </main>
  )
}

export default App
