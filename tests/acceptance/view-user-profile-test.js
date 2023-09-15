import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import userPage from 'codecrafters-frontend/tests/pages/user-page';
import { assertTooltipContent } from 'ember-tooltips/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn, signInAsAdmin } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | view-user-profile', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it renders', async function (assert) {
    testScenario(this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ slug: 'python' });
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let docker = this.server.schema.courses.findBy({ slug: 'docker' });

    this.server.create('course-participation', {
      course: redis,
      language: python,
      user: currentUser,
      currentStage: redis.stages.models.sortBy('position')[1],
    });

    this.server.create('course-participation', {
      course: redis,
      language: go,
      user: currentUser,
      currentStage: redis.stages.models.sortBy('position')[5],
    });

    this.server.create('course-participation', {
      course: docker,
      language: go,
      user: currentUser,
      currentStage: redis.stages.models.sortBy('position')[3],
    });

    this.server.create('user-profile-event', {
      descriptionMarkdown: 'Joined CodeCrafters',
      user: currentUser,
      type: 'CreatedAccountEvent',
      occurredAt: new Date('2020-01-01'),
    });

    this.server.create('user-profile-event', {
      descriptionMarkdown: 'Started the [Build your own Redis](https://google.com) challenge using C#',
      user: currentUser,
      type: 'StartedCourseEvent',
      occurredAt: new Date('2020-01-02'),
    });

    this.server.create('user-profile-event', {
      descriptionMarkdown: 'Completed the [Build your own Redis](https://google.com) challenge using C#',
      user: currentUser,
      type: 'CompletedCourseEvent',
      occurredAt: new Date('2020-02-01'),
    });

    await userPage.visit({ username: 'rohitpaulk' });
    await percySnapshot('User profile');

    assert.strictEqual(1, 1);
  });

  // TODO: Add test for not found
  test('it does not have a label if user is not staff or challenge author', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const user = this.server.schema.users.findBy({ username: 'rohitpaulk' });

    await userPage.visit({ username: user.username });
    assert.false(userPage.userLabel.isPresent);
  });

  test('it has the staff label if user is staff', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const user = this.server.schema.users.findBy({ username: 'rohitpaulk' });
    user.update({ isStaff: true });

    await userPage.visit({ username: user.username });
    assert.strictEqual(userPage.userLabel.text, 'staff');

    await userPage.userLabel.hover();
    assertTooltipContent(assert, {
      contentString: 'This user works at CodeCrafters',
    });
  });

  test('it has the staff label if user is staff and course author', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const user = this.server.schema.users.findBy({ username: 'rohitpaulk' });
    user.update({ isStaff: true });
    user.update({ authoredCourseSlugs: ['redis'] });

    await userPage.visit({ username: user.username });
    assert.strictEqual(userPage.userLabel.text, 'staff');
  });

  test('it has the challenge author label if user is course author', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const user = this.server.schema.users.findBy({ username: 'rohitpaulk' });
    user.update({ authoredCourseSlugs: ['redis'] });

    await userPage.visit({ username: user.username });
    assert.strictEqual(userPage.userLabel.text, 'challenge author');

    await userPage.userLabel.hover();
    assertTooltipContent(assert, {
      contentString: 'This user is the author of one or more CodeCrafters challenges',
    });
  });

  test('it has the admin profile button if user is admin', async function (assert) {
    testScenario(this.server);
    signInAsAdmin(this.owner, this.server);

    const user = this.server.schema.users.findBy({ username: 'rohitpaulk' });
    await userPage.visit({ username: user.username });
    assert.ok(userPage.adminProfileButton.isPresent);
  });

  test('it does not have the admin profile button if user is not admin', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const user = this.server.schema.users.findBy({ username: 'rohitpaulk' });
    await userPage.visit({ username: user.username });
    assert.notOk(userPage.adminProfileButton.isPresent);
  });
});
