# camerakit-api

The API to support the website of one of the hardest Android APIs.

## Setup

### Install Dependencies
```bash
$ yarn
```
### Create local PostgreSQL Server
First install postgres:
```bash
$ brew install postresql
```
The default database is named `postgres`. To interact with the database type:
```bash
$ psql postgres

postgres=#
```
Next set the password for the default user. 
```bash
# See the current users
postgres=# \du 

# Set password for a user
postgres=# \password <Role Name>

# Exit psql
postgres=# \q
```
Finally setup the .env file from Dropbox with your database information. 

### Environment Variables
We need to declare additional environment variables as shown below. Make sure you update the `<value>` tags with their actual values meant for production.
```
ALLOWED_ORIGINS=['<URL>','<URL>']
ALLOWED_METHODS='<method>,<method>'
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

