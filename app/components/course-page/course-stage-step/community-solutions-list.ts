import Component from '@glimmer/component';
import CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';
import rippleSpinnerImage from '/assets/images/icons/ripple-spinner.svg';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    solutions: CommunityCourseStageSolutionModel[];
    stageIncompleteModalWasDismissed: boolean;
    repository: RepositoryModel;
  };
};

export default class CommunitySolutionsListComponent extends Component<Signature> {
  rippleSpinnerImage = rippleSpinnerImage;

  @service declare authenticator: AuthenticatorService;
  @service declare coursePageState: CoursePageStateService;

  @tracked configureGithubIntegrationModalIsOpen = false;

  get shouldShowStageIncompleteModal() {
    return (
      !this.args.stageIncompleteModalWasDismissed &&
      this.coursePageState.currentStep.type === 'CourseStageStep' &&
      !(this.coursePageState.currentStep as CourseStageStep).courseStage.isFirst &&
      !(this.coursePageState.currentStep as CourseStageStep).courseStage.isSecond &&
      this.args.solutions.length > 0 &&
      this.coursePageState.currentStep.status !== 'complete'
    );
  }

  @action
  handleSolutionExpand(solution: CommunityCourseStageSolutionModel, solutionIndex: number) {
    if (this.authenticator.isAuthenticated) {
      solution.createView({ position_in_list: solutionIndex + 1 });
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionsList': typeof CommunitySolutionsListComponent;
  }
}
