import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';

export default class CourseStageItemActionButtonListComponent extends Component {
  @service store;
  @service visibility;
  transition = fade;

  get anyButtonIsVisible() {
    return this.shouldShowViewSolutionButton || this.shouldShowViewTestCasesButton || this.shouldShowViewSourceWalkthroughButton;
  }

  @action
  handleViewTestCasesButtonClicked() {
    window.open(this.args.courseStage.testerSourceCodeUrl, '_blank').focus();
  }

  get shouldShowViewSolutionButton() {
    return !!this.args.courseStage.solutions.firstObject;
  }

  get shouldShowViewTestCasesButton() {
    return this.args.courseStage.testerSourceCodeUrl;
  }

  get shouldShowViewSourceWalkthroughButton() {
    return this.args.courseStage.sourceWalkthrough;
  }
}