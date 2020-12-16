# language-mailchimp

An OpenFn **_adaptor_** for building integration jobs for use with the Mailchimp
marketing API.

## Documentation

- View the documentation at https://openfn.github.io/language-mailchimp/
- To update the documentation site, run: `./node_modules/.bin/jsdoc --readme ./README.md ./lib -d docs`

#### sample configuration

```json
{
  "apiKey": "someSecretShhh",
  "server": "us11"
}
```

#### sample expression with multiple operations

```js
upsertMembers({
  listId: 'someId',
  users: state =>
    state.response.body.rows.map(u => ({
      email: u.email,
      status: u.allow_other_emails ? 'subscribed' : 'unsubscribed',
      mergeFields: { FNAME: u.first_name, LNAME: u.last_name },
    })),
  options: {},
});

tagMembers({
  listId: 'someId', // All Subscribers
  tagId: 'someTag', // User
  members: state => state.response.body.rows.map(u => u.email),
});

tagMembers({
  listId: 'someId', // All Subscribers
  tagId: 'someTag', // Other Emails Allowed
  members: state =>
    state.response.body.rows
      .filter(u => u.allow_other_emails)
      .map(u => u.email),
});
```

## Development

Clone the repo, run `npm install`.

Run tests using `npm run test` or `npm run test:watch`

Build the project using `make`.
