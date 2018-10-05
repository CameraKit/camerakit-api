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
$ brew install postgresql
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

### Environment Variables
The environment variables live in the `.env` file. This file is loaded by the dotenv loader in `main.ts`. There are variables for both database and CORS setup. Below is the `.env` file specification.
```
variable                   type    sample value
-----------------------------------------------------
TYPEORM_CONNECTION         string  postgres
TYPEORM_HOST               string  localhost
TYPEORM_USERNAME           string  root
TYPEORM_PASSWORD           string  root
TYPEORM_DATABASE           string  production
TYPEORM_PORT               number  5432
TYPEORM_SYNCHRONIZE        boolean true
TYPEORM_LOGGING            boolean true
TYPEORM_ENTITIES           string  src/**/*.entity.ts
SERVER_PORT                number  3001
SERVER_HOST                string  localhost
PASSPORT_AUTH_SECRET       string  vc@oix3p32@ios4#fds$32pa
STRIPE_PUBLISHABLE_API_KEY string  pk_test_oeKdoJLApxYsyAum
STRIPE_SECRET_API_KEY      string  sk_test_KJ38a03KaduQw2
ALLOWED_ORIGINS            string  https://yourdomain.tld,https://otherdomain.tld
ALLOWED_METHODS            string  'GET,HEAD,PUT,PATCH,POST,DELETE'
AWS_SES_ACCESS_KEY_ID      string  dCEa39ymXcgM9XF3HT8g
AWS_SES_SECRET_ACCESS_KEY  string  DoMcYU12AD3MAzD4tRlXSz5Z0XxC1MipofloVjYf
AWS_SES_REGION             string  us-east-1
```

`ALLOWED_ORIGINS` is a comma separated list of URLs. Each URL includes protocol, domain and port. 

`ALLOWED_METHODS` is a comma separated list of methods.

An example env file `.env.sample` is included in this repository.

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
```
Endpoint          Method    Params            
---------------------------------------------
/auth/login       POST      email:    string
                            password: string

/auth/register    POST      email:    string
                            password: string

/contact          POST      email:    string
                            name:     string
                            company:  string
                            message:  string
```

Responses
```
Endpoint          Success Response                      Error Response
--------------------------------------------------------------------------------------------------------------------------------
/auth/login       code: 200                             code: 403
                  content: { user }                     content: { "message": "Email or password wrong!" },
                                                                 { "message": "Email and password are required!" }

/auth/register    code: 200                             code: 403
                  content: { expresIn, accessToken }    content: { "message": "Email exists" }
                                                                 { "message": "Email and password are required!" }

/contact          code: 200
                  content: { "message": "Success" }     code: 403
                                                        content: { "message": "Name, Email, Company and Message are required" }

                                                        code: 500
                                                        content: { "message": "Error sending the email" }
```