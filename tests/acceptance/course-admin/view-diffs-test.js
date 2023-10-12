import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import submissionsPage from 'codecrafters-frontend/tests/pages/course-admin/submissions-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-admin | view-diffs', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('expandable chunks behave correctly', async function (assert) {
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

    let submission = this.server.create('submission', 'withFailureStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[2],
    });
    submission.update('changedFiles', [
      {
        filename: 'server.rb',
        diff: `    end

    def listen
      loop do
        client = @server.accept
+       handle_client(client)
+     end
+   end
+
+   def handle_client(client)
+     loop do
+       client.gets
+
        # TODO: Handle commands other than PING
        client.write("+PONG\\r\\n")
      end
    end
  end`,
      },
    ]);
    console.log(submission.changedFiles);

    await submissionsPage.visit({ course_slug: 'redis' });
    await submissionsPage.timelineContainer.entries.objectAt(1).click();
    await submissionsPage.clickOnLink('Diff');

    assert.strictEqual(submissionsPage.expandableChunks.length, 2);
    assert.ok(submissionsPage.expandableChunks.objectAt(0).text.includes('Expand 2 lines'));
    assert.ok(submissionsPage.expandableChunks.objectAt(1).text.includes('Expand 2 lines'));

    await submissionsPage.expandableChunks.objectAt(0).click();
    assert.strictEqual(submissionsPage.expandableChunks.length, 1);
  });
});
