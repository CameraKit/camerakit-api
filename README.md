# camerakit-api

The API to support the website of one of the hardest Android APIs.

## Installation

Install dependencies
```bash
$ yarn
```
Configure `.env` file. **An error will be thrown for extra or missing variables.**

```
variable                   type    default
-----------------------------------------------------
TYPEORM_CONNECTION         string  postgres
TYPEORM_HOST               string
TYPEORM_USERNAME           string
TYPEORM_PASSWORD           string
TYPEORM_DATABASE           string  postgres
TYPEORM_PORT               number  5432
TYPEORM_SYNCHRONIZE        boolean true
TYPEORM_LOGGING            boolean true
TYPEORM_ENTITIES           string  src/**/*.entity.ts
SERVER_PORT                number  3001
PASSPORT_AUTH_SECRET       string
STRIPE_PUBLISHABLE_API_KEY string
STRIPE_SECRET_API_KEY      string
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```
## API

* **URL**

  /auth/register
  
  /auth/login

* **Method:**

  `POST`
  
* **Data Params**

  `email=[string]`
  
  `password=[string]`

* **Success Response:**

  /login
  * **Code:** 200 <br />
  * **Content:** `{ user }`
    
  /register
  * **Code:** 200 <br />
  *  **Content:** `{ expresIn, accessToken }`

* **Error Response:**

  /login
  
    **Content:** `{"message":"Email exists"}`, `{"message":"Email and password are required!"}`
    
  /register
  
    **Content:** `{"message":"Email or password wrong!"}`, `{"message":"Email and password are required!"}`

