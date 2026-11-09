type FilterProps = {
  query: string
  onQueryChange: (value: string) => void
}

const Filter = ({ query, onQueryChange }: FilterProps) => (
  <label className="field">
    <span>Filter by name</span>
    <input
      value={query}
      onChange={(event) => onQueryChange(event.target.value)}
      placeholder="Search contacts"
    />
  </label>
)

export default Filter
