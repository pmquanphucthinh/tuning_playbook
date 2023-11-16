import percySnapshot from '@percy/ember';
import testerVersionsPage from 'codecrafters-frontend/tests/pages/course-admin/tester-versions-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL, settled } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signInAsStaff, signInAsCourseAuthor } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-admin | view-tester-versions', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  test('it renders when no tester versions are present', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    await testerVersionsPage.visit({ course_slug: 'redis' });
    assert.strictEqual(testerVersionsPage.testerVersionListItem.length, 0, 'should have no tester versions');
    await percySnapshot('Admin - Course Tester Versions - No Tester Versions');
  });

  test('it renders when tester versions are present', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.server.create('course-tester-version', {
      activator: this.server.schema.users.first(),
      course: this.server.schema.courses.findBy({ slug: 'redis' }),
      commitSha: '1234567890',
      createdAt: new Date(2021, 1, 1),
      isLatest: false,
      isActive: false,
      tagName: 'v10',
    });

    this.server.create('course-tester-version', {
      activator: this.server.schema.users.first(),
      course: this.server.schema.courses.findBy({ slug: 'redis' }),
      commitSha: '1234567890',
      createdAt: new Date(2021, 1, 1),
      isLatest: true,
      isActive: true,
      lastActivatedAt: new Date(2021, 1, 1),
      tagName: 'v11',
    });

    await testerVersionsPage.visit({ course_slug: 'redis' });
    assert.strictEqual(testerVersionsPage.testerVersionListItem.length, 2, 'should have 2 tester versions');
    await percySnapshot('Admin - Course Tester Versions - With Tester Versions');
  });

  test('it should have a working button for syncing with github', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.server.create('course-tester-version', {
      activator: this.server.schema.users.first(),
      course: this.server.schema.courses.findBy({ slug: 'redis' }),
      commitSha: '1234567890',
      createdAt: new Date(2021, 1, 1),
      isLatest: false,
      isActive: false,
      tagName: 'v10',
    });

    await testerVersionsPage.visit({ course_slug: 'redis' });
    assert.strictEqual(testerVersionsPage.testerVersionListItem.length, 1, 'should have 1 tester version');

    this.server.create('course-tester-version', {
      activator: this.server.schema.users.first(),
      course: this.server.schema.courses.findBy({ slug: 'redis' }),
      commitSha: '1234567890',
      createdAt: new Date(2021, 1, 1),
      isLatest: true,
      isActive: true,
      lastActivatedAt: new Date(2021, 1, 1),
      tagName: 'v11',
    });

    await testerVersionsPage.clickOnSyncWithGitHubButton();
    await settled();

    assert.strictEqual(testerVersionsPage.testerVersionListItem.length, 2, 'should have 2 tester versions');
  });

  test('it has the correct tester repository link', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const course = this.server.schema.courses.findBy({ slug: 'redis' });
    course.update('testerRepositoryFullName', 'codecrafters-io/redis-tester');

    await testerVersionsPage.visit({ course_slug: course.slug });
    assert.strictEqual(testerVersionsPage.testerRepositoryLink.href, 'https://github.com/codecrafters-io/redis-tester');
    assert.strictEqual(testerVersionsPage.testerRepositoryLink.text, 'codecrafters-io/redis-tester');
  });

  test('it should not be accessible if user is course author and did not author current course', async function (assert) {
    testScenario(this.server);
    const course = this.server.schema.courses.findBy({ slug: 'redis' });
    signInAsCourseAuthor(this.owner, this.server, course);

    await testerVersionsPage.visit({ course_slug: 'git' });
    assert.strictEqual(currentURL(), '/catalog', 'should redirect to catalog page');
  });

  test('it should be accessible if user is course author and authored current course', async function (assert) {
    testScenario(this.server);
    const course = this.server.schema.courses.findBy({ slug: 'redis' });
    signInAsCourseAuthor(this.owner, this.server, course);

    await testerVersionsPage.visit({ course_slug: 'redis' });
    assert.strictEqual(currentURL(), '/courses/redis/admin/tester-versions', 'route should be accessible');
  });
});
