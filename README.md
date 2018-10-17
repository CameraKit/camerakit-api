# CameraKit API

The API to support the website of [CameraKit](https://github.com/camerakit/camerakit-android) - *takes one of the hardest Android APIs and makes it into a high level and easy to use library that solves all of your problems.*

  [Setup](#setup)
  
  [Environment Variables](#environment-variables)
  
  [Running](#running-the-app)
  
  [API](#api)
  
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

## Environment Variables
The environment variables live in the `.env` file. This file is loaded by the dotenv loader in `main.ts`. There are variables for both database and CORS setup. Below is the `.env` file specification.

| variable | type | sample value |
| ----- | --------- | ----------------------- |
| TYPEORM_CONNECTION |         string |  `postgres` |
| TYPEORM_HOST |               string |  `localhost` |
| TYPEORM_USERNAME |           string |  `root` |
| TYPEORM_PASSWORD |           string |  `root` |
| TYPEORM_DATABASE |           string |  `production` |
| TYPEORM_PORT |               number |  `5432` |
| TYPEORM_SYNCHRONIZE |        boolean | `true` |
| TYPEORM_LOGGING |            boolean | `true` |
| TYPEORM_ENTITIES |           string |  `src /**/*.entity.ts`|
| TYPEORM_SSL |                boolean | `true` |
| REVERSE_PROXY |              boolean | `false` |
| SERVER_PORT |                number |  `3001` |
| SERVER_HOST |                string |  `localhost` |
| PASSPORT_AUTH_SECRET |       string |  `vc@oix3p32@ios4#fds$32pa` |
| STRIPE_PUBLISHABLE_API_KEY | string |  `pk_test_oeKdoJLApxYsyAum` |
| STRIPE_SECRET_API_KEY |      string |  `sk_test_KJ38a03KaduQw2` |
| STRIPE_WEBHOOK_SECRET |      string |  `whsec_i4A39Ndu3JA3u1` |
| ALLOWED_ORIGINS |            string |  `https://yourdomain.tld,https://otherdomain.tld` |
| ALLOWED_METHODS |            string |  `'GET,HEAD,PUT,PATCH,POST,DELETE'` |
| AWS_SES_ACCESS_KEY_ID |      string |  `dCEa39ymXcgM9XF3HT8g` |
| AWS_SES_SECRET_ACCESS_KEY |  string |  `DoMcYU12AD3MAzD4tRlXSz5Z0XxC1MipofloVjYf` | 
| AWS_SES_REGION |             string |  `us-east-1` |
| CONTACT_NOREPLY_EMAIL |      string |  `noreply@camerakit.io` |
| CONTACT_INTERNAL_EMAIL |     string |  `contact@camerakit.io` |


`ALLOWED_ORIGINS` is a comma separated list of URLs. Each URL includes protocol, domain and port. 

`ALLOWED_METHODS` is a comma separated list of methods.

`CONTACT_INTERNAL_EMAIL` is the team address that emails are sent to containing the information submitted on the contact page.

`CONTACT_NOREPLY_EMAIL` is the address used to send both the confirmation and internal emails.

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

#### Auth
- [`POST` Log in](#log-in)
#### Contact
- [`POST` Send email](#send-email)
#### Payment
- [`POST` Log event](#log-event)
- [`POST` Add support](#add-support)
- [`DELETE` Remove subscription](#remove-subscription)

#### Users
- [`POST` Register user](#register-user)
- [`GET` User](#get-user)
- [`GET` User subscriptions](#get-subscriptions)
- [`PUT` Update user](#update-user)
- [`DELETE` Remove user](#remove-user)
	


## Auth
### Log in

Log in an existing user to get an access token for future requests. 

	POST /auth/login

### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| email			| String 			|  Account email							|
| password			| String 			| Account password 							|

### Success Response

```
HTTP/1.1 200 OK
{
  "id":"f5afe0ca-742f-42f2-9e46-e79153694334",
  "expiresIn":3600000,
  "accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpbmdvIiwiaWF0djoxNTM5NzQzNTE1LCJleHAiOjE1NDMzNDM1MTV9.VJI3CvgvQhz8--hJ0UnfWq-RH3NzQtz6-tuNaLZNz0c"
}
```
#### *Authorization header*
The `accessToken` from the [log in](#log-in) response must be sent for all protected routes.

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| Authorization			| String			|  Bearer token of logged in user |

Using the above `Success Response`, the `Authorization` header's value would be
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpbmdvIiwiaWF0djoxNTM5NzQzNTE1LCJleHAiOjE1NDMzNDM1MTV9.VJI3CvgvQhz8--hJ0UnfWq-RH3NzQtz6-tuNaLZNz0c
```
## Contact

### Send email

Log in an existing user to get an access token for future requests. 

	POST /contact


#### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| name			| String 			|  The sender's name |
| email			| String 			| The sender's email			|
| company			| String 			|  The sender's company name |
| message		| String 			| The message body	|

#### Success Response

```
HTTP/1.1 200 OK
{ 
  "message": "Success"
}
```
## Payment

### Log event

Echo all events sent by `Stripe`.

	POST /payment/event

#### Success Response

```
HTTP/1.1 200 OK
```

### Add support

Support CameraKit with a one time or recurring payment.

	POST /payment/support


#### Headers

Requires [Authorization header](#authorization-header)	

#### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| email			| String 			|  Email used for the support |
| monthly			| Boolean 			| True for recurring payment	|
| token			| String 			|  Stripe token |
| plan		| String 			| *Optional* Stripe subscription plan	|

#### Success Response

```
HTTP/1.1 200 OK
{ 
  "status": "active",
  "ok": "true"
}
```
### Remove subscription

Removes the user's active subscriptions.

	DELETE /payment/support


#### Headers

Requires [Authorization header](#authorization-header)	

#### Success Response

```
HTTP/1.1 200 OK
{
  "ok": "true"
}
```
## Users

### Register user

Add user.

	POST /users

#### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| email			| String 			|  User's email |
| password			| String 			| User's password			|
| emailConfirmed | String | *optional* If email is verified |
| firstName | String | *optional* User's first name |
| lastName | String | *optional* User's last name |
| companyName | String |*optional*  User's company name |
| companyDescription | String |*optional*  User's company description |

#### Success Response

```
HTTP/1.1 200 OK
{
  "email":"test@email.com",
  "password":null,
  "emailConfirmed":false,
  "firstName":Greg,
  "lastName":Smith,
  "companyName":Alterac,
  "companyDescription":null,"id":"191e7252-662c-4b69-885a-0aa505bea6cf"
}
```
### Get user

Get user.

	GET /users

#### Headers

Requires [Authorization header](#authorization-header)	

#### Success Response

```
HTTP/1.1 200 OK
{
  "email":"test@email.com",
  "password":null,
  "emailConfirmed":false,
  "firstName":Greg,
  "lastName":Smith,
  "companyName":Alterac,
  "companyDescription":null,"id":"191e7252-662c-4b69-885a-0aa505bea6cf"
}
```
### Get subscriptions

Get all of user's active subscriptions.

	GET /users/subscriptions

#### Headers

Requires [Authorization header](#authorization-header)	

#### Success Response

```
HTTP/1.1 200 OK
[
  {
    "id":"9107315f-d0a1-4333-86a8-b444e58a7cc4",
    "userId":"191e7252-662c-4b69-885a-0aa505bea6cf",
    "price":500,
    "product":"subscription",
    "source":"cus_IeuDAqpcNek",
    "subscriptionId":"sub_IeuDAqpcNek",
    "startDate":1539745874,
    "endDate":1542424274,
    "status":"active"
  }
]
```
### Update user

Update user with any new properties sent.

	PUT /users

#### Headers

Requires [Authorization header](#authorization-header)

#### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| email			| String 			|  *optional* New email |
| password			| String 			| *optional* New password			|
| emailConfirmed | String | *optional* If email is verified |
| firstName | String | *optional* New first name |
| lastName | String | *optional* New last name |
| companyName | String |*optional*  New company name |
| companyDescription | String |*optional* New company description |	

#### Success Response

```
HTTP/1.1 200 OK
{
  "email":"newtest@email.com",
  "password":null,
  "emailConfirmed":true,
  "firstName":Greg,
  "lastName":Schmidt,
  "companyName":Alterac,
  "companyDescription":null,"id":"191e7252-662c-4b69-885a-0aa505bea6cf"
}
```
### Remove user

Delete user.

	DELETE /users

#### Headers

Requires [Authorization header](#authorization-header)

#### Success Response

```
HTTP/1.1 200 OK
{
  "success": true
}
```
