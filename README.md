# Real World HTTP Servers

## Content

- SECURITY
- REST
- Middleware


## Security

### Security Issue #1

- Storing Passwords - why not plaintext
- How to encrypt passwords (bcrypt)
- hashing

- [bcrypt](./images/bcrypt.jpg)

### Security Issue #2

- User can see data in cookie and modify, becoming any other user
  = Solution: encrypt the cookie

### Security Issue #3

- Stealing cookies
- HTTP is plain-text
- Man-in-the-middle (we know NSA, etc. do this)
- [Man-in-the-middle attack](./images/Man-In-The-Middle-Attack.png)
- Firesheep: https://en.wikipedia.org/wiki/Firesheep
- Solution: HTTPS (End-to-End Encryption)

- [Man-In-The-Middle-Attack.png](./Man-In-The-Middle-Attack.png)

## REST

Representational State Transfer

- REST is a pattern, a convention to organize our url structure

  - Resource based routes convention

  - The key abstraction of information in REST is a resource.

  - REST uses a resource identifier to identify the particular resource involved in an interaction between components.

  - It should use http verbs to express what the request wants to accomplish
  - Resource information must be part of the url
  - It uses common data formats (JSON for API)
  - Communication is stateless
  - Each request must pass all information needed to fulfill the request
  - Idempotency of requests

### http methods

What language does a client use to makes request to the server ? http

http protocol gives us verbs

- Create => Create a new ressource => Post
- Read => Get a resource => Get
- Update => Change a resource => Put
- Delete => Delete a resource => Delete

### Scoping information

- collections vs single entity
- which one?

### End Points

By following REST principles, it allows us to design our end points:

| Action                                | http verb | end point                |
| ------------------------------------- | --------- | ------------------------ |
| List all quotes                       | GET       | get '/quotes'            |
| Get a specific quote                  | GET       | get '/quotes/:id'        |
| Display the new form                  | GET       | get '/quotes/new         |
| Create a new quote                    | POST      | post '/quotes            |
| Display the form for updating a quote | GET       | get '/quotes/:id/update' |
| Update the quotes                     | PUT       | put '/quotes/:id         |
| Deleting a specific quote             | DELETE    | delete '/quotes:id'      |

#### Nested Resources

You may need to access a nested resources. For example, you need to create a new comment.

| Action               | http verb | end point                  |
| -------------------- | --------- | -------------------------- |
| Create a new comment | POST      | post '/quotes/:id/comments |

- [REST Exercise](https://gist.github.com/DominicTremblay/941afbe1295ec666d3539d448df7c776)

## Middleware

- Middleware is a piece of software that sits in between the request and the response.
- [middleware.png](./middleware.png)
(ref: https://developer.okta.com/blog/2018/09/13/build-and-understand-express-middleware-through-examples)


- [Middleware](./images/middleware.png)


## References

### Bcrypt
- https://auth0.com/blog/hashing-in-action-understanding-bcrypt/
- https://en.wikipedia.org/wiki/Bcrypt
- https://dev.to/sylviapap/bcrypt-explained-4k5c

### REST
- About REST and naming convention : https://restfulapi.net/resource-naming/

### Middleware
- Method override : https://www.npmjs.com/package/method-override
- Express middleware : https://expressjs.com/en/guide/using-middleware.html
