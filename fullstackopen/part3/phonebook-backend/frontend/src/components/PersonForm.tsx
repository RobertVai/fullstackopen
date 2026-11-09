import type { FormEvent } from 'react'

type PersonFormProps = {
  name: string
  number: string
  onNameChange: (value: string) => void
  onNumberChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const PersonForm = ({
  name, number, onNameChange, onNumberChange, onSubmit,
}: PersonFormProps) => (
  <form onSubmit={onSubmit} className="form-grid">
    <label className="field">
      <span>Name</span>
      <input required value={name} onChange={(event) => onNameChange(event.target.value)} />
    </label>
    <label className="field">
      <span>Number</span>
      <input required value={number} onChange={(event) => onNumberChange(event.target.value)} />
    </label>
    <button type="submit">Save contact</button>
  </form>
)

export default PersonForm
