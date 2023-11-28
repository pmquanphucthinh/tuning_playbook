import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';
import RepositoryPoller from 'codecrafters-frontend/lib/repository-poller';
import config from 'codecrafters-frontend/config/environment';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseModel from 'codecrafters-frontend/models/course';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type Store from '@ember-data/store';
import type RouterService from '@ember/routing/router-service';
import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import type VisibilityService from 'codecrafters-frontend/services/visibility';
import type ActionCableConsumerService from 'codecrafters-frontend/services/action-cable-consumer';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

export type ModelType = {
  course: CourseModel;
  activeRepository: RepositoryModel;
  repositories: RepositoryModel[];
};

export default class CourseController extends Controller {
  declare model: ModelType;

  repositoryPoller: RepositoryPoller | null = null;

  queryParams = ['action', 'track', 'repo'];

  @service declare actionCableConsumer: ActionCableConsumerService;
  @service declare authenticator: AuthenticatorService;
  @service declare coursePageState: CoursePageStateService;
  @service declare store: Store;
  @service declare router: RouterService;
  @service declare visibility: VisibilityService;
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;

  // query params
  @tracked action: string | undefined = undefined;
  @tracked repo: string | undefined = undefined;
  @tracked track: string | undefined = undefined;

  @tracked polledRepository: RepositoryModel | null = null;
  @tracked configureGithubIntegrationModalIsOpen = false;
  @tracked sidebarIsExpandedOnDesktop = true;
  @tracked sidebarIsExpandedOnMobile = false;
  @tracked leaderboardIsExpanded = true;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get isDevelopmentOrTest() {
    return config.environment !== 'production';
  }

  get selectedRepositoryId() {
    return this.repo;
  }

  get visiblePrivateLeaderboardFeatureSuggestion() {
    if (this.authenticator.isAnonymous || (this.currentUser && this.currentUser.isTeamMember)) {
      return null;
    }

    // @ts-ignore - featureSuggestions is not typed yet
    return this.currentUser.featureSuggestions.filterBy('featureIsPrivateLeaderboard').rejectBy('isDismissed').firstObject;
  }

  @action
  handleCollapseLeaderboardButtonClick() {
    this.leaderboardIsExpanded = !this.leaderboardIsExpanded;

    this.analyticsEventTracker.track('collapsed_course_page_leaderboard', {
      course_id: this.model.course.id,
    });
  }

  @action
  handleCollapseSidebarButtonClick() {
    this.sidebarIsExpandedOnDesktop = !this.sidebarIsExpandedOnDesktop;

    this.analyticsEventTracker.track('collapsed_course_page_sidebar', {
      course_id: this.model.course.id,
    });
  }

  @action
  handleDidInsertContainer() {
    this.setupRouteChangeListeners();
    this.startRepositoryPoller();

    if (this.action === 'github_app_installation_completed') {
      this.configureGithubIntegrationModalIsOpen = true;

      next(() => {
        this.router.transitionTo({ queryParams: { action: null } }); // reset param
      });
    }
  }

  @action
  handleDidUpdateActiveRepositoryId() {
    if (this.polledRepository && this.polledRepository?.id === this.model.activeRepository?.id) {
      return;
    }

    this.stopRepositoryPoller();
    this.startRepositoryPoller();
  }

  @action
  handleExpandLeaderboardButtonClick() {
    this.leaderboardIsExpanded = !this.leaderboardIsExpanded;

    this.analyticsEventTracker.track('expanded_course_page_leaderboard', {
      course_id: this.model.course.id,
    });
  }

  @action
  handleExpandSidebarButtonClick() {
    this.sidebarIsExpandedOnDesktop = !this.sidebarIsExpandedOnDesktop;

    this.analyticsEventTracker.track('expanded_course_page_sidebar', {
      course_id: this.model.course.id,
    });
  }

  @action
  async handlePoll() {
    // Nothing to do at the moment
  }

  @action
  async handleRouteChanged() {
    this.sidebarIsExpandedOnMobile = false;
  }

  @action
  async handleWillDestroyContainer() {
    this.teardownRouteChangeListeners();
    this.stopRepositoryPoller();
  }

  @action
  setupRouteChangeListeners() {
    this.router.on('routeDidChange', this.handleRouteChanged);
  }

  startRepositoryPoller() {
    if (!this.model.activeRepository || !this.model.activeRepository.id) {
      return;
    }

    this.stopRepositoryPoller();

    this.repositoryPoller = new RepositoryPoller({
      store: this.store,
      visibilityService: this.visibility,
      actionCableConsumerService: this.actionCableConsumer,
    });

    this.repositoryPoller.start(this.model.activeRepository, this.handlePoll, 'RepositoryChannel', {
      repository_id: this.model.activeRepository.id,
    });

    this.polledRepository = this.model.activeRepository;
  }

  stopRepositoryPoller() {
    if (this.repositoryPoller) {
      this.repositoryPoller.stop();
    }

    this.polledRepository = null;
  }
  @action
  teardownRouteChangeListeners() {
    this.router.off('routeDidChange', this.handleRouteChanged);
  }
}
