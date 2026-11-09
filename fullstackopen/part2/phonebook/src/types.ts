export type Person = {
  id: number
  name: string
  number: string
}

export type NewPerson = Omit<Person, 'id'>

export type NotificationData = {
  message: string
  type: 'success' | 'error'
}
