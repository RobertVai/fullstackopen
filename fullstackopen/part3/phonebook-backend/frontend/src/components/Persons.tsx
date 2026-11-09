import type { Person } from '../types'
import styles from './Persons.module.css'

type PersonsProps = {
  persons: Person[]
  onDelete: (person: Person) => void
}

const Persons = ({ persons, onDelete }: PersonsProps) => (
  <ul className={styles.list}>
    {persons.map((person) => (
      <li key={person.id} className={styles.person}>
        <div>
          <strong>{person.name}</strong>
          <p>{person.number}</p>
        </div>
        <button type="button" className={styles.delete} onClick={() => onDelete(person)}>
          Delete
        </button>
      </li>
    ))}
  </ul>
)

export default Persons
