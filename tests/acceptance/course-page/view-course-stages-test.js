import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn, signInAsSubscriber, signInAsSubscribedTeamMember } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { currentURL, waitFor, waitUntil, find, isSettled, settled } from '@ember/test-helpers';

module('Acceptance | course-page | view-course-stages-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can view stages before starting course', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(currentURL(), '/courses/redis/introduction', 'introduction page is shown by default');

    await coursePage.sidebar.clickOnStepListItem('Respond to PING');
    assert.strictEqual(currentURL(), '/courses/redis/stages/2', 'stage 2 is shown');

    await coursePage.sidebar.clickOnStepListItem('Bind to a port');
    assert.strictEqual(currentURL(), '/courses/redis/stages/1', 'stage 1 is shown');

    await coursePage.sidebar.clickOnStepListItem('Repository Setup');
    assert.strictEqual(currentURL(), '/courses/redis/setup', 'setup page is shown');
  });

  test('can view previous stages after completing them', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let pythonRepository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      name: 'Python #1',
      user: currentUser,
    });

    this.server.create('course-stage-completion', {
      repository: pythonRepository,
      courseStage: redis.stages.models.sortBy('position').toArray()[1],
      completedAt: new Date(new Date().getTime() - 5 * 86400000), // 5 days ago
    });

    this.server.create('course-stage-completion', {
      repository: pythonRepository,
      courseStage: redis.stages.models.sortBy('position').toArray()[2],
      completedAt: new Date(new Date().getTime() - (1 + 86400000)), // yesterday
    });

    this.server.create('course-stage-completion', {
      repository: pythonRepository,
      courseStage: redis.stages.models.sortBy('position').toArray()[3],
      completedAt: new Date(new Date().getTime() - 10000), // today
    });

    this.server.create('course-stage-feedback-submission', {
      repository: pythonRepository,
      courseStage: redis.stages.models.sortBy('position').toArray()[3],
      status: 'closed',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Stage #5: Implement the ECHO command');

    await coursePage.sidebar.clickOnStepListItem('Respond to PING');
    await animationsSettled();

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Stage #2: Respond to PING', 'course stage item is active if clicked on');
    assert.strictEqual(coursePage.yourTaskCard.footerText, 'You completed this stage 5 days ago.', 'footer text for stage completed > 1 day');

    await percySnapshot('Course Stages - Completed stage');

    await coursePage.sidebar.clickOnStepListItem('Respond to multiple PINGs');
    await animationsSettled();

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Stage #3: Respond to multiple PINGs', 'course stage item is active if clicked on');
    assert.strictEqual(coursePage.yourTaskCard.footerText, 'You completed this stage yesterday.', 'footer text for stage completed yesterday');

    await coursePage.sidebar.clickOnStepListItem('Handle concurrent clients');
    await animationsSettled();

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Stage #4: Handle concurrent clients', 'course stage item is active if clicked on');
    assert.strictEqual(coursePage.desktopHeader.progressIndicatorText, 'You completed this stage today.', 'footer text for stage completed today');
  });

  test('stages should have an upgrade prompt if they are paid', async function (assert) {
    testScenario(this.server);

    let currentUser = this.server.schema.users.first();

    signIn(this.owner, this.server);

    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let docker = this.server.schema.courses.findBy({ slug: 'docker' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: docker,
      language: go,
      name: 'C #1',
      user: currentUser,
    });

    [2, 3].forEach((stageNumber) => {
      this.server.create('course-stage-completion', {
        repository: repository,
        courseStage: docker.stages.models.sortBy('position').toArray()[stageNumber - 1],
      });
    });

    this.server.create('course-stage-feedback-submission', {
      repository: repository,
      courseStage: docker.stages.models.sortBy('position').toArray()[2],
      status: 'closed',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Docker');

    assert.ok(coursePage.upgradePrompt.isVisible, 'course stage item that is not free should have upgrade prompt');

    await percySnapshot('Course Stages - Upgrade Prompt on Active Stage');

    await coursePage.sidebar.clickOnStepListItem('Handle exit codes').click(); // The previous completed stage
    assert.notOk(coursePage.hasUpgradePrompt, 'course stage item that is completed should not have upgrade prompt');

    await coursePage.sidebar.clickOnStepListItem('Process isolation').click(); // The next pending stage
    assert.notOk(coursePage.hasUpgradePrompt, 'course stage item that is pending should not have upgrade prompt');
  });

  test('upgrade prompt should have the correct copy when the user is eligible for both early bird and regional discounts', async function (assert) {
    testScenario(this.server);

    let currentUser = this.server.schema.users.first();
    currentUser.update('createdAt', new Date(new Date().getTime() - 23 * 60 * 60 * 1000));

    this.server.create('regional-discount', { percentOff: 50, countryName: 'India', id: 'current-discount-id' });

    signIn(this.owner, this.server);

    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let docker = this.server.schema.courses.findBy({ slug: 'docker' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: docker,
      language: go,
      name: 'C #1',
      user: currentUser,
    });

    [2, 3].forEach((stageNumber) => {
      this.server.create('course-stage-completion', {
        repository: repository,
        courseStage: docker.stages.models.sortBy('position').toArray()[stageNumber - 1],
      });
    });

    this.server.create('course-stage-feedback-submission', {
      repository: repository,
      courseStage: docker.stages.models.sortBy('position').toArray()[2],
      status: 'closed',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Docker');

    assert.strictEqual(coursePage.upgradePrompt.secondaryCopy, 'Plans start at $30/mo $15/mo (discounted price for India). Save an additional 40% by joining within an hour.');
  });

  test('upgrade prompt should have the correct copy when the user is eligible for an early bird discount', async function (assert) {
    testScenario(this.server);

    let currentUser = this.server.schema.users.first();
    currentUser.update('createdAt', new Date(new Date().getTime() - 23 * 60 * 60 * 1000));

    signIn(this.owner, this.server);

    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let docker = this.server.schema.courses.findBy({ slug: 'docker' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: docker,
      language: go,
      name: 'C #1',
      user: currentUser,
    });

    [2, 3].forEach((stageNumber) => {
      this.server.create('course-stage-completion', {
        repository: repository,
        courseStage: docker.stages.models.sortBy('position').toArray()[stageNumber - 1],
      });
    });

    this.server.create('course-stage-feedback-submission', {
      repository: repository,
      courseStage: docker.stages.models.sortBy('position').toArray()[2],
      status: 'closed',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Docker');

    assert.strictEqual(coursePage.upgradePrompt.secondaryCopy, 'Plans start at $30/mo. Save 40% by joining within an hour.');
  });

  test('upgrade prompt should have the correct copy when the user is eligible for a regional discount', async function (assert) {
    testScenario(this.server);

    let currentUser = this.server.schema.users.first();
    this.server.create('regional-discount', { percentOff: 50, countryName: 'India', id: 'current-discount-id' });

    signIn(this.owner, this.server);

    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let docker = this.server.schema.courses.findBy({ slug: 'docker' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: docker,
      language: go,
      name: 'C #1',
      user: currentUser,
    });

    [2, 3].forEach((stageNumber) => {
      this.server.create('course-stage-completion', {
        repository: repository,
        courseStage: docker.stages.models.sortBy('position').toArray()[stageNumber - 1],
      });
    });

    this.server.create('course-stage-feedback-submission', {
      repository: repository,
      courseStage: docker.stages.models.sortBy('position').toArray()[2],
      status: 'closed',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Docker');

    assert.strictEqual(coursePage.upgradePrompt.secondaryCopy, 'Plans start at $30/mo $15/mo (discounted price for India).');
  });

  test('upgrade prompt should have the correct copy when there are no discounts', async function (assert) {
    testScenario(this.server);

    let currentUser = this.server.schema.users.first();

    signIn(this.owner, this.server);

    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let docker = this.server.schema.courses.findBy({ slug: 'docker' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: docker,
      language: go,
      name: 'C #1',
      user: currentUser,
    });

    [2, 3].forEach((stageNumber) => {
      this.server.create('course-stage-completion', {
        repository: repository,
        courseStage: docker.stages.models.sortBy('position').toArray()[stageNumber - 1],
      });
    });

    this.server.create('course-stage-feedback-submission', {
      repository: repository,
      courseStage: docker.stages.models.sortBy('position').toArray()[2],
      status: 'closed',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Docker');

    assert.strictEqual(coursePage.upgradePrompt.secondaryCopy, 'Plans start at $30/mo.');
  });

  test('stages should not have an upgrade prompt if user is a subscriber', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let docker = this.server.schema.courses.findBy({ slug: 'docker' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: docker,
      language: go,
      name: 'C #1',
      user: currentUser,
    });

    this.server.create('course-stage-completion', {
      repository: repository,
      courseStage: docker.stages.models.sortBy('position').toArray()[1],
    });

    this.server.create('course-stage-completion', {
      repository: repository,
      courseStage: docker.stages.models.sortBy('position').toArray()[2],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Docker');

    assert.notOk(coursePage.hasUpgradePrompt, 'course stage item that is not free should have upgrade prompt');
  });

  test('stages should not have an upgrade prompt if user team has a subscription', async function (assert) {
    testScenario(this.server);
    signInAsSubscribedTeamMember(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let team = this.server.schema.teams.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let docker = this.server.schema.courses.findBy({ slug: 'docker' });

    this.server.schema.teamSubscriptions.create({
      team: team,
    });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: docker,
      language: go,
      name: 'C #1',
      user: currentUser,
    });

    this.server.create('course-stage-completion', {
      repository: repository,
      courseStage: docker.stages.models.sortBy('position').toArray()[1],
    });

    this.server.create('course-stage-completion', {
      repository: repository,
      courseStage: docker.stages.models.sortBy('position').toArray()[2],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Docker');

    assert.notOk(coursePage.hasUpgradePrompt, 'course stage item that is not free should have upgrade prompt');
  });

  test('first time visit has loading page', async function (assert) {
    this.server.timing = 25; // Ensure requests take long enough for us to observe the loading state

    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      name: 'Python #1',
      user: currentUser,
    });

    coursePage.visit({ course_slug: 'redis' });
    await waitFor('[data-test-loading]');

    assert.ok(find('[data-test-loading]'), 'loader should be present');
    await settled();
    assert.strictEqual(coursePage.desktopHeader.stepName, 'Stage #2: Respond to PING');
  });

  test('transition from courses page has no loading page', async function (assert) {
    this.server.timing = 25; // Ensure requests take long enough for us to observe the loading state

    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      name: 'Python #1',
      user: currentUser,
    });

    let loadingIndicatorWasRendered = false;

    await catalogPage.visit();
    catalogPage.clickOnCourse('Build your own Redis');

    await waitUntil(() => {
      if (isSettled()) {
        return true;
      } else if (find('[data-test-loading]')) {
        loadingIndicatorWasRendered = true;
      }
    });

    assert.notOk(loadingIndicatorWasRendered, 'expected loading indicator to not be rendered');
    assert.strictEqual(coursePage.desktopHeader.stepName, 'Stage #2: Respond to PING');
  });

  test('it should have a working expand/collapse sidebar button', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.ok(coursePage.hasExpandedSidebar, 'sidebar should be expanded by default');
    await coursePage.clickOnCollapseSidebarButton();
    assert.notOk(coursePage.hasExpandedSidebar, 'sidebar should be collapsed');
    await coursePage.clickOnExpandSidebarButton();
    assert.ok(coursePage.hasExpandedSidebar, 'sidebar should be expanded');

    const store = this.owner.lookup('service:store');
    const analyticsEvents = await store.findAll('analytics-event', { backgroundReload: false });
    const analyticsEventNames = analyticsEvents.map((analyticsEvent) => analyticsEvent.name);

    assert.ok(analyticsEventNames.includes('collapsed_course_page_sidebar'), 'collapsed_course_page_sidebar event should be tracked');
    assert.ok(analyticsEventNames.includes('expanded_course_page_sidebar'), 'expanded_course_page_sidebar event should be tracked');
  });

  test('it should have a working expand/collapse leaderboard button', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.ok(coursePage.hasExpandedLeaderboard, 'leaderboard should be expanded by default');
    await coursePage.clickOnCollapseLeaderboardButton();
    assert.notOk(coursePage.hasExpandedLeaderboard, 'leaderboard should be collapsed');
    await coursePage.clickOnExpandLeaderboardButton();
    assert.ok(coursePage.hasExpandedLeaderboard, 'leaderboard should be expanded');

    const store = this.owner.lookup('service:store');
    const analyticsEvents = await store.findAll('analytics-event', { backgroundReload: false });
    const analyticsEventNames = analyticsEvents.map((analyticsEvent) => analyticsEvent.name);

    assert.ok(analyticsEventNames.includes('collapsed_course_page_leaderboard'), 'collapsed_course_page_leaderboard event should be tracked');
    assert.ok(analyticsEventNames.includes('expanded_course_page_leaderboard'), 'expanded_course_page_leaderboard event should be tracked');
  });

  test('it should show a screencasts link in the second stage if there are screencasts available', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      name: 'Python #1',
      user: currentUser,
    });

    this.server.create('course-stage-screencast', {
      language: python,
      user: currentUser,
      courseStage: redis.stages.models.sortBy('position')[1],
      authorName: null,
      canonicalUrl: 'https://www.loom.com/share/1dd746eaaba34bc2b5459ad929934c08?sid=a5f6ec60-5ae4-4e9c-9566-33235d483431',
      publishedAt: '2023-06-30T19:11:29.254Z',
      description: 'Hey there! blah blah',
      durationInSeconds: 808.5666666666664,
      embedHtml:
        '\u003cdiv\u003e\u003cdiv style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"\u003e\u003ciframe src="//cdn.iframe.ly/api/iframe?click_to_play=1\u0026url=https%3A%2F%2Fwww.loom.com%2Fshare%2F1dd746eaaba34bc2b5459ad929934c08%3Fsid%3Da5f6ec60-5ae4-4e9c-9566-33235d483431\u0026key=3aafd05f43d700b9a7382620ac7cdfa3" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen scrolling="no" allow="encrypted-media *;"\u003e\u003c/iframe\u003e\u003c/div\u003e\u003c/div\u003e',
      sourceIconUrl: 'https://cdn.loom.com/assets/favicons-loom/android-chrome-192x192.png',
      originalUrl: 'https://www.loom.com/share/1dd746eaaba34bc2b5459ad929934c08?sid=a5f6ec60-5ae4-4e9c-9566-33235d483431',
      thumbnailUrl: 'https://cdn.loom.com/sessions/thumbnails/1dd746eaaba34bc2b5459ad929934c08-00001.gif',
      title: 'Testing Course Completion Functionality',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    assert.ok(coursePage.secondStageInstructionsCard.hasScreencastsLink, 'screencasts link should be present');

    await percySnapshot('Course Stages - How to pass stage 2');
  });

  test('it should not show a screencasts link in the second stage if there are no screencasts available', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      name: 'Python #1',
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    assert.notOk(coursePage.secondStageInstructionsCard.hasScreencastsLink, 'screencasts link should be present');
  });

  test('it should track when the monthly challenge banner is clicked', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const currentUser = this.server.schema.users.first();
    const python = this.server.schema.languages.findBy({ name: 'Python' });
    const redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      name: 'Python #1',
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await coursePage.monthlyChallengeBanner.click();

    const store = this.owner.lookup('service:store');
    const analyticsEvents = await store.findAll('analytics-event', { backgroundReload: false });
    const analyticsEventNames = analyticsEvents.map((analyticsEvent) => analyticsEvent.name);

    assert.ok(analyticsEventNames.includes('clicked_monthly_challenge_banner'), 'clicked_monthly_challenge_banner event should be tracked');
  });
});
