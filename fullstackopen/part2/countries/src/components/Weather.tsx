import { useEffect, useState } from 'react'
import axios from 'axios'
import type { Country, WeatherResponse } from '../types'
import styles from './Weather.module.css'

type WeatherProps = { country: Country }

type WeatherState = {
  loading: boolean
  error: string | null
  data: WeatherResponse | null
}

const describeWeather = (code: number) => {
  if (code === 0) return 'Clear sky ☀️'
  if (code <= 3) return 'Partly cloudy ⛅'
  if (code === 45 || code === 48) return 'Foggy 🌫️'
  if (code <= 67) return 'Rainy 🌧️'
  if (code <= 77) return 'Snowy ❄️'
  if (code <= 82) return 'Rain showers 🌦️'
  if (code <= 86) return 'Snow showers 🌨️'
  if (code >= 95) return 'Thunderstorm ⛈️'
  return 'Current conditions'
}

const Weather = ({ country }: WeatherProps) => {
  const [weather, setWeather] = useState<WeatherState>({ loading: true, error: null, data: null })
  const [latitude, longitude] = country.capitalInfo?.latlng ?? country.latlng ?? []

  useEffect(() => {
    if (latitude === undefined || longitude === undefined) {
      setWeather({ loading: false, error: 'Coordinates not available.', data: null })
      return
    }

    const controller = new AbortController()
    setWeather({ loading: true, error: null, data: null })

    axios.get<WeatherResponse>('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude,
        longitude,
        current: 'temperature_2m,wind_speed_10m,weather_code',
      },
      signal: controller.signal,
    })
      .then((response) => setWeather({ loading: false, error: null, data: response.data }))
      .catch((error: unknown) => {
        if (!axios.isCancel(error)) {
          setWeather({ loading: false, error: 'Could not load weather.', data: null })
        }
      })

    return () => controller.abort()
  }, [latitude, longitude])

  return (
    <section className={styles.weather}>
      <h3>Weather in {country.capital?.[0] ?? country.name.common}</h3>
      {weather.loading && <p>Loading weather...</p>}
      {weather.error && <p role="alert">{weather.error}</p>}
      {weather.data && (
        <div className={styles.report}>
          <p className={styles.temperature}>
            {weather.data.current.temperature_2m}{weather.data.current_units.temperature_2m}
          </p>
          <div>
            <p>{describeWeather(weather.data.current.weather_code)}</p>
            <p>Wind: {weather.data.current.wind_speed_10m} {weather.data.current_units.wind_speed_10m}</p>
          </div>
        </div>
      )}
      <small>Weather data: Open-Meteo</small>
    </section>
  )
}

export default Weather
