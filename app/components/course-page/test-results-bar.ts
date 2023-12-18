import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { Step } from 'codecrafters-frontend/utils/course-page-step-list';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    activeStep: Step;
    currentStep: Step;
    repository: RepositoryModel;
  };
};

export default class TestResultsBarComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;
  @service declare authenticator: AuthenticatorService;
  @tracked activeTabSlug = 'logs'; // 'logs' | 'autofix'

  get availableTabSlugs() {
    if (this.args.activeStep.type === 'CourseStageStep') {
      if (this.authenticator.currentUser?.isStaff && (this.args.activeStep as CourseStageStep).courseStage.isSecond) {
        return ['logs', 'autofix'];
      } else {
        return ['logs'];
      }
    } else {
      return ['logs'];
    }
  }

  get isCollapsed() {
    return !this.isExpanded;
  }

  get isExpanded() {
    return this.coursePageState.testResultsBarIsExpanded;
  }

  @action
  handleCollapseButtonClick() {
    this.coursePageState.testResultsBarIsExpanded = false;
  }

  @action
  handleExpandButtonClick() {
    this.coursePageState.testResultsBarIsExpanded = true;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar': typeof TestResultsBarComponent;
  }
}
