import type { Country } from '../types'
import styles from './CountryDetails.module.css'

type CountryDetailsProps = { country: Country }

const CountryDetails = ({ country }: CountryDetailsProps) => (
  <section className={styles.details}>
    <h2>{country.name.common}</h2>
    <div className={styles.summary}>
      <div>
        <p><strong>Capital:</strong> {country.capital?.join(', ') || 'Not available'}</p>
        <p><strong>Area:</strong> {country.area.toLocaleString()} km²</p>
        <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
        <h3>Languages</h3>
        <ul>
          {Object.values(country.languages ?? {}).length > 0
            ? Object.values(country.languages ?? {}).map((language) => <li key={language}>{language}</li>)
            : <li>Not available</li>}
        </ul>
      </div>
      <img className={styles.flag} src={country.flags.svg} alt={country.flags.alt ?? `Flag of ${country.name.common}`} />
    </div>
  </section>
)

export default CountryDetails
