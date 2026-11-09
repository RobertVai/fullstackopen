export type Person = {
  id: string
  name: string
  number: string
}

export type NewPerson = Omit<Person, 'id'>

export type NotificationData = {
  message: string
  type: 'success' | 'error'
}
