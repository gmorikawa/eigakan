# Authentication

This application uses a __stateless session authentication model__, in which the logged user possess a JWT token with a _expire date_. As soon as this token becomes expired, the user cannot access the contents and must redo the login step.

## Steps

To login in the system, the user should send a `POST` request to `/api/auth/login` endpoint with the `username` and `password` in _request's body_ in __JSON__ format. If a user with given `username` exists, then it is checked if the given `password` matches with the hashed `password` in the database. If this step is also matched, a token is generated and the user will receive the following payload with a JWT token:

```json
{
    "token": "<token_value>"
}
```

The generated token has the credentials of a `user` without a password, and has a validity period of 7 days from its issuing.

In every endpoint that requires user authorization, this authentication token must be sent in the request headers as `Authorization`. For example, when registering a new user:

```http
POST /api/users HTTP/1.1
Host: www.example.com
Content-Type: application/json
Content-Length: 97
Authentication: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30

{
    "username": "gmorikawa",
    "password": "12345678",
    "fullname": "Gabriel Morikawa",
}
```