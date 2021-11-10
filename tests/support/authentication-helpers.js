export function signIn(owner) {
  doSignIn(owner, {
    'avatar-url': 'https://github.com/rohitpaulk.png',
    'created-at': '2021-08-29T16:50:12.551986+00:00',
    'github-username': 'rohitpaulk',
    'is-beta-participant': false,
    'has-active-subscription': false,
    username: 'rohitpaulk',
  });
}

export function signInAsBetaParticipant(owner) {
  doSignIn(owner, {
    'avatar-url': 'https://github.com/rohitpaulk.png',
    'created-at': '2021-08-29T16:50:12.551986+00:00',
    'github-username': 'rohitpaulk',
    'is-beta-participant': true,
    'has-active-subscription': false,
    username: 'rohitpaulk',
  });
}

export function signInAsSubscriber(owner) {
  doSignIn(owner, {
    'avatar-url': 'https://github.com/rohitpaulk.png',
    'created-at': '2021-08-29T16:50:12.551986+00:00',
    'github-username': 'rohitpaulk',
    'is-beta-participant': false,
    'has-active-subscription': true,
    username: 'rohitpaulk',
  });
}

function doSignIn(owner, attributes) {
  let serverVariables = owner.lookup('service:serverVariables');

  // This is actually a string, but ember-cli-server-variables parses it
  serverVariables.set('currentUserPayload', {
    type: 'users',
    id: '63c51e91-e448-4ea9-821b-a80415f266d3',
    attributes: attributes,
  });
}
