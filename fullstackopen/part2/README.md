# Full Stack Open — Part 2

TypeScript + React implementations for exercises 2.1–2.20.

## Projects

- `courseinfo`: exercises 2.1–2.5. Multiple courses, reusable Course component, exercise totals with `reduce`.
- `phonebook`: exercises 2.6–2.17. Controlled forms, filtering, REST CRUD via Axios/json-server, confirmations, notification feedback and 404 recovery.
- `countries`: exercises 2.18–2.20. Search for countries, show selected country, flag, languages and current weather for the capital using Open-Meteo (no API key required).

## Running

Requires Node.js and npm. Install dependencies separately within each application:

```sh
cd part2/courseinfo
npm install
npm run dev
```

For the phonebook, start **two terminals** after `npm install`:

```sh
# Terminal 1, in part2/phonebook
npm run server

# Terminal 2, in part2/phonebook
npm run dev
```

For countries:

```sh
cd part2/countries
npm install
npm run dev
```

Build verification for each project: `npm run build`.

## Notes

- `phonebook/db.json` is intentionally committed with starter data. `json-server` updates that file as contacts are edited.
- The phonebook Vite proxy maps requests from `/api/persons` to `localhost:3001/persons`.
- Countries uses the University of Helsinki Rest Countries proxy and Open-Meteo's public forecast endpoint.
- No secrets, API keys or `.env` files are required.
