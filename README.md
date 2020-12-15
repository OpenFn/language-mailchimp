# language-mailchimp

An OpenFn **_adaptor_** for building integration jobs for use with the Mailchimp.

## Documentation

- View the documentation at https://openfn.github.io/language-mailchimp/
- To update the documentation site, run: `./node_modules/.bin/jsdoc --readme ./README.md ./lib -d docs`

## Helper Functions

### post(...)

#### sample configuration

```json
{
  "username": "taylor@openfn.org",
  "password": "supersecret"
}
```

#### sample expression using operation

```js
post({
  "url": "api/v1/forms/data/wide/json/formId",
  "body": {"a":1}
  "headers": {}
})
```

### createContact(...)

#### sample expression using operation

_Example to consider for development_

```js
createContact({
  "url": "api/outbreaks/{id}/contacts",
  "body": {"outbreak": "id", "firstname": "aleksa", ...}
  "headers": {}
})
```

## Development

Clone the repo, run `npm install`.

Run tests using `npm run test` or `npm run test:watch`

Build the project using `make`.
