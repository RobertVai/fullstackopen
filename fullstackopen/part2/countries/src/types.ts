export type Country = {
  cca3: string
  name: { common: string; official: string }
  capital?: string[]
  capitalInfo?: { latlng?: number[] }
  latlng?: number[]
  area: number
  population: number
  languages?: Record<string, string>
  flags: { png: string; svg: string; alt?: string }
}

export type WeatherResponse = {
  current: {
    temperature_2m: number
    wind_speed_10m: number
    weather_code: number
  }
  current_units: {
    temperature_2m: string
    wind_speed_10m: string
  }
}
