# camerakit-api

The API to support the website of one of the hardest Android APIs.

## Installation

```bash
$ yarn
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

