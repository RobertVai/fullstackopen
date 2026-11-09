import axios from 'axios'
import type { NewPerson, Person } from '../types'

const baseUrl = '/api/persons'

const getAll = async (): Promise<Person[]> => {
  const response = await axios.get<Person[]>(baseUrl)
  return response.data
}

const create = async (person: NewPerson): Promise<Person> => {
  const response = await axios.post<Person>(baseUrl, person)
  return response.data
}

const update = async (id: number, person: NewPerson): Promise<Person> => {
  const response = await axios.put<Person>(`${baseUrl}/${id}`, person)
  return response.data
}

const remove = async (id: number): Promise<void> => {
  await axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, create, update, remove }
