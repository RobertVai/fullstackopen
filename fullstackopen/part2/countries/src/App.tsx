import { useEffect, useState } from 'react'
import axios from 'axios'
import CountryDetails from './components/CountryDetails'
import Weather from './components/Weather'
import type { Country } from './types'
import styles from './App.module.css'

const App = () => {
  const [countries, setCountries] = useState<Country[]>([])
  const [search, setSearch] = useState('')
  const [selectedCode, setSelectedCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    axios.get<Country[]>('https://studies.cs.helsinki.fi/restcountries/api/all', {
      signal: controller.signal,
    })
      .then((response) => setCountries(response.data))
      .catch((error: unknown) => {
        if (!axios.isCancel(error)) setError('Could not load countries.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [])

  const matches = countries.filter((country) =>
    country.name.common.toLowerCase().includes(search.trim().toLowerCase()),
  )
  const currentCountry = matches.length === 1
    ? matches[0]
    : matches.find((country) => country.cca3 === selectedCode)

  const handleSearch = (value: string) => {
    setSearch(value)
    setSelectedCode(null)
  }

  return (
    <main className={styles.page}>
      <header className={styles.heading}>
        <span>Full Stack Open · Part 2</span>
        <h1>Countries</h1>
        <p>Explore country information and live weather.</p>
      </header>

      <label className={styles.field}>
        <span>Find countries</span>
        <input
          value={search}
          onChange={(event) => handleSearch(event.target.value)}
          placeholder="Type a country name..."
        />
      </label>

      <section className={styles.panel}>
        {loading && <p>Loading countries...</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && !error && !search.trim() && <p>Start typing to search for a country.</p>}
        {!loading && !error && search.trim() && matches.length > 10 && (
          <p>Too many matches, specify another filter.</p>
        )}
        {!loading && !error && search.trim() && matches.length === 0 && (
          <p>No countries found.</p>
        )}
        {!loading && !error && search.trim() && matches.length > 1 && matches.length <= 10 && !currentCountry && (
          <ul className={styles.countryList}>
            {matches.map((country) => (
              <li key={country.cca3}>
                <span>{country.name.common}</span>
                <button type="button" onClick={() => setSelectedCode(country.cca3)}>Show</button>
              </li>
            ))}
          </ul>
        )}
        {!loading && !error && search.trim() && currentCountry && (
          <>
            {matches.length > 1 && (
              <button className={styles.back} type="button" onClick={() => setSelectedCode(null)}>
                Back to results
              </button>
            )}
            <CountryDetails country={currentCountry} />
            <Weather key={currentCountry.cca3} country={currentCountry} />
          </>
        )}
      </section>
    </main>
  )
}

export default App
