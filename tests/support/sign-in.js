export default function (owner) {
  let serverVariables = owner.lookup('service:serverVariables');

  // This is actually a string, but ember-cli-server-variables parses it
  serverVariables.set('currentUserPayload', {
    type: 'users',
    id: '63c51e91-e448-4ea9-821b-a80415f266d3',
    attributes: {
      'avatar-url': 'https://github.com/rohitpaulk.png',
      'created-at': '2021-08-29T16:50:12.551986+00:00',
      'github-username': 'rohitpaulk',
      username: 'rohitpaulk',
    },
  });
}
