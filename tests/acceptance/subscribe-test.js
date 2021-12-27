import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn, signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import window from 'ember-window-mock';

module('Acceptance | subscribe-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  test('new user can start checkout session', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    await coursesPage.visit();
    await coursesPage.accountDropdown.toggle();
    await coursesPage.accountDropdown.clickOnLink('Subscribe');
    await coursesPage.subscribeModal.clickOnSubscribeButton();

    assert.equal(window.location.href, 'https://test.com/checkout_session', 'Clicking subscribe button should redirect to checkout session URL');
  });

  test('new user can wait for subscriptions to sync after successful checkout session', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    await coursesPage.visit({ action: 'checkout_session_successful' });
    // TODO: test
  });

  test('subscriber can manage subscription', async function (assert) {
    signInAsSubscriber(this.owner);
    testScenario(this.server);

    await coursesPage.visit();
    await coursesPage.accountDropdown.toggle();
    await coursesPage.accountDropdown.clickOnLink('Manage Subscription');

    assert.equal(
      window.location.href,
      'https://test.com/billing_session',
      'Clicking manage subscription button should redirect to billing session URL'
    );
  });
});
