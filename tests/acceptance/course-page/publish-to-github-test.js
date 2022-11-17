import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import window from 'ember-window-mock';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | publish-to-github-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  test('can initiate GitHub integration setup', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(currentURL(), '/courses/redis', 'current URL is course page URL');

    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.clickOnAction('Publish to GitHub');

    assert.ok(coursePage.configureGithubIntegrationModal.isOpen, 'configure github modal is open');
  });

  test('can complete GitHub integration setup', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    this.server.create('github-app-installation', { user: currentUser, githubConfigureUrl: 'https://google.com' });

    await coursePage.visit({ course_slug: 'redis', action: 'github_app_installation_completed' });
    assert.ok(coursePage.configureGithubIntegrationModal.isOpen, 'configure github modal is open');

    window.confirm = () => true;

    await coursePage.configureGithubIntegrationModal.clickOnPublishButton();
    await coursePage.configureGithubIntegrationModal.clickOnDisconnectRepositoryButton();
    await coursePage.configureGithubIntegrationModal.clickOnPublishButton();
  });

  test('publishing to GitHub removes daily limit', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    this.server.create('course-stage-completion', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position').toArray()[1],
    });

    this.server.create('github-app-installation', { user: currentUser, githubConfigureUrl: 'https://google.com' });

    this.server.create('course-stage-feedback-submission', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position').toArray()[1],
      status: 'closed',
    });

    let freeUsageRestriction = this.server.create('free-usage-restriction', {
      user: currentUser,
      expiresAt: new Date(new Date().getTime() + 86400000),
    });

    window.confirm = () => true;

    await coursePage.visit({ course_slug: 'redis' });

    assert.ok(coursePage.activeCourseStageItem.hasUpgradePrompt, 'course stage item that is not free should have upgrade prompt');

    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.clickOnAction('Publish to GitHub');

    await coursePage.configureGithubIntegrationModal.clickOnPublishButton();
    freeUsageRestriction.update({ expiresAt: new Date(new Date().getTime() - 86400000) });
    assert.notOk(coursePage.activeCourseStageItem.hasUpgradePrompt, 'course stage item should not have upgrade prompt');
  });
});