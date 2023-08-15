import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import updatesPage from 'codecrafters-frontend/tests/pages/course-admin/updates-page';
import updatePage from 'codecrafters-frontend/tests/pages/course-admin/update-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-admin | view-update', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it has the correct link for viewing diffs', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const course = this.server.schema.courses.findBy({ slug: 'redis' });
    course.update('definitionRepositoryFullName', 'codecrafters-io/redis');

    const update = this.server.create('course-definition-update', {
      course: this.server.schema.courses.findBy({ slug: 'redis' }),
      definitionFileContentsDiff: '',
      description: 'Updated stage instructions for stage 1 & stage 2',
      lastErrorMessage: null,
      lastSyncedAt: new Date(2020, 1, 1),
      newCommitSha: '0987654321',
      newDefinitionFileContents: 'new contents',
      status: 'pending',
      summary: 'test',
    });

    const secondUpdate = this.server.create('course-definition-update', {
      course: this.server.schema.courses.findBy({ slug: 'redis' }),
      definitionFileContentsDiff: '',
      description: 'Updated stage instructions for stage 1 & stage 2',
      lastErrorMessage: null,
      lastSyncedAt: new Date(2021, 1, 1),
      newCommitSha: '1234567890',
      newDefinitionFileContents: 'new contents',
      oldCommitSha: '0987654321',
      oldDefinitionFileContents: 'old contents',
      status: 'pending',
      summary: 'test',
    });

    await updatesPage.visit({ course_slug: 'redis' });
    await updatesPage.updateListItems[1].clickOnViewUpdateButton();
    assert.strictEqual(updatePage.viewDiffLink.href, `https://github.com/${course.definitionRepositoryFullName}/commit/${update.newCommitSha}`);

    await updatesPage.visit({ course_slug: 'redis' });
    await updatesPage.updateListItems[0].clickOnViewUpdateButton();

    assert.strictEqual(
      updatePage.viewDiffLink.href,
      `https://github.com/${course.definitionRepositoryFullName}/compare/${secondUpdate.oldCommitSha}..${secondUpdate.newCommitSha}`,
    );
  });

  test('it should have a working button for syncing with github for individual update', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const update = this.server.create('course-definition-update', {
      course: this.server.schema.courses.findBy({ slug: 'redis' }),
      definitionFileContentsDiff: 'old contents',
      description: 'Updated stage instructions for stage 1 & stage 2',
      lastErrorMessage: null,
      lastSyncedAt: new Date(2020, 1, 1),
      newCommitSha: '0987654321',
      newDefinitionFileContents: 'new contents',
      status: 'pending',
      summary: 'test',
    });

    await updatesPage.visit({ course_slug: 'redis' });
    await updatesPage.updateListItems[0].clickOnViewUpdateButton();

    update.update('definitionFileContentsDiff', 'updated diff');

    await updatePage.clickOnSyncWithGitHubButton();
    assert.ok(updatePage.fileContentsDiff.text.includes('updated diff'), 'diff should be updated after syncing with github');
  });
});
