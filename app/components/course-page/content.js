import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class CoursePageContentComponent extends Component {
  @tracked currentCourseStageForSolution;
  @tracked currentCourseStageForSourceWalkthrough;
  @tracked isConfiguringGithubIntegration = false;
  @service('current-user') currentUserService;
  @service router;

  get currentUser() {
    return this.currentUserService.record;
  }

  @action
  async handleModalClose() {
    this.currentCourseStageForSolution = null;
    this.currentCourseStageForSourceWalkthrough = null;
    this.isConfiguringGithubIntegration = false;
  }

  @action
  async handleViewSourceWalkthroughButtonClick(courseStage) {
    this.currentCourseStageForSolution = null;
    this.currentCourseStageForSourceWalkthrough = courseStage;
  }

  @action
  async handleViewSolutionButtonClick(courseStage) {
    this.currentCourseStageForSourceWalkthrough = null;
    this.currentCourseStageForSolution = courseStage;
  }

  @action
  async handlePublishToGithubButtonClick() {
    await this.handleModalClose(); // Ensure other modals are closed.

    this.isConfiguringGithubIntegration = true;
  }

  get isViewingCourseStageSolution() {
    return !!this.currentCourseStageForSolution;
  }

  get isViewingCourseStageSourceWalkthrough() {
    return !!this.currentCourseStageForSourceWalkthrough;
  }

  get visiblePrivateLeaderboardFeatureSuggestion() {
    if (this.currentUserService.isAnonymous || this.currentUser.isTeamMember) {
      return null;
    }

    return this.currentUser.featureSuggestions.filterBy('featureIsPrivateLeaderboard').rejectBy('isDismissed').firstObject;
  }
}
