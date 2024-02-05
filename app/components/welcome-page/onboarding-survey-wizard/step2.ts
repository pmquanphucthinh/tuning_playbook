import { action } from '@ember/object';
import Component from '@glimmer/component';
import type OnboardingSurveyModel from 'codecrafters-frontend/models/onboarding-survey';

type Signature = {
  Args: {
    onboardingSurvey: OnboardingSurveyModel;
    onContinueButtonClick: () => void;
    onSurveyUpdated: () => void;
  };

  Element: HTMLDivElement;
};

export default class Step2Component extends Component<Signature> {
  options = ['Friend/Colleague', 'YouTube', 'Reddit', 'Hacker News', 'Twitter', 'GitHub', 'Google', 'Conference', "Don't remember"];

  @action
  handleFreeFormInputChange(freeFormInput: string) {
    this.args.onboardingSurvey.freeFormAnswerForReferralSource = freeFormInput;
    this.args.onSurveyUpdated();
  }

  @action
  handleSelectedOptionsChange(selectedOptions: string[]) {
    this.args.onboardingSurvey.selectedOptionsForReferralSource = selectedOptions;
    this.args.onSurveyUpdated();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'WelcomePage::OnboardingSurveyWizard::Step2': typeof Step2Component;
  }
}
